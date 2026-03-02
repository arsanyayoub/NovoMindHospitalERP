using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace HospitalERP.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _uow;
    private readonly IConfiguration _config;

    public AuthService(IUnitOfWork uow, IConfiguration config)
    {
        _uow = uow;
        _config = config;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _uow.Users.Query()
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Username == dto.Username && u.IsActive);
        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid username or password.");

        return await GenerateTokensAsync(user);
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var exists = await _uow.Users.AnyAsync(u => u.Username == dto.Username || u.Email == dto.Email);
        if (exists) throw new InvalidOperationException("Username or email already in use.");
        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            FullName = dto.FullName,
            PhoneNumber = dto.PhoneNumber,
            RoleId = dto.RoleId,
            CreatedBy = "system"
        };
        await _uow.Users.AddAsync(user);
        await _uow.SaveChangesAsync();
        var userWithRole = await _uow.Users.Query().Include(u => u.Role).FirstAsync(u => u.Id == user.Id);
        return await GenerateTokensAsync(userWithRole);
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenDto dto)
    {
        var user = await _uow.Users.Query().Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.RefreshToken == dto.RefreshToken && u.RefreshTokenExpiry > DateTime.UtcNow);
        if (user is null) throw new UnauthorizedAccessException("Invalid or expired refresh token.");
        return await GenerateTokensAsync(user);
    }

    public async Task LogoutAsync(int userId)
    {
        var user = await _uow.Users.GetByIdAsync(userId);
        if (user is not null)
        {
            user.RefreshToken = null;
            user.RefreshTokenExpiry = null;
            _uow.Users.Update(user);
            await _uow.SaveChangesAsync();
        }
    }

    public async Task ChangePasswordAsync(int userId, ChangePasswordDto dto)
    {
        var user = await _uow.Users.GetByIdAsync(userId) ?? throw new KeyNotFoundException();
        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
            throw new UnauthorizedAccessException("Current password is incorrect.");
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        user.UpdatedDate = DateTime.UtcNow;
        _uow.Users.Update(user);
        await _uow.SaveChangesAsync();
    }

    private async Task<AuthResponseDto> GenerateTokensAsync(User user)
    {
        var jwtKey = _config["Jwt:Key"] ?? "HospitalERPSecretKey2024SuperSecure!@#$";
        var jwtIssuer = _config["Jwt:Issuer"] ?? "HospitalERP";
        var jwtAudience = _config["Jwt:Audience"] ?? "HospitalERPClient";
        var expiryMinutes = int.TryParse(_config["Jwt:ExpiryMinutes"], out var m) ? m : 60;

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role?.Name ?? ""),
            new Claim("FullName", user.FullName)
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiry = DateTime.UtcNow.AddMinutes(expiryMinutes);
        var token = new JwtSecurityToken(jwtIssuer, jwtAudience, claims, expires: expiry, signingCredentials: creds);
        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

        var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        _uow.Users.Update(user);
        await _uow.SaveChangesAsync();

        return new AuthResponseDto(accessToken, refreshToken, expiry, user.Id, user.Username, user.FullName, user.Role?.Name ?? "");
    }
}
