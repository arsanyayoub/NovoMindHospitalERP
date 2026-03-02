import {
  HttpClient,
  HttpParams,
  environment,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-QQTHLIA4.js";

// src/app/core/services/api.services.ts
var PatientService = class _PatientService {
  constructor(http) {
    this.http = http;
    this.API = `${environment.apiUrl}/patients`;
  }
  getAll(request = {}) {
    let params = new HttpParams();
    if (request.page)
      params = params.set("page", request.page);
    if (request.pageSize)
      params = params.set("pageSize", request.pageSize);
    if (request.search)
      params = params.set("search", request.search);
    return this.http.get(this.API, { params });
  }
  getById(id) {
    return this.http.get(`${this.API}/${id}`);
  }
  create(dto) {
    return this.http.post(this.API, dto);
  }
  update(id, dto) {
    return this.http.put(`${this.API}/${id}`, dto);
  }
  delete(id) {
    return this.http.delete(`${this.API}/${id}`);
  }
  getAppointments(id) {
    return this.http.get(`${this.API}/${id}/appointments`);
  }
  getInvoices(id) {
    return this.http.get(`${this.API}/${id}/invoices`);
  }
  static {
    this.\u0275fac = function PatientService_Factory(t) {
      return new (t || _PatientService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PatientService, factory: _PatientService.\u0275fac, providedIn: "root" });
  }
};
var DoctorService = class _DoctorService {
  constructor(http) {
    this.http = http;
    this.API = `${environment.apiUrl}/doctors`;
  }
  getAll(request = {}) {
    let params = new HttpParams();
    if (request.page)
      params = params.set("page", request.page);
    if (request.pageSize)
      params = params.set("pageSize", request.pageSize);
    if (request.search)
      params = params.set("search", request.search);
    return this.http.get(this.API, { params });
  }
  getById(id) {
    return this.http.get(`${this.API}/${id}`);
  }
  create(dto) {
    return this.http.post(this.API, dto);
  }
  update(id, dto) {
    return this.http.put(`${this.API}/${id}`, dto);
  }
  delete(id) {
    return this.http.delete(`${this.API}/${id}`);
  }
  getAppointments(id, date) {
    let params = new HttpParams();
    if (date)
      params = params.set("date", date);
    return this.http.get(`${this.API}/${id}/appointments`, { params });
  }
  static {
    this.\u0275fac = function DoctorService_Factory(t) {
      return new (t || _DoctorService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DoctorService, factory: _DoctorService.\u0275fac, providedIn: "root" });
  }
};
var AppointmentService = class _AppointmentService {
  constructor(http) {
    this.http = http;
    this.API = `${environment.apiUrl}/appointments`;
  }
  getAll(request = {}, filters = {}) {
    let params = new HttpParams();
    if (request.page)
      params = params.set("page", request.page);
    if (request.pageSize)
      params = params.set("pageSize", request.pageSize);
    if (request.search)
      params = params.set("search", request.search);
    if (filters.date)
      params = params.set("date", filters.date);
    if (filters.doctorId)
      params = params.set("doctorId", filters.doctorId);
    if (filters.patientId)
      params = params.set("patientId", filters.patientId);
    if (filters.status)
      params = params.set("status", filters.status);
    return this.http.get(this.API, { params });
  }
  getById(id) {
    return this.http.get(`${this.API}/${id}`);
  }
  getToday() {
    return this.http.get(`${this.API}/today`);
  }
  create(dto) {
    return this.http.post(this.API, dto);
  }
  update(id, dto) {
    return this.http.put(`${this.API}/${id}`, dto);
  }
  delete(id) {
    return this.http.delete(`${this.API}/${id}`);
  }
  static {
    this.\u0275fac = function AppointmentService_Factory(t) {
      return new (t || _AppointmentService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AppointmentService, factory: _AppointmentService.\u0275fac, providedIn: "root" });
  }
};
var InvoiceService = class _InvoiceService {
  constructor(http) {
    this.http = http;
    this.API = `${environment.apiUrl}/invoices`;
  }
  getAll(request = {}, status, type) {
    let params = new HttpParams();
    if (request.page)
      params = params.set("page", request.page);
    if (request.pageSize)
      params = params.set("pageSize", request.pageSize);
    if (request.search)
      params = params.set("search", request.search);
    if (status)
      params = params.set("status", status);
    if (type)
      params = params.set("type", type);
    return this.http.get(this.API, { params });
  }
  getById(id) {
    return this.http.get(`${this.API}/${id}`);
  }
  create(dto) {
    return this.http.post(this.API, dto);
  }
  delete(id) {
    return this.http.delete(`${this.API}/${id}`);
  }
  recordPayment(dto) {
    return this.http.post(`${this.API}/payment`, dto);
  }
  getPayments(id) {
    return this.http.get(`${this.API}/${id}/payments`);
  }
  static {
    this.\u0275fac = function InvoiceService_Factory(t) {
      return new (t || _InvoiceService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _InvoiceService, factory: _InvoiceService.\u0275fac, providedIn: "root" });
  }
};
var AccountingService = class _AccountingService {
  constructor(http) {
    this.http = http;
    this.API = `${environment.apiUrl}/accounting`;
  }
  getChartOfAccounts() {
    return this.http.get(`${this.API}/accounts`);
  }
  createAccount(dto) {
    return this.http.post(`${this.API}/accounts`, dto);
  }
  updateAccount(id, dto) {
    return this.http.put(`${this.API}/accounts/${id}`, dto);
  }
  getJournalEntries(request = {}, from, to) {
    let params = new HttpParams();
    if (request.page)
      params = params.set("page", request.page);
    if (request.pageSize)
      params = params.set("pageSize", request.pageSize);
    if (from)
      params = params.set("from", from);
    if (to)
      params = params.set("to", to);
    return this.http.get(`${this.API}/journal-entries`, { params });
  }
  createJournalEntry(dto) {
    return this.http.post(`${this.API}/journal-entries`, dto);
  }
  postJournalEntry(id) {
    return this.http.post(`${this.API}/journal-entries/${id}/post`, {});
  }
  getFinancialReport(from, to) {
    return this.http.get(`${this.API}/reports/financial`, { params: new HttpParams().set("from", from).set("to", to) });
  }
  getTrialBalance(asOf) {
    return this.http.get(`${this.API}/reports/trial-balance`, { params: new HttpParams().set("asOf", asOf) });
  }
  static {
    this.\u0275fac = function AccountingService_Factory(t) {
      return new (t || _AccountingService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AccountingService, factory: _AccountingService.\u0275fac, providedIn: "root" });
  }
};
var InventoryService = class _InventoryService {
  constructor(http) {
    this.http = http;
    this.API = `${environment.apiUrl}/inventory`;
  }
  getItems(request = {}) {
    let params = new HttpParams();
    if (request.page)
      params = params.set("page", request.page);
    if (request.pageSize)
      params = params.set("pageSize", request.pageSize);
    if (request.search)
      params = params.set("search", request.search);
    return this.http.get(`${this.API}/items`, { params });
  }
  createItem(dto) {
    return this.http.post(`${this.API}/items`, dto);
  }
  updateItem(id, dto) {
    return this.http.put(`${this.API}/items/${id}`, dto);
  }
  deleteItem(id) {
    return this.http.delete(`${this.API}/items/${id}`);
  }
  getWarehouses() {
    return this.http.get(`${this.API}/warehouses`);
  }
  createWarehouse(dto) {
    return this.http.post(`${this.API}/warehouses`, dto);
  }
  getStock(warehouseId, itemId) {
    let params = new HttpParams();
    if (warehouseId)
      params = params.set("warehouseId", warehouseId);
    if (itemId)
      params = params.set("itemId", itemId);
    return this.http.get(`${this.API}/stock`, { params });
  }
  getLowStock() {
    return this.http.get(`${this.API}/stock/low`);
  }
  transferStock(dto) {
    return this.http.post(`${this.API}/stock/transfer`, dto);
  }
  static {
    this.\u0275fac = function InventoryService_Factory(t) {
      return new (t || _InventoryService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _InventoryService, factory: _InventoryService.\u0275fac, providedIn: "root" });
  }
};
var PurchaseService = class _PurchaseService {
  constructor(http) {
    this.http = http;
    this.API = `${environment.apiUrl}/purchase`;
  }
  getSuppliers(request = {}) {
    let params = new HttpParams();
    if (request.page)
      params = params.set("page", request.page);
    if (request.pageSize)
      params = params.set("pageSize", request.pageSize);
    if (request.search)
      params = params.set("search", request.search);
    return this.http.get(`${this.API}/suppliers`, { params });
  }
  createSupplier(dto) {
    return this.http.post(`${this.API}/suppliers`, dto);
  }
  updateSupplier(id, dto) {
    return this.http.put(`${this.API}/suppliers/${id}`, dto);
  }
  getPurchaseInvoices(request = {}, status) {
    let params = new HttpParams();
    if (request.page)
      params = params.set("page", request.page);
    if (request.pageSize)
      params = params.set("pageSize", request.pageSize);
    if (status)
      params = params.set("status", status);
    return this.http.get(`${this.API}/invoices`, { params });
  }
  createPurchaseInvoice(dto) {
    return this.http.post(`${this.API}/invoices`, dto);
  }
  payPurchaseInvoice(id, amount) {
    return this.http.post(`${this.API}/invoices/${id}/pay`, amount);
  }
  static {
    this.\u0275fac = function PurchaseService_Factory(t) {
      return new (t || _PurchaseService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PurchaseService, factory: _PurchaseService.\u0275fac, providedIn: "root" });
  }
};
var SalesService = class _SalesService {
  constructor(http) {
    this.http = http;
    this.API = `${environment.apiUrl}/sales`;
  }
  getCustomers(request = {}) {
    let params = new HttpParams();
    if (request.page)
      params = params.set("page", request.page);
    if (request.pageSize)
      params = params.set("pageSize", request.pageSize);
    if (request.search)
      params = params.set("search", request.search);
    return this.http.get(`${this.API}/customers`, { params });
  }
  createCustomer(dto) {
    return this.http.post(`${this.API}/customers`, dto);
  }
  updateCustomer(id, dto) {
    return this.http.put(`${this.API}/customers/${id}`, dto);
  }
  getSalesInvoices(request = {}, status) {
    let params = new HttpParams();
    if (request.page)
      params = params.set("page", request.page);
    if (request.pageSize)
      params = params.set("pageSize", request.pageSize);
    if (status)
      params = params.set("status", status);
    return this.http.get(`${this.API}/invoices`, { params });
  }
  createSalesInvoice(dto) {
    return this.http.post(`${this.API}/invoices`, dto);
  }
  paySalesInvoice(id, amount) {
    return this.http.post(`${this.API}/invoices/${id}/pay`, amount);
  }
  static {
    this.\u0275fac = function SalesService_Factory(t) {
      return new (t || _SalesService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SalesService, factory: _SalesService.\u0275fac, providedIn: "root" });
  }
};
var HRService = class _HRService {
  constructor(http) {
    this.http = http;
    this.API = `${environment.apiUrl}/hr`;
  }
  getEmployees(request = {}) {
    let params = new HttpParams();
    if (request.page)
      params = params.set("page", request.page);
    if (request.pageSize)
      params = params.set("pageSize", request.pageSize);
    if (request.search)
      params = params.set("search", request.search);
    return this.http.get(`${this.API}/employees`, { params });
  }
  createEmployee(dto) {
    return this.http.post(`${this.API}/employees`, dto);
  }
  updateEmployee(id, dto) {
    return this.http.put(`${this.API}/employees/${id}`, dto);
  }
  deleteEmployee(id) {
    return this.http.delete(`${this.API}/employees/${id}`);
  }
  getPayrolls(request = {}, year, month) {
    let params = new HttpParams();
    if (request.page)
      params = params.set("page", request.page);
    if (year)
      params = params.set("year", year);
    if (month)
      params = params.set("month", month);
    return this.http.get(`${this.API}/payrolls`, { params });
  }
  generatePayroll(dto) {
    return this.http.post(`${this.API}/payrolls`, dto);
  }
  processPayroll(id) {
    return this.http.post(`${this.API}/payrolls/${id}/pay`, {});
  }
  static {
    this.\u0275fac = function HRService_Factory(t) {
      return new (t || _HRService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _HRService, factory: _HRService.\u0275fac, providedIn: "root" });
  }
};
var DashboardService = class _DashboardService {
  constructor(http) {
    this.http = http;
    this.API = `${environment.apiUrl}/dashboard`;
  }
  get() {
    return this.http.get(this.API);
  }
  static {
    this.\u0275fac = function DashboardService_Factory(t) {
      return new (t || _DashboardService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DashboardService, factory: _DashboardService.\u0275fac, providedIn: "root" });
  }
};

export {
  PatientService,
  DoctorService,
  AppointmentService,
  InvoiceService,
  AccountingService,
  InventoryService,
  PurchaseService,
  SalesService,
  HRService,
  DashboardService
};
//# sourceMappingURL=chunk-56O4OOG6.js.map
