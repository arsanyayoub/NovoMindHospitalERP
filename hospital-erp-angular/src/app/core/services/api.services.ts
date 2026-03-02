import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
}

export interface PagedRequest {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortDescending?: boolean;
}

@Injectable({ providedIn: 'root' })
export class PatientService {
    private readonly API = `${environment.apiUrl}/patients`;
    constructor(private http: HttpClient) { }

    getAll(request: PagedRequest = {}): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (request.search) params = params.set('search', request.search);
        return this.http.get<PagedResult<any>>(this.API, { params });
    }

    getById(id: number): Observable<any> { return this.http.get<any>(`${this.API}/${id}`); }
    create(dto: any): Observable<any> { return this.http.post<any>(this.API, dto); }
    update(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/${id}`, dto); }
    delete(id: number): Observable<void> { return this.http.delete<void>(`${this.API}/${id}`); }
    getAppointments(id: number): Observable<any[]> { return this.http.get<any[]>(`${this.API}/${id}/appointments`); }
    getInvoices(id: number): Observable<any[]> { return this.http.get<any[]>(`${this.API}/${id}/invoices`); }
}

@Injectable({ providedIn: 'root' })
export class DoctorService {
    private readonly API = `${environment.apiUrl}/doctors`;
    constructor(private http: HttpClient) { }

    getAll(request: PagedRequest = {}): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (request.search) params = params.set('search', request.search);
        return this.http.get<PagedResult<any>>(this.API, { params });
    }

    getById(id: number): Observable<any> { return this.http.get<any>(`${this.API}/${id}`); }
    create(dto: any): Observable<any> { return this.http.post<any>(this.API, dto); }
    update(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/${id}`, dto); }
    delete(id: number): Observable<void> { return this.http.delete<void>(`${this.API}/${id}`); }
    getAppointments(id: number, date?: string): Observable<any[]> {
        let params = new HttpParams();
        if (date) params = params.set('date', date);
        return this.http.get<any[]>(`${this.API}/${id}/appointments`, { params });
    }
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
    private readonly API = `${environment.apiUrl}/appointments`;
    constructor(private http: HttpClient) { }

    getAll(request: PagedRequest = {}, filters: any = {}): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (request.search) params = params.set('search', request.search);
        if (filters.date) params = params.set('date', filters.date);
        if (filters.doctorId) params = params.set('doctorId', filters.doctorId);
        if (filters.patientId) params = params.set('patientId', filters.patientId);
        if (filters.status) params = params.set('status', filters.status);
        return this.http.get<PagedResult<any>>(this.API, { params });
    }

    getById(id: number): Observable<any> { return this.http.get<any>(`${this.API}/${id}`); }
    getToday(): Observable<any[]> { return this.http.get<any[]>(`${this.API}/today`); }
    create(dto: any): Observable<any> { return this.http.post<any>(this.API, dto); }
    update(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/${id}`, dto); }
    delete(id: number): Observable<void> { return this.http.delete<void>(`${this.API}/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class InvoiceService {
    private readonly API = `${environment.apiUrl}/invoices`;
    constructor(private http: HttpClient) { }

    getAll(request: PagedRequest = {}, status?: string, type?: string): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (request.search) params = params.set('search', request.search);
        if (status) params = params.set('status', status);
        if (type) params = params.set('type', type);
        return this.http.get<PagedResult<any>>(this.API, { params });
    }

    getById(id: number): Observable<any> { return this.http.get<any>(`${this.API}/${id}`); }
    create(dto: any): Observable<any> { return this.http.post<any>(this.API, dto); }
    delete(id: number): Observable<void> { return this.http.delete<void>(`${this.API}/${id}`); }
    recordPayment(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/payment`, dto); }
    getPayments(id: number): Observable<any[]> { return this.http.get<any[]>(`${this.API}/${id}/payments`); }
}

@Injectable({ providedIn: 'root' })
export class AccountingService {
    private readonly API = `${environment.apiUrl}/accounting`;
    constructor(private http: HttpClient) { }

    getChartOfAccounts(): Observable<any[]> { return this.http.get<any[]>(`${this.API}/accounts`); }
    createAccount(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/accounts`, dto); }
    updateAccount(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/accounts/${id}`, dto); }
    getJournalEntries(request: PagedRequest = {}, from?: string, to?: string): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (from) params = params.set('from', from);
        if (to) params = params.set('to', to);
        return this.http.get<PagedResult<any>>(`${this.API}/journal-entries`, { params });
    }
    createJournalEntry(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/journal-entries`, dto); }
    postJournalEntry(id: number): Observable<any> { return this.http.post<any>(`${this.API}/journal-entries/${id}/post`, {}); }
    getFinancialReport(from: string, to: string): Observable<any> {
        return this.http.get<any>(`${this.API}/reports/financial`, { params: new HttpParams().set('from', from).set('to', to) });
    }
    getTrialBalance(asOf: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.API}/reports/trial-balance`, { params: new HttpParams().set('asOf', asOf) });
    }
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
    private readonly API = `${environment.apiUrl}/inventory`;
    constructor(private http: HttpClient) { }

    getItems(request: PagedRequest = {}): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (request.search) params = params.set('search', request.search);
        return this.http.get<PagedResult<any>>(`${this.API}/items`, { params });
    }
    createItem(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/items`, dto); }
    updateItem(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/items/${id}`, dto); }
    deleteItem(id: number): Observable<void> { return this.http.delete<void>(`${this.API}/items/${id}`); }
    getWarehouses(): Observable<any[]> { return this.http.get<any[]>(`${this.API}/warehouses`); }
    createWarehouse(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/warehouses`, dto); }
    getStock(warehouseId?: number, itemId?: number): Observable<any[]> {
        let params = new HttpParams();
        if (warehouseId) params = params.set('warehouseId', warehouseId);
        if (itemId) params = params.set('itemId', itemId);
        return this.http.get<any[]>(`${this.API}/stock`, { params });
    }
    getLowStock(): Observable<any[]> { return this.http.get<any[]>(`${this.API}/stock/low`); }
    transferStock(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/stock/transfer`, dto); }
}

@Injectable({ providedIn: 'root' })
export class PurchaseService {
    private readonly API = `${environment.apiUrl}/purchase`;
    constructor(private http: HttpClient) { }

    getSuppliers(request: PagedRequest = {}): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (request.search) params = params.set('search', request.search);
        return this.http.get<PagedResult<any>>(`${this.API}/suppliers`, { params });
    }
    createSupplier(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/suppliers`, dto); }
    updateSupplier(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/suppliers/${id}`, dto); }
    getPurchaseInvoices(request: PagedRequest = {}, status?: string): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (status) params = params.set('status', status);
        return this.http.get<PagedResult<any>>(`${this.API}/invoices`, { params });
    }
    createPurchaseInvoice(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/invoices`, dto); }
    payPurchaseInvoice(id: number, amount: number): Observable<any> { return this.http.post<any>(`${this.API}/invoices/${id}/pay`, amount); }
}

@Injectable({ providedIn: 'root' })
export class SalesService {
    private readonly API = `${environment.apiUrl}/sales`;
    constructor(private http: HttpClient) { }

    getCustomers(request: PagedRequest = {}): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (request.search) params = params.set('search', request.search);
        return this.http.get<PagedResult<any>>(`${this.API}/customers`, { params });
    }
    createCustomer(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/customers`, dto); }
    updateCustomer(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/customers/${id}`, dto); }
    getSalesInvoices(request: PagedRequest = {}, status?: string): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (status) params = params.set('status', status);
        return this.http.get<PagedResult<any>>(`${this.API}/invoices`, { params });
    }
    createSalesInvoice(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/invoices`, dto); }
    paySalesInvoice(id: number, amount: number): Observable<any> { return this.http.post<any>(`${this.API}/invoices/${id}/pay`, amount); }
}

@Injectable({ providedIn: 'root' })
export class HRService {
    private readonly API = `${environment.apiUrl}/hr`;
    constructor(private http: HttpClient) { }

    getEmployees(request: PagedRequest = {}): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (request.search) params = params.set('search', request.search);
        return this.http.get<PagedResult<any>>(`${this.API}/employees`, { params });
    }
    createEmployee(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/employees`, dto); }
    updateEmployee(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/employees/${id}`, dto); }
    deleteEmployee(id: number): Observable<void> { return this.http.delete<void>(`${this.API}/employees/${id}`); }
    getPayrolls(request: PagedRequest = {}, year?: number, month?: number): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (year) params = params.set('year', year);
        if (month) params = params.set('month', month);
        return this.http.get<PagedResult<any>>(`${this.API}/payrolls`, { params });
    }
    generatePayroll(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/payrolls`, dto); }
    processPayroll(id: number): Observable<any> { return this.http.post<any>(`${this.API}/payrolls/${id}/pay`, {}); }
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private readonly API = `${environment.apiUrl}/dashboard`;
    constructor(private http: HttpClient) { }
    get(): Observable<any> { return this.http.get<any>(this.API); }
}
