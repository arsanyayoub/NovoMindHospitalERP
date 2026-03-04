using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace HospitalERP.Application.Services;

public class UserService : IUserService
{
    private readonly IUnitOfWork _uow;

    public UserService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<PagedResult<UserDto>> GetUsersAsync(PagedRequest request)
    {
        var query = _uow.Users.Query().Include(u => u.Role).AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.ToLower();
            query = query.Where(u => u.Username.ToLower().Contains(search) 
                                  || u.FullName.ToLower().Contains(search) 
                                  || u.Email.ToLower().Contains(search));
        }

        var total = await query.CountAsync();
        var users = await query.OrderBy(u => u.FullName)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var dtos = users.Select(u => new UserDto(
            u.Id, u.Username, u.Email, u.FullName, u.PhoneNumber, u.RoleId, u.Role?.Name, u.IsActive, u.CreatedDate
        ));

        return new PagedResult<UserDto>(dtos, total, request.Page, request.PageSize);
    }

    public async Task<UserDto?> GetUserByIdAsync(int id)
    {
        var user = await _uow.Users.Query()
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == id);
            
        if (user == null) return null;

        return new UserDto(
            user.Id, user.Username, user.Email, user.FullName, user.PhoneNumber, user.RoleId, user.Role?.Name, user.IsActive, user.CreatedDate
        );
    }

    public async Task<UserDto> CreateUserAsync(CreateUserDto dto, string createdBy)
    {
        if (await _uow.Users.Query().AnyAsync(u => u.Username == dto.Username))
            throw new InvalidOperationException("Username is already taken.");

        if (await _uow.Users.Query().AnyAsync(u => u.Email == dto.Email))
            throw new InvalidOperationException("Email is already registered.");

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            FullName = dto.FullName,
            PhoneNumber = dto.PhoneNumber,
            RoleId = dto.RoleId,
            IsActive = dto.IsActive,
            PasswordHash = HashPassword(dto.Password),
            CreatedBy = createdBy,
            CreatedDate = DateTime.UtcNow
        };

        await _uow.Users.AddAsync(user);
        await _uow.SaveChangesAsync();

        return (await GetUserByIdAsync(user.Id))!;
    }

    public async Task<UserDto> UpdateUserAsync(int id, UpdateUserDto dto, string updatedBy)
    {
        var user = await _uow.Users.GetByIdAsync(id) ?? throw new KeyNotFoundException("User not found.");

        if (await _uow.Users.Query().AnyAsync(u => u.Email == dto.Email && u.Id != id))
            throw new InvalidOperationException("Email is already assigned to another user.");

        user.Email = dto.Email;
        user.FullName = dto.FullName;
        user.PhoneNumber = dto.PhoneNumber;
        user.RoleId = dto.RoleId;
        user.IsActive = dto.IsActive;
        user.UpdatedBy = updatedBy;
        user.UpdatedDate = DateTime.UtcNow;

        _uow.Users.Update(user);
        await _uow.SaveChangesAsync();

        return (await GetUserByIdAsync(user.Id))!;
    }

    public async Task ToggleUserStatusAsync(int id, string updatedBy)
    {
        var user = await _uow.Users.GetByIdAsync(id) ?? throw new KeyNotFoundException("User not found.");
        
        user.IsActive = !user.IsActive;
        user.UpdatedBy = updatedBy;
        user.UpdatedDate = DateTime.UtcNow;

        _uow.Users.Update(user);
        await _uow.SaveChangesAsync();
    }

    public async Task<IEnumerable<RoleDto>> GetRolesAsync()
    {
        var roles = await _uow.Roles.Query().OrderBy(r => r.Name).ToListAsync();
        return roles.Select(r => new RoleDto(r.Id, r.Name, r.Description));
    }

    private static string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }
}
