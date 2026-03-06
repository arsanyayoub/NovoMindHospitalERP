using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Domain.Enums;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace HospitalERP.Application.Services;

public class AccountingService : IAccountingService
{
    private readonly IUnitOfWork _uow;
    private readonly IAuditLogService _auditLog;
    public AccountingService(IUnitOfWork uow, IAuditLogService auditLog) 
    { 
        _uow = uow; 
        _auditLog = auditLog;
    }

    public async Task<IEnumerable<AccountDto>> GetChartOfAccountsAsync()
    {
        var accounts = await _uow.Accounts.Query()
            .Include(a => a.ParentAccount).OrderBy(a => a.AccountCode).ToListAsync();
        return accounts.Select(ToDto);
    }

    public async Task<AccountDto?> GetAccountByIdAsync(int id)
    {
        var a = await _uow.Accounts.Query().Include(a => a.ParentAccount).FirstOrDefaultAsync(a => a.Id == id);
        return a is null ? null : ToDto(a);
    }
    public async Task<AccountDto?> GetAccountByCodeAsync(string code)
    {
        var a = await _uow.Accounts.Query().FirstOrDefaultAsync(a => a.AccountCode == code);
        return a is null ? null : ToDto(a);
    }

    public async Task<AccountDto> CreateAccountAsync(CreateAccountDto dto, string createdBy)
    {
        if (!Enum.TryParse<AccountType>(dto.AccountType, out var at)) at = AccountType.Asset;
        var account = new Account
        {
            AccountCode = dto.AccountCode,
            AccountName = dto.AccountName,
            AccountNameAr = dto.AccountNameAr,
            AccountType = at,
            ParentAccountId = dto.ParentAccountId,
            Description = dto.Description,
            CreatedBy = createdBy
        };
        await _uow.Accounts.AddAsync(account);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(createdBy, createdBy, "Create", "Account", account.Id, $"Account {account.AccountName} ({account.AccountCode}) created.");
        return ToDto(account);
    }

    public async Task<AccountDto> UpdateAccountAsync(int id, CreateAccountDto dto, string updatedBy)
    {
        var account = await _uow.Accounts.GetByIdAsync(id) ?? throw new KeyNotFoundException();
        if (!Enum.TryParse<AccountType>(dto.AccountType, out var at)) at = account.AccountType;
        account.AccountCode = dto.AccountCode;
        account.AccountName = dto.AccountName;
        account.AccountNameAr = dto.AccountNameAr;
        account.AccountType = at;
        account.ParentAccountId = dto.ParentAccountId;
        account.Description = dto.Description;
        account.UpdatedBy = updatedBy;
        _uow.Accounts.Update(account);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(updatedBy, updatedBy, "Update", "Account", account.Id, $"Account {account.AccountName} updated.");
        return ToDto(account);
    }

    public async Task<PagedResult<JournalEntryDto>> GetJournalEntriesAsync(PagedRequest request, DateTime? from, DateTime? to)
    {
        var query = _uow.JournalEntries.Query().Include(je => je.Lines).ThenInclude(l => l.Account);
        var filtered = query.AsQueryable();
        if (from.HasValue) filtered = filtered.Where(je => je.EntryDate >= from.Value);
        if (to.HasValue) filtered = filtered.Where(je => je.EntryDate <= to.Value);
        if (!string.IsNullOrWhiteSpace(request.Search))
            filtered = filtered.Where(je => je.EntryNumber.Contains(request.Search) || je.Description.Contains(request.Search));
        var total = await filtered.CountAsync();
        var items = await filtered.OrderByDescending(je => je.EntryDate)
            .Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync();
        return new PagedResult<JournalEntryDto>(items.Select(ToJeDto), total, request.Page, request.PageSize);
    }

    public async Task<JournalEntryDto?> GetJournalEntryByIdAsync(int id)
    {
        var je = await _uow.JournalEntries.Query()
            .Include(je => je.Lines).ThenInclude(l => l.Account)
            .FirstOrDefaultAsync(je => je.Id == id);
        return je is null ? null : ToJeDto(je);
    }

    public async Task<JournalEntryDto> CreateJournalEntryAsync(CreateJournalEntryDto dto, string createdBy)
    {
        var totalDebit = dto.Lines.Sum(l => l.DebitAmount);
        var totalCredit = dto.Lines.Sum(l => l.CreditAmount);
        if (Math.Round(totalDebit, 2) != Math.Round(totalCredit, 2))
            throw new InvalidOperationException("Journal entry must balance: Total Debit must equal Total Credit.");
        var count = await _uow.JournalEntries.CountAsync();
        var je = new JournalEntry
        {
            EntryNumber = $"JE{(count + 1):D6}",
            EntryDate = dto.EntryDate,
            Description = dto.Description,
            Reference = dto.Reference,
            TotalDebit = totalDebit,
            TotalCredit = totalCredit,
            CreatedBy = createdBy,
            Lines = dto.Lines.Select(l => new JournalEntryLine
            {
                AccountId = l.AccountId,
                DebitAmount = l.DebitAmount,
                CreditAmount = l.CreditAmount,
                Description = l.Description,
                CreatedBy = createdBy
            }).ToList()
        };
        await _uow.JournalEntries.AddAsync(je);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(createdBy, createdBy, "Create", "JournalEntry", je.Id, $"Journal Entry {je.EntryNumber} created.");
        return (await GetJournalEntryByIdAsync(je.Id))!;
    }

    public async Task PostJournalEntryAsync(int id, string postedBy)
    {
        var je = await _uow.JournalEntries.Query()
            .Include(j => j.Lines).ThenInclude(l => l.Account)
            .FirstOrDefaultAsync(j => j.Id == id)
            ?? throw new KeyNotFoundException($"Journal Entry {id} not found.");
        if (je.Status != JournalEntryStatus.Draft)
            throw new InvalidOperationException("Only draft entries can be posted.");
        je.Status = JournalEntryStatus.Posted;
        je.UpdatedBy = postedBy;
        // Update account balances
        foreach (var line in je.Lines)
        {
            var account = line.Account;
            account.Balance += line.DebitAmount - line.CreditAmount;
            _uow.Accounts.Update(account);
        }
        _uow.JournalEntries.Update(je);
        await _uow.SaveChangesAsync();
        await _auditLog.LogAsync(postedBy, postedBy, "Post", "JournalEntry", id, $"Journal Entry {je.EntryNumber} posted.");
    }

    public async Task<FinancialReportDto> GetFinancialReportAsync(DateTime from, DateTime to)
    {
        var accounts = await _uow.Accounts.Query().Include(a => a.JournalEntryLines)
            .ThenInclude(l => l.JournalEntry).ToListAsync();
        var revenue = accounts.Where(a => a.AccountType == AccountType.Revenue).Sum(a => a.Balance);
        var expenses = accounts.Where(a => a.AccountType == AccountType.Expense).Sum(a => a.Balance);
        var assets = accounts.Where(a => a.AccountType == AccountType.Asset).Sum(a => a.Balance);
        var liabilities = accounts.Where(a => a.AccountType == AccountType.Liability).Sum(a => a.Balance);
        var equity = accounts.Where(a => a.AccountType == AccountType.Equity).Sum(a => a.Balance);
        return new FinancialReportDto(revenue, expenses, revenue - expenses, assets, liabilities, equity,
            accounts.Where(a => a.AccountType == AccountType.Revenue).Select(a => new AccountBalanceDto(a.AccountCode, a.AccountName, a.Balance)).ToList(),
            accounts.Where(a => a.AccountType == AccountType.Expense).Select(a => new AccountBalanceDto(a.AccountCode, a.AccountName, a.Balance)).ToList());
    }

    public async Task<IEnumerable<AccountBalanceDto>> GetTrialBalanceAsync(DateTime asOf)
    {
        var accounts = await _uow.Accounts.Query().OrderBy(a => a.AccountCode).ToListAsync();
        return accounts.Select(a => new AccountBalanceDto(a.AccountCode, a.AccountName, a.Balance));
    }

    private static AccountDto ToDto(Account a) => new(
        a.Id, a.AccountCode, a.AccountName, a.AccountNameAr, a.AccountType.ToString(),
        a.ParentAccountId, a.ParentAccount?.AccountName, a.Balance, a.IsActive, a.Description);

    private static JournalEntryDto ToJeDto(JournalEntry je) => new(
        je.Id, je.EntryNumber, je.EntryDate, je.Description, je.Reference, je.Status.ToString(),
        je.TotalDebit, je.TotalCredit,
        je.Lines.Select(l => new JournalEntryLineDto(l.AccountId, l.Account?.AccountName ?? "", l.DebitAmount, l.CreditAmount, l.Description)).ToList(),
        je.CreatedDate);
}
