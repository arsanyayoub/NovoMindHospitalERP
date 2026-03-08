using HospitalERP.Application.DTOs;
using HospitalERP.Application.Interfaces;
using HospitalERP.Domain.Entities;
using HospitalERP.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HospitalERP.Domain.Enums;

namespace HospitalERP.Application.Services;

public class AccountingService : IAccountingService
{
    private readonly IUnitOfWork _uow;

    public AccountingService(IUnitOfWork uow)
    {
        _uow = uow;
    }

    public async Task<IEnumerable<AccountDto>> GetChartOfAccountsAsync()
    {
        return await _uow.Accounts.Query()
            .Include(a => a.ParentAccount)
            .OrderBy(a => a.AccountCode)
            .Select(a => new AccountDto(a.Id, a.AccountCode, a.AccountName, a.AccountNameAr, a.AccountType.ToString(), a.ParentAccountId, a.ParentAccount != null ? a.ParentAccount.AccountName : null, a.Balance, a.IsActive, a.Description))
            .ToListAsync();
    }

    public async Task<AccountDto?> GetAccountByIdAsync(int id)
    {
        var a = await _uow.Accounts.Query().Include(ac => ac.ParentAccount).FirstOrDefaultAsync(ac => ac.Id == id);
        if (a == null) return null;
        return new AccountDto(a.Id, a.AccountCode, a.AccountName, a.AccountNameAr, a.AccountType.ToString(), a.ParentAccountId, a.ParentAccount?.AccountName, a.Balance, a.IsActive, a.Description);
    }

    public async Task<AccountDto?> GetAccountByCodeAsync(string code)
    {
        var a = await _uow.Accounts.Query().Include(ac => ac.ParentAccount).FirstOrDefaultAsync(ac => ac.AccountCode == code);
        if (a == null) return null;
        return new AccountDto(a.Id, a.AccountCode, a.AccountName, a.AccountNameAr, a.AccountType.ToString(), a.ParentAccountId, a.ParentAccount?.AccountName, a.Balance, a.IsActive, a.Description);
    }

    public async Task<AccountDto> CreateAccountAsync(CreateAccountDto dto, string createdBy)
    {
        if (!Enum.TryParse<AccountType>(dto.AccountType, out var acctType))
        {
            acctType = AccountType.Asset;
        }

        var account = new Account
        {
            AccountCode = dto.AccountCode,
            AccountName = dto.AccountName,
            AccountNameAr = dto.AccountNameAr,
            AccountType = acctType,
            ParentAccountId = dto.ParentAccountId,
            Description = dto.Description,
            Balance = 0,
            CreatedBy = createdBy
        };

        await _uow.Accounts.AddAsync(account);
        await _uow.SaveChangesAsync();

        return new AccountDto(account.Id, account.AccountCode, account.AccountName, account.AccountNameAr, account.AccountType.ToString(), account.ParentAccountId, null, account.Balance, account.IsActive, account.Description);
    }

    public async Task<AccountDto> UpdateAccountAsync(int id, CreateAccountDto dto, string updatedBy)
    {
        var account = await _uow.Accounts.GetByIdAsync(id);
        if (account == null) throw new Exception("Account not found");

        if (!Enum.TryParse<AccountType>(dto.AccountType, out var acctType)) acctType = AccountType.Asset;

        account.AccountCode = dto.AccountCode;
        account.AccountName = dto.AccountName;
        account.AccountNameAr = dto.AccountNameAr;
        account.AccountType = acctType;
        account.ParentAccountId = dto.ParentAccountId;
        account.Description = dto.Description;
        account.UpdatedBy = updatedBy;
        account.UpdatedDate = DateTime.UtcNow;

        await _uow.SaveChangesAsync();

        return new AccountDto(account.Id, account.AccountCode, account.AccountName, account.AccountNameAr, account.AccountType.ToString(), account.ParentAccountId, null, account.Balance, account.IsActive, account.Description);
    }

    public async Task<PagedResult<JournalEntryDto>> GetJournalEntriesAsync(PagedRequest request, DateTime? from, DateTime? to)
    {
        var query = _uow.JournalEntries.Query().Include(je => je.Lines).ThenInclude(l => l.Account).AsQueryable();

        if (from.HasValue) query = query.Where(je => je.EntryDate >= from.Value);
        if (to.HasValue) query = query.Where(je => je.EntryDate <= to.Value);

        var total = await query.CountAsync();
        var items = await query.OrderByDescending(je => je.EntryDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var dtos = items.Select(je => new JournalEntryDto(
            je.Id, je.EntryNumber, je.EntryDate, je.Description, je.Reference, je.Status.ToString(), je.TotalDebit, je.TotalCredit,
            je.Lines.Select(l => new JournalEntryLineDto(l.AccountId, l.Account?.AccountName ?? "", l.DebitAmount, l.CreditAmount, l.Description)).ToList(),
            je.CreatedDate
        )).ToList();

        return new PagedResult<JournalEntryDto>(dtos, total, request.Page, request.PageSize);
    }

    public async Task<JournalEntryDto?> GetJournalEntryByIdAsync(int id)
    {
        var je = await _uow.JournalEntries.Query().Include(j => j.Lines).ThenInclude(l => l.Account).FirstOrDefaultAsync(j => j.Id == id);
        if (je == null) return null;

        return new JournalEntryDto(
            je.Id, je.EntryNumber, je.EntryDate, je.Description, je.Reference, je.Status.ToString(), je.TotalDebit, je.TotalCredit,
            je.Lines.Select(l => new JournalEntryLineDto(l.AccountId, l.Account?.AccountName ?? "", l.DebitAmount, l.CreditAmount, l.Description)).ToList(),
            je.CreatedDate
        );
    }

    public async Task<JournalEntryDto> CreateJournalEntryAsync(CreateJournalEntryDto dto, string createdBy)
    {
        var entryNumber = $"JE-{DateTime.UtcNow:yyyyMMddHHmmss}";
        var entry = new JournalEntry
        {
            EntryNumber = entryNumber,
            EntryDate = dto.EntryDate,
            Description = dto.Description,
            Reference = dto.Reference,
            Status = JournalEntryStatus.Draft,
            CreatedBy = createdBy
        };

        decimal tDebit = 0, tCredit = 0;

        foreach (var line in dto.Lines)
        {
            entry.Lines.Add(new JournalEntryLine
            {
                AccountId = line.AccountId,
                DebitAmount = line.DebitAmount,
                CreditAmount = line.CreditAmount,
                Description = line.Description
            });
            tDebit += line.DebitAmount;
            tCredit += line.CreditAmount;
        }

        entry.TotalDebit = tDebit;
        entry.TotalCredit = tCredit;

        await _uow.JournalEntries.AddAsync(entry);
        await _uow.SaveChangesAsync();

        return await GetJournalEntryByIdAsync(entry.Id) ?? throw new Exception("Creation failed");
    }

    public async Task PostJournalEntryAsync(int id, string postedBy)
    {
        var entry = await _uow.JournalEntries.Query().Include(je => je.Lines).FirstOrDefaultAsync(je => je.Id == id);
        if (entry == null || entry.Status == JournalEntryStatus.Posted) return;
        if (entry.TotalDebit != entry.TotalCredit) throw new InvalidOperationException("Unbalanced journal entry.");

        entry.Status = JournalEntryStatus.Posted;
        entry.UpdatedBy = postedBy;
        entry.UpdatedDate = DateTime.UtcNow;

        foreach (var line in entry.Lines)
        {
            var account = await _uow.Accounts.GetByIdAsync(line.AccountId);
            if (account != null)
            {
                if (line.DebitAmount > 0)
                {
                    if (account.AccountType == AccountType.Asset || account.AccountType == AccountType.Expense)
                        account.Balance += line.DebitAmount;
                    else
                        account.Balance -= line.DebitAmount;
                }
                if (line.CreditAmount > 0)
                {
                    if (account.AccountType == AccountType.Liability || account.AccountType == AccountType.Equity || account.AccountType == AccountType.Revenue)
                        account.Balance += line.CreditAmount;
                    else
                        account.Balance -= line.CreditAmount;
                }
            }
        }
        await _uow.SaveChangesAsync();
    }

    public async Task<FinancialReportDto> GetFinancialReportAsync(DateTime from, DateTime to)
    {
        var incomeAccts = await _uow.Accounts.Query().Where(a => a.AccountType == AccountType.Revenue && a.IsActive).ToListAsync();
        var expenseAccts = await _uow.Accounts.Query().Where(a => a.AccountType == AccountType.Expense && a.IsActive).ToListAsync();
        
        var totRev = incomeAccts.Sum(a => a.Balance);
        var totExp = expenseAccts.Sum(a => a.Balance);
        
        var netInc = totRev - totExp;

        return new FinancialReportDto(
            TotalRevenue: totRev,
            TotalExpenses: totExp,
            NetIncome: netInc,
            TotalAssets: await _uow.Accounts.Query().Where(a => a.AccountType == AccountType.Asset).SumAsync(a => a.Balance),
            TotalLiabilities: await _uow.Accounts.Query().Where(a => a.AccountType == AccountType.Liability).SumAsync(a => a.Balance),
            TotalEquity: await _uow.Accounts.Query().Where(a => a.AccountType == AccountType.Equity).SumAsync(a => a.Balance),
            IncomeAccounts: incomeAccts.Select(a => new AccountBalanceDto(a.AccountCode, a.AccountName, a.Balance)).ToList(),
            ExpenseAccounts: expenseAccts.Select(a => new AccountBalanceDto(a.AccountCode, a.AccountName, a.Balance)).ToList()
        );
    }

    public async Task<IEnumerable<AccountBalanceDto>> GetTrialBalanceAsync(DateTime asOf)
    {
        var accounts = await _uow.Accounts.Query().Where(a => a.IsActive).ToListAsync();
        return accounts.Select(a => new AccountBalanceDto(a.AccountCode, a.AccountName, a.Balance)).ToList();
    }
}
