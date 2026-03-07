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
    getVitals(id: number): Observable<any[]> { return this.http.get<any[]>(`${this.API}/${id}/vitals`); }
    getPrescriptions(id: number): Observable<any[]> { return this.http.get<any[]>(`${this.API}/${id}/prescriptions`); }
    getLabRequests(id: number): Observable<any[]> { return this.http.get<any[]>(`${this.API}/${id}/lab-requests`); }
    getRadiologyRequests(id: number): Observable<any[]> { return this.http.get<any[]>(`${this.API}/${id}/radiology-requests`); }
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
    downloadPdf(id: number): Observable<Blob> { return this.http.get(`${this.API}/${id}/pdf`, { responseType: 'blob' }); }
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

    getItems(request: PagedRequest = {}, category?: string): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (request.search) params = params.set('search', request.search);
        if (category) params = params.set('category', category);
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

    // ---------- Batches ----------
    getBatches(request: PagedRequest = {}, filters: { itemId?: number; warehouseId?: number; excludeExpired?: boolean; excludeExhausted?: boolean } = {}): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (request.search) params = params.set('search', request.search);
        if (filters.itemId) params = params.set('itemId', filters.itemId);
        if (filters.warehouseId) params = params.set('warehouseId', filters.warehouseId);
        if (filters.excludeExpired != null) params = params.set('excludeExpired', filters.excludeExpired);
        if (filters.excludeExhausted != null) params = params.set('excludeExhausted', filters.excludeExhausted);
        return this.http.get<PagedResult<any>>(`${this.API}/batches`, { params });
    }
    getBatch(id: number): Observable<any> { return this.http.get<any>(`${this.API}/batches/${id}`); }
    createBatch(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/batches`, dto); }
    updateBatch(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/batches/${id}`, dto); }
    deleteBatch(id: number): Observable<void> { return this.http.delete<void>(`${this.API}/batches/${id}`); }

    // ---------- Packaging Units ----------
    getPackagingUnits(itemId: number): Observable<any[]> { return this.http.get<any[]>(`${this.API}/items/${itemId}/packaging-units`); }
    createPackagingUnit(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/packaging-units`, dto); }
    deletePackagingUnit(id: number): Observable<void> { return this.http.delete<void>(`${this.API}/packaging-units/${id}`); }

    // ---------- Barcode Scan ----------
    scanBarcode(barcode: string, warehouseId?: number): Observable<any> {
        let params = new HttpParams().set('barcode', barcode);
        if (warehouseId) params = params.set('warehouseId', warehouseId);
        return this.http.get<any>(`${this.API}/scan`, { params });
    }

    // ---------- Reports ----------
    getTransactions(itemId?: number, warehouseId?: number, type?: string, from?: string, to?: string): Observable<any[]> {
        let params = new HttpParams();
        if (itemId) params = params.set('itemId', itemId);
        if (warehouseId) params = params.set('warehouseId', warehouseId);
        if (type) params = params.set('type', type);
        if (from) params = params.set('from', from);
        if (to) params = params.set('to', to);
        return this.http.get<any[]>(`${this.API}/transactions`, { params });
    }

    downloadBatchReport(warehouseId?: number, status?: string): Observable<Blob> {
        let params = new HttpParams();
        if (warehouseId) params = params.set('warehouseId', warehouseId);
        if (status) params = params.set('status', status);
        return this.http.get(`${this.API}/reports/pdf`, { params, responseType: 'blob' });
    }
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
    bulkGeneratePayroll(year: number, month: number): Observable<any> {
        return this.http.post<any>(`${this.API}/payrolls/bulk`, null, { params: new HttpParams().set('year', year).set('month', month) });
    }
    processPayroll(id: number): Observable<any> { return this.http.post<any>(`${this.API}/payrolls/${id}/pay`, {}); }

    // Attendance
    getAttendance(req: any, employeeId?: number, fromDate?: string, toDate?: string): Observable<PagedResult<any>> {
        let p = new HttpParams();
        if (req.page) p = p.set('page', req.page);
        if (req.pageSize) p = p.set('pageSize', req.pageSize);
        if (employeeId) p = p.set('employeeId', employeeId);
        if (fromDate) p = p.set('fromDate', fromDate);
        if (toDate) p = p.set('toDate', toDate);
        return this.http.get<PagedResult<any>>(`${this.API}/attendance`, { params: p });
    }
    recordAttendance(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/attendance`, dto); }
}

@Injectable({ providedIn: 'root' })
export class ReportingService {
    private readonly API = `${environment.apiUrl}/reporting`;
    constructor(private http: HttpClient) { }
    getPatients(from: string, to: string): Observable<any> {
        return this.http.get<any>(`${this.API}/patients`, { params: new HttpParams().set('from', from).set('to', to) });
    }
    getAppointments(from: string, to: string): Observable<any> {
        return this.http.get<any>(`${this.API}/appointments`, { params: new HttpParams().set('from', from).set('to', to) });
    }
    getLab(from: string, to: string): Observable<any> {
        return this.http.get<any>(`${this.API}/lab`, { params: new HttpParams().set('from', from).set('to', to) });
    }
    getRadiology(from: string, to: string): Observable<any> {
        return this.http.get<any>(`${this.API}/radiology`, { params: new HttpParams().set('from', from).set('to', to) });
    }
    getPharmacy(from: string, to: string): Observable<any> {
        return this.http.get<any>(`${this.API}/pharmacy`, { params: new HttpParams().set('from', from).set('to', to) });
    }
    getInventory(): Observable<any> {
        return this.http.get<any>(`${this.API}/inventory`);
    }
    getHR(year: number): Observable<any> {
        return this.http.get<any>(`${this.API}/hr`, { params: new HttpParams().set('year', year) });
    }
    getBeds(from: string, to: string): Observable<any> {
        return this.http.get<any>(`${this.API}/beds`, { params: new HttpParams().set('from', from).set('to', to) });
    }
    getOT(from: string, to: string): Observable<any> {
        return this.http.get<any>(`${this.API}/ot`, { params: new HttpParams().set('from', from).set('to', to) });
    }

}

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private readonly API = `${environment.apiUrl}/dashboard`;
    constructor(private http: HttpClient) { }
    get(): Observable<any> { return this.http.get<any>(this.API); }
}

@Injectable({ providedIn: 'root' })
export class LabService {
    private readonly API = `${environment.apiUrl}/lab`;
    constructor(private http: HttpClient) { }
    getTests(req: any): Observable<any> { return this.http.get<any>(`${this.API}/tests`, { params: req }); }
    getTest(id: number): Observable<any> { return this.http.get<any>(`${this.API}/tests/${id}`); }
    createTest(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/tests`, dto); }
    updateTest(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/tests/${id}`, dto); }
    deleteTest(id: number): Observable<any> { return this.http.delete(`${this.API}/tests/${id}`); }
    getRequests(req: any, status?: string): Observable<any> {
        let p = new HttpParams({ fromObject: req });
        if (status) p = p.set('status', status);
        return this.http.get<any>(`${this.API}/requests`, { params: p });
    }
    getRequest(id: number): Observable<any> { return this.http.get<any>(`${this.API}/requests/${id}`); }
    createRequest(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/requests`, dto); }
    updateResult(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/results/${id}`, dto); }
    completeRequest(id: number): Observable<any> { return this.http.post<any>(`${this.API}/requests/${id}/complete`, {}); }
    downloadPdf(id: number): Observable<Blob> { return this.http.get(`${this.API}/requests/${id}/pdf`, { responseType: 'blob' }); }

    updateSpecimenStatus(id: number, status: string, collectedBy?: string): Observable<any> {
        let p = new HttpParams().set('status', status);
        if (collectedBy) p = p.set('collectedBy', collectedBy);
        return this.http.patch<any>(`${this.API}/requests/${id}/specimen-status`, {}, { params: p });
    }

    addTestRange(testId: number, dto: any): Observable<any> {
        return this.http.post<any>(`${this.API}/tests/${testId}/ranges`, dto);
    }

    getTestRanges(testId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.API}/tests/${testId}/ranges`);
    }
}

@Injectable({ providedIn: 'root' })
export class RadiologyService {
    private readonly API = `${environment.apiUrl}/radiology`;
    constructor(private http: HttpClient) { }
    getTests(req: any): Observable<any> { return this.http.get<any>(`${this.API}/tests`, { params: req }); }
    getTest(id: number): Observable<any> { return this.http.get<any>(`${this.API}/tests/${id}`); }
    createTest(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/tests`, dto); }
    updateTest(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/tests/${id}`, dto); }
    deleteTest(id: number): Observable<any> { return this.http.delete(`${this.API}/tests/${id}`); }
    getRequests(req: any, status?: string): Observable<any> {
        let p = new HttpParams({ fromObject: req });
        if (status) p = p.set('status', status);
        return this.http.get<any>(`${this.API}/requests`, { params: p });
    }
    getRequest(id: number): Observable<any> { return this.http.get<any>(`${this.API}/requests/${id}`); }
    createRequest(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/requests`, dto); }
    updateResult(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/results/${id}`, dto); }
    completeRequest(id: number): Observable<any> { return this.http.post<any>(`${this.API}/requests/${id}/complete`, {}); }
    downloadPdf(id: number): Observable<Blob> { return this.http.get(`${this.API}/requests/${id}/pdf`, { responseType: 'blob' }); }

    getTemplates(category?: string): Observable<any[]> {
        let p = new HttpParams();
        if (category) p = p.set('category', category);
        return this.http.get<any[]>(`${this.API}/templates`, { params: p });
    }

    createTemplate(dto: any): Observable<any> {
        return this.http.post<any>(`${this.API}/templates`, dto);
    }
}

@Injectable({ providedIn: 'root' })
export class ClinicalService {
    private readonly API = `${environment.apiUrl}/clinical`;
    constructor(private http: HttpClient) { }
    getVitals(req: any, patientId?: number, admissionId?: number): Observable<any> {
        let p = new HttpParams({ fromObject: req });
        if (patientId) p = p.set('patientId', patientId);
        if (admissionId) p = p.set('admissionId', admissionId);
        return this.http.get<any>(`${this.API}/vitals`, { params: p });
    }
    createVital(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/vitals`, dto); }
    deleteVital(id: number): Observable<any> { return this.http.delete(`${this.API}/vitals/${id}`); }

    // Nursing Assessments
    getNursingAssessments(admissionId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.API}/nursing-assessments/${admissionId}`);
    }
    createNursingAssessment(dto: any): Observable<any> {
        return this.http.post<any>(`${this.API}/nursing-assessments`, dto);
    }

    exportEmr(patientId: number, admissionId?: number): Observable<Blob> {
        let p = new HttpParams();
        if (admissionId) p = p.set('admissionId', admissionId);
        return this.http.get(`${this.API}/export/${patientId}`, { params: p, responseType: 'blob' });
    }

    // Encounters
    getEncounters(req: any, patientId?: number, doctorId?: number): Observable<any> {
        let p = new HttpParams({ fromObject: req });
        if (patientId) p = p.set('patientId', patientId);
        if (doctorId) p = p.set('doctorId', doctorId);
        return this.http.get<any>(`${this.API}/encounters`, { params: p });
    }
    getEncounter(id: number): Observable<any> { return this.http.get<any>(`${this.API}/encounters/${id}`); }
    createEncounter(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/encounters`, dto); }
    updateEncounter(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/encounters/${id}`, dto); }
    deleteEncounter(id: number): Observable<any> { return this.http.delete(`${this.API}/encounters/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class PharmacyService {
    private readonly API = `${environment.apiUrl}/pharmacy`;
    constructor(private http: HttpClient) { }
    getPrescriptions(req: any, status?: string, patientId?: number, admissionId?: number): Observable<any> {
        let p = new HttpParams({ fromObject: req });
        if (status) p = p.set('status', status);
        if (patientId) p = p.set('patientId', patientId);
        if (admissionId) p = p.set('admissionId', admissionId);
        return this.http.get<any>(`${this.API}/prescriptions`, { params: p });
    }
    getPrescription(id: number): Observable<any> { return this.http.get<any>(`${this.API}/prescriptions/${id}`); }
    createPrescription(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/prescriptions`, dto); }
    cancelPrescription(id: number): Observable<any> { return this.http.post<any>(`${this.API}/prescriptions/${id}/cancel`, {}); }

    // MAR
    getMAR(admissionId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.API}/mar/${admissionId}`);
    }
    createMAR(dto: any): Observable<any> {
        return this.http.post<any>(`${this.API}/mar`, dto);
    }
    getPendingDispensing(patientId?: number): Observable<any> {
        let p = new HttpParams();
        if (patientId) p = p.set('patientId', patientId);
        return this.http.get<any>(`${this.API}/pending-dispensing`, { params: p });
    }
    getAvailableBatches(itemId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.API}/items/${itemId}/available-batches`);
    }
    dispenseItem(id: number, dto: any): Observable<any> { return this.http.post<any>(`${this.API}/items/${id}/dispense`, dto); }

    getDashboard(): Observable<any> { return this.http.get<any>(`${this.API}/dashboard`); }
    runExpiryCheck(): Observable<any> { return this.http.post<any>(`${this.API}/check-expiry`, {}); }

    checkInteractions(patientId: number, itemIds: number[]): Observable<any[]> {
        return this.http.post<any[]>(`${this.API}/check-interactions`, { patientId, itemIds });
    }
    processReturn(dto: any): Observable<any> {
        return this.http.post<any>(`${this.API}/returns`, dto);
    }
    getReturns(req: PagedRequest = {}): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (req.page) params = params.set('page', req.page);
        if (req.pageSize) params = params.set('pageSize', req.pageSize);
        return this.http.get<PagedResult<any>>(`${this.API}/returns`, { params });
    }
    getNarcoticsReport(start: string, end: string): Observable<any[]> {
        let p = new HttpParams().set('start', start).set('end', end);
        return this.http.get<any[]>(`${this.API}/narcotics-report`, { params: p });
    }
    getInteractions(itemId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.API}/interactions/${itemId}`);
    }
    addInteraction(dto: any): Observable<any> {
        return this.http.post<any>(`${this.API}/interactions`, dto);
    }
}

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly API = `${environment.apiUrl}/users`;
    constructor(private http: HttpClient) { }

    getUsers(req: any): Observable<any> {
        return this.http.get<any>(this.API, { params: new HttpParams({ fromObject: req }) });
    }
    getUser(id: number): Observable<any> { return this.http.get<any>(`${this.API}/${id}`); }
    createUser(dto: any): Observable<any> { return this.http.post<any>(this.API, dto); }
    updateUser(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/${id}`, dto); }
    toggleStatus(id: number): Observable<any> { return this.http.patch<any>(`${this.API}/${id}/toggle-status`, {}); }
    getRoles(): Observable<any> { return this.http.get<any>(`${this.API}/roles`); }
}

@Injectable({ providedIn: 'root' })
export class BedManagementService {
    private readonly API = `${environment.apiUrl}/bedmanagement`;
    constructor(private http: HttpClient) { }

    getWards(request: PagedRequest = {}): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (request.search) params = params.set('search', request.search);
        return this.http.get<PagedResult<any>>(`${this.API}/wards`, { params });
    }
    createWard(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/wards`, dto); }
    updateWard(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/wards/${id}`, dto); }
    deleteWard(id: number): Observable<any> { return this.http.delete<any>(`${this.API}/wards/${id}`); }

    getRooms(wardId: number, request: PagedRequest = {}): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (request.search) params = params.set('search', request.search);
        return this.http.get<PagedResult<any>>(`${this.API}/wards/${wardId}/rooms`, { params });
    }
    createRoom(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/rooms`, dto); }
    updateRoom(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/rooms/${id}`, dto); }
    deleteRoom(id: number): Observable<any> { return this.http.delete<any>(`${this.API}/rooms/${id}`); }

    getBeds(query: any): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (query.wardId) params = params.set('wardId', query.wardId);
        if (query.roomId) params = params.set('roomId', query.roomId);
        if (query.status) params = params.set('status', query.status);
        if (query.page) params = params.set('page', query.page);
        if (query.pageSize) params = params.set('pageSize', query.pageSize);
        if (query.search) params = params.set('search', query.search);
        return this.http.get<PagedResult<any>>(`${this.API}/beds`, { params });
    }
    createBed(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/beds`, dto); }
    updateBed(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/beds/${id}`, dto); }
    deleteBed(id: number): Observable<any> { return this.http.delete<any>(`${this.API}/beds/${id}`); }

    getAdmissions(query: any): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (query.patientId) params = params.set('patientId', query.patientId);
        if (query.status) params = params.set('status', query.status);
        if (query.page) params = params.set('page', query.page);
        if (query.pageSize) params = params.set('pageSize', query.pageSize);
        return this.http.get<PagedResult<any>>(`${this.API}/admissions`, { params });
    }
    admitPatient(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/admissions`, dto); }
    dischargePatient(id: number, dto: any): Observable<any> { return this.http.post<any>(`${this.API}/admissions/${id}/discharge`, dto); }
    transferPatient(id: number, newBedId: number): Observable<any> { return this.http.post<any>(`${this.API}/admissions/${id}/transfer`, newBedId); }
}

@Injectable({ providedIn: 'root' })
export class MessagingService {
    private readonly API = `${environment.apiUrl}/messaging`;
    constructor(private http: HttpClient) { }

    getInbox(request: PagedRequest = {}): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        return this.http.get<PagedResult<any>>(`${this.API}/inbox`, { params });
    }

    getSent(request: PagedRequest = {}): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        return this.http.get<PagedResult<any>>(`${this.API}/sent`, { params });
    }

    sendMessage(dto: any): Observable<any> { return this.http.post<any>(this.API, dto); }
    markAsRead(id: number): Observable<any> { return this.http.post<any>(`${this.API}/${id}/read`, {}); }
    getUnreadCount(): Observable<number> { return this.http.get<number>(`${this.API}/unread-count`); }
}

@Injectable({ providedIn: 'root' })
export class AuditLogService {
    private readonly API = `${environment.apiUrl}/erp/audit-logs`; // Assuming it's in ERPControllers for now, or check MessagingController
    constructor(private http: HttpClient) { }

    getLogs(request: PagedRequest = {}): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (request.search) params = params.set('search', request.search);
        return this.http.get<PagedResult<any>>(this.API, { params });
    }
}

@Injectable({ providedIn: 'root' })
export class InpatientBillingService {
    private readonly API = `${environment.apiUrl}/inpatientbilling`;
    constructor(private http: HttpClient) { }

    processDaily(): Observable<any> { return this.http.post<any>(`${this.API}/process-daily`, {}); }
    getPatientBills(patientId: number): Observable<any[]> { return this.http.get<any[]>(`${this.API}/patient/${patientId}`); }
    finalizeBill(admissionId: number): Observable<any> { return this.http.post<any>(`${this.API}/admissions/${admissionId}/finalize`, {}); }
}

@Injectable({ providedIn: 'root' })
export class OTService {
    private readonly API = `${environment.apiUrl}/ot`;
    constructor(private http: HttpClient) { }

    getOperatingTheaters(): Observable<any[]> {
        return this.http.get<any[]>(`${this.API}/operating-theaters`);
    }
    createOperatingTheater(dto: any): Observable<any> {
        return this.http.post<any>(`${this.API}/operating-theaters`, dto);
    }
    updateOTStatus(id: number, status: string): Observable<void> {
        return this.http.patch<void>(`${this.API}/operating-theaters/${id}/status?status=${status}`, {});
    }

    getScheduledSurgeries(req: any, status?: string, otId?: number): Observable<any> {
        let p = new HttpParams({ fromObject: req });
        if (status) p = p.set('status', status);
        if (otId) p = p.set('otId', otId);
        return this.http.get<any>(`${this.API}/surgeries`, { params: p });
    }
    getSurgery(id: number): Observable<any> {
        return this.http.get<any>(`${this.API}/surgeries/${id}`);
    }
    scheduleSurgery(dto: any): Observable<any> {
        return this.http.post<any>(`${this.API}/surgeries`, dto);
    }
    updateSurgeryStatus(id: number, status: string, postOpDiagnosis?: string, notes?: string): Observable<void> {
        let p = new HttpParams().set('status', status);
        if (postOpDiagnosis) p = p.set('postOpDiagnosis', postOpDiagnosis);
        if (notes) p = p.set('notes', notes);
        return this.http.patch<void>(`${this.API}/surgeries/${id}/status`, {}, { params: p });
    }
    cancelSurgery(id: number, reason: string): Observable<void> {
        return this.http.post<void>(`${this.API}/surgeries/${id}/cancel?reason=${reason}`, {});
    }

    getResources(surgeryId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.API}/surgeries/${surgeryId}/resources`);
    }
    addResource(surgeryId: number, dto: any): Observable<void> {
        return this.http.post<void>(`${this.API}/surgeries/${surgeryId}/resources`, dto);
    }
    removeResource(resourceId: number): Observable<void> {
        return this.http.delete<void>(`${this.API}/resources/${resourceId}`);
    }
    finalizeBill(surgeryId: number): Observable<{ invoiceId: number }> {
        return this.http.post<{ invoiceId: number }>(`${this.API}/surgeries/${surgeryId}/finalize-bill`, {});
    }

    getChecklist(surgeryId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.API}/surgeries/${surgeryId}/checklist`);
    }

    saveChecklist(surgeryId: number, dto: any): Observable<void> {
        return this.http.post<void>(`${this.API}/surgeries/${surgeryId}/checklist`, dto);
    }
}

@Injectable({ providedIn: 'root' })
export class SystemService {
    private readonly API = `${environment.apiUrl}/system`;
    constructor(private http: HttpClient) { }

    getAuditLogs(page = 1, pageSize = 50, search?: string, entityName?: string, entityId?: number): Observable<PagedResult<any>> {
        let params = new HttpParams().set('page', page).set('pageSize', pageSize);
        if (search) params = params.set('search', search);
        if (entityName) params = params.set('entityName', entityName);
        if (entityId) params = params.set('entityId', entityId);
        return this.http.get<PagedResult<any>>(`${this.API}/audit-logs`, { params });
    }
}

@Injectable({ providedIn: 'root' })
export class InsuranceService {
    private readonly API = `${environment.apiUrl}/insurance`;
    constructor(private http: HttpClient) { }

    getProviders(): Observable<any[]> { return this.http.get<any[]>(`${this.API}/providers`); }
    getProvider(id: number): Observable<any> { return this.http.get<any>(`${this.API}/providers/${id}`); }
    createProvider(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/providers`, dto); }
    updateProvider(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/providers/${id}`, dto); }

    getPlans(providerId?: number): Observable<any[]> {
        let params = new HttpParams();
        if (providerId) params = params.set('providerId', providerId);
        return this.http.get<any[]>(`${this.API}/plans`, { params });
    }
    createPlan(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/plans`, dto); }
    updatePlan(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/plans/${id}`, dto); }

    getClaims(request: PagedRequest = {}, status?: string): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (request.search) params = params.set('search', request.search);
        if (status) params = params.set('status', status);
        return this.http.get<PagedResult<any>>(`${this.API}/claims`, { params });
    }
    createClaim(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/claims`, dto); }
    updateClaimStatus(id: number, dto: any): Observable<any> { return this.http.patch<any>(`${this.API}/claims/${id}/status`, dto); }
}

@Injectable({ providedIn: 'root' })
export class AssetService {
    private readonly API = `${environment.apiUrl}/asset`;
    constructor(private http: HttpClient) { }

    getAssets(request: PagedRequest = {}, category?: string, status?: string): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (request.search) params = params.set('search', request.search);
        if (category) params = params.set('category', category);
        if (status) params = params.set('status', status);
        return this.http.get<PagedResult<any>>(this.API, { params });
    }

    getAsset(id: number): Observable<any> { return this.http.get<any>(`${this.API}/${id}`); }
    createAsset(dto: any): Observable<any> { return this.http.post<any>(this.API, dto); }
    updateAsset(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/${id}`, dto); }
    deleteAsset(id: number): Observable<void> { return this.http.delete<void>(`${this.API}/${id}`); }

    getTickets(request: PagedRequest = {}, assetId?: number, status?: string, type?: string): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (request.search) params = params.set('search', request.search);
        if (assetId) params = params.set('assetId', assetId);
        if (status) params = params.set('status', status);
        if (type) params = params.set('type', type);
        return this.http.get<PagedResult<any>>(`${this.API}/tickets`, { params });
    }

    createTicket(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/tickets`, dto); }
    updateTicketStatus(id: number, dto: any): Observable<any> { return this.http.patch<any>(`${this.API}/tickets/${id}/status`, dto); }
}

@Injectable({ providedIn: 'root' })
export class EmergencyService {
    private readonly API = `${environment.apiUrl}/emergency`;
    constructor(private http: HttpClient) { }

    getActiveAdmissions(request: any = {}): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (request.search) params = params.set('search', request.search);
        if (request.doctorId) params = params.set('doctorId', request.doctorId);
        return this.http.get<PagedResult<any>>(`${this.API}/active`, { params });
    }

    getAdmission(id: number): Observable<any> { return this.http.get<any>(`${this.API}/${id}`); }
    register(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/register`, dto); }
    updateTriage(id: number, dto: any): Observable<any> { return this.http.patch<any>(`${this.API}/${id}/triage`, dto); }
    assignDoctor(id: number, doctorId: number): Observable<any> { return this.http.patch<any>(`${this.API}/${id}/assign-doctor`, doctorId); }
    updateStatus(id: number, status: string, disposition?: string, notes?: string): Observable<any> {
        let params = new HttpParams().set('status', status);
        if (disposition) params = params.set('disposition', disposition);
        return this.http.patch<any>(`${this.API}/${id}/status`, notes, { params });
    }
    getVitals(id: number): Observable<any[]> { return this.http.get<any[]>(`${this.API}/${id}/vitals`); }
    getOccupancy(): Observable<any> { return this.http.get<any>(`${this.API}/occupancy`); }
    getTreatmentSummary(id: number): Observable<any> { return this.http.get<any>(`${this.API}/${id}/treatment`); }
    transferToInpatient(id: number, data: any): Observable<any> { return this.http.post<any>(`${this.API}/${id}/transfer-inpatient`, data); }
}

@Injectable({ providedIn: 'root' })
export class BloodBankService {
    private readonly API = `${environment.apiUrl}/bloodbank`;
    constructor(private http: HttpClient) { }

    // Donors
    getDonors(request: PagedRequest = {}, bloodGroup?: string): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (request.search) params = params.set('search', request.search);
        if (bloodGroup) params = params.set('bloodGroup', bloodGroup);
        return this.http.get<PagedResult<any>>(`${this.API}/donors`, { params });
    }
    getDonorById(id: number): Observable<any> { return this.http.get<any>(`${this.API}/donors/${id}`); }
    createDonor(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/donors`, dto); }
    updateDonor(id: number, dto: any): Observable<any> { return this.http.put<any>(`${this.API}/donors/${id}`, dto); }

    // Donations
    getDonations(request: PagedRequest = {}, donorId?: number): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (donorId) params = params.set('donorId', donorId);
        return this.http.get<PagedResult<any>>(`${this.API}/donations`, { params });
    }
    recordDonation(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/donations`, dto); }

    // Stock
    getStock(request: PagedRequest = {}, filters: any = {}): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (filters.bloodGroup) params = params.set('bloodGroup', filters.bloodGroup);
        if (filters.component) params = params.set('component', filters.component);
        if (filters.status) params = params.set('status', filters.status);
        return this.http.get<PagedResult<any>>(`${this.API}/stock`, { params });
    }
    updateStockStatus(id: number, payload: any): Observable<any> { return this.http.patch<any>(`${this.API}/stock/${id}/status`, payload); }

    // Requests
    getRequests(request: PagedRequest = {}, status?: string): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (status) params = params.set('status', status);
        return this.http.get<PagedResult<any>>(`${this.API}/requests`, { params });
    }
    createRequest(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/requests`, dto); }
    updateRequestStatus(id: number, status: string): Observable<any> { return this.http.patch<any>(`${this.API}/requests/${id}/status`, `"${status}"`, { headers: { 'Content-Type': 'application/json' } }); }
}

@Injectable({ providedIn: 'root' })
export class MaternityService {
    private readonly API = `${environment.apiUrl}/maternity`;
    constructor(private http: HttpClient) { }

    // Pregnancy
    getPregnancies(request: PagedRequest = {}, status?: string): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (status) params = params.set('status', status);
        return this.http.get<PagedResult<any>>(`${this.API}/pregnancies`, { params });
    }
    createPregnancy(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/pregnancies`, dto); }

    // Delivery
    recordDelivery(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/deliveries`, dto); }
    getDeliveries(pregnancyId: number): Observable<any[]> { return this.http.get<any[]>(`${this.API}/pregnancies/${pregnancyId}/deliveries`); }

    // Neonatal
    recordBirth(dto: any): Observable<any> { return this.http.post<any>(`${this.API}/births`, dto); }
    getNeonatalRecords(request: PagedRequest = {}, gender?: string): Observable<PagedResult<any>> {
        let params = new HttpParams();
        if (request.page) params = params.set('page', request.page);
        if (request.pageSize) params = params.set('pageSize', request.pageSize);
        if (gender) params = params.set('gender', gender);
        return this.http.get<PagedResult<any>>(`${this.API}/neonatal`, { params });
    }
}

