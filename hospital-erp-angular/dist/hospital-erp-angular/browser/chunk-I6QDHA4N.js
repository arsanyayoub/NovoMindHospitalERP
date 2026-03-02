import {
  DefaultValueAccessor,
  FormsModule,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  RequiredValidator,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-GVBL3DCA.js";
import {
  ToastService
} from "./chunk-DM7YHZMX.js";
import {
  InvoiceService,
  PatientService
} from "./chunk-56O4OOG6.js";
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  NgClass,
  NgForOf,
  NgIf,
  TranslateModule,
  TranslatePipe,
  __spreadProps,
  __spreadValues,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-QQTHLIA4.js";

// src/app/features/patients/patients.component.ts
function PatientsComponent_div_11_div_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16);
    \u0275\u0275element(1, "div", 17);
    \u0275\u0275elementEnd();
  }
}
function PatientsComponent_div_11_div_14_tr_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 21);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 22);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td");
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td")(14, "span", 23);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "translate");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "td")(18, "div", 24)(19, "button", 25);
    \u0275\u0275listener("click", function PatientsComponent_div_11_div_14_tr_26_Template_button_click_19_listener() {
      const p_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openForm(p_r4));
    });
    \u0275\u0275elementStart(20, "span", 26);
    \u0275\u0275text(21, "edit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "button", 27);
    \u0275\u0275listener("click", function PatientsComponent_div_11_div_14_tr_26_Template_button_click_22_listener() {
      const p_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.deletePatient(p_r4));
    });
    \u0275\u0275elementStart(23, "span", 26);
    \u0275\u0275text(24, "delete");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const p_r4 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r4.patientCode);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r4.fullName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r4.phoneNumber || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r4.gender);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(12, 7, p_r4.dateOfBirth, "mediumDate"));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", p_r4.isActive ? "badge-success" : "badge-secondary");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(16, 10, p_r4.isActive ? "ACTIVE" : "INACTIVE"));
  }
}
function PatientsComponent_div_11_div_14_tr_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 28)(2, "div", 29)(3, "span", 30);
    \u0275\u0275text(4, "personal_injury");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 31);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "translate");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(7, 1, "NO_DATA"));
  }
}
function PatientsComponent_div_11_div_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "table", 19)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th");
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th");
    \u0275\u0275text(20);
    \u0275\u0275pipe(21, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "th");
    \u0275\u0275text(23);
    \u0275\u0275pipe(24, "translate");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(25, "tbody");
    \u0275\u0275template(26, PatientsComponent_div_11_div_14_tr_26_Template, 25, 12, "tr", 20)(27, PatientsComponent_div_11_div_14_tr_27_Template, 8, 3, "tr", 4);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 9, "PATIENT_CODE"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(9, 11, "PATIENT_NAME"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(12, 13, "PHONE"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(15, 15, "GENDER"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(18, 17, "DATE_OF_BIRTH"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(21, 19, "STATUS"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(24, 21, "ACTIONS"));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r1.patients);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.patients.length === 0);
  }
}
function PatientsComponent_div_11_div_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 32)(1, "span", 33);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 34)(4, "button", 35);
    \u0275\u0275listener("click", function PatientsComponent_div_11_div_15_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      ctx_r1.page = ctx_r1.page - 1;
      return \u0275\u0275resetView(ctx_r1.loadData());
    });
    \u0275\u0275elementStart(5, "span", 11);
    \u0275\u0275text(6, "chevron_left");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 35);
    \u0275\u0275listener("click", function PatientsComponent_div_11_div_15_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      ctx_r1.page = ctx_r1.page + 1;
      return \u0275\u0275resetView(ctx_r1.loadData());
    });
    \u0275\u0275elementStart(8, "span", 11);
    \u0275\u0275text(9, "chevron_right");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("Page ", ctx_r1.page, " of ", ctx_r1.totalPages, "");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.page <= 1);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r1.page >= ctx_r1.totalPages);
  }
}
function PatientsComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 6)(2, "div", 7)(3, "span", 8);
    \u0275\u0275text(4, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "input", 9);
    \u0275\u0275pipe(6, "translate");
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_11_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.search, $event) || (ctx_r1.search = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function PatientsComponent_div_11_Template_input_input_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.loadData());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 10);
    \u0275\u0275listener("click", function PatientsComponent_div_11_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openForm());
    });
    \u0275\u0275elementStart(8, "span", 11);
    \u0275\u0275text(9, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "translate");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 12);
    \u0275\u0275template(13, PatientsComponent_div_11_div_13_Template, 2, 0, "div", 13)(14, PatientsComponent_div_11_div_14_Template, 28, 23, "div", 14)(15, PatientsComponent_div_11_div_15_Template, 10, 4, "div", 15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("placeholder", \u0275\u0275pipeBind1(6, 6, "SEARCH"));
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.search);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(11, 8, "ADD_NEW"), " ");
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r1.loading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.loading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.totalPages > 1);
  }
}
function PatientsComponent_div_12_tr_40_button_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 47);
    \u0275\u0275listener("click", function PatientsComponent_div_12_tr_40_button_25_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const i_r8 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openPayModal(i_r8));
    });
    \u0275\u0275elementStart(1, "span", 26);
    \u0275\u0275text(2, "payments");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Pay");
    \u0275\u0275elementEnd();
  }
}
function PatientsComponent_div_12_tr_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 44);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 22);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td");
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td", 45);
    \u0275\u0275text(16);
    \u0275\u0275pipe(17, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "td");
    \u0275\u0275text(19);
    \u0275\u0275pipe(20, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "td")(22, "span", 23);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "td");
    \u0275\u0275template(25, PatientsComponent_div_12_tr_40_button_25_Template, 4, 0, "button", 46);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const i_r8 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(i_r8.invoiceNumber);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(i_r8.patientName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(8, 12, i_r8.invoiceDate, "mediumDate"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(11, 15, i_r8.dueDate, "mediumDate"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(14, 18, i_r8.totalAmount));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(17, 20, i_r8.paidAmount));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("text-danger", i_r8.totalAmount - i_r8.paidAmount > 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(20, 22, i_r8.totalAmount - i_r8.paidAmount));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", i_r8.status === "Paid" ? "badge-success" : i_r8.status === "PartiallyPaid" ? "badge-warning" : "badge-danger");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(i_r8.status);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", i_r8.status !== "Paid");
  }
}
function PatientsComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 36)(2, "div", 37)(3, "select", 38);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_12_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.invoiceFilter, $event) || (ctx_r1.invoiceFilter = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function PatientsComponent_div_12_Template_select_change_3_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.loadInvoices());
    });
    \u0275\u0275elementStart(4, "option", 39);
    \u0275\u0275text(5, "All Statuses");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "option", 40);
    \u0275\u0275text(7, "Pending");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "option", 41);
    \u0275\u0275text(9, "Partially Paid");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "option", 42);
    \u0275\u0275text(11, "Paid");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "button", 43);
    \u0275\u0275listener("click", function PatientsComponent_div_12_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openInvoiceForm());
    });
    \u0275\u0275elementStart(13, "span", 11);
    \u0275\u0275text(14, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(15, " New Bill");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 12)(17, "div", 18)(18, "table", 19)(19, "thead")(20, "tr")(21, "th");
    \u0275\u0275text(22, "Invoice #");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "th");
    \u0275\u0275text(24, "Patient");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "th");
    \u0275\u0275text(26, "Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "th");
    \u0275\u0275text(28, "Due Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "th");
    \u0275\u0275text(30, "Total");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "th");
    \u0275\u0275text(32, "Paid");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "th");
    \u0275\u0275text(34, "Remaining");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "th");
    \u0275\u0275text(36, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "th");
    \u0275\u0275text(38, "Actions");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(39, "tbody");
    \u0275\u0275template(40, PatientsComponent_div_12_tr_40_Template, 26, 24, "tr", 20);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.invoiceFilter);
    \u0275\u0275advance(37);
    \u0275\u0275property("ngForOf", ctx_r1.invoices);
  }
}
function PatientsComponent_div_13_option_58_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 70);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const bt_r10 = ctx.$implicit;
    \u0275\u0275property("value", bt_r10);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(bt_r10);
  }
}
function PatientsComponent_div_13_span_79_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 71);
  }
}
function PatientsComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 48);
    \u0275\u0275listener("click", function PatientsComponent_div_13_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showForm = false);
    });
    \u0275\u0275elementStart(1, "div", 49);
    \u0275\u0275listener("click", function PatientsComponent_div_13_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r9);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 50)(3, "h3", 51);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "translate");
    \u0275\u0275pipe(6, "translate");
    \u0275\u0275pipe(7, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "button", 25);
    \u0275\u0275listener("click", function PatientsComponent_div_13_Template_button_click_8_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showForm = false);
    });
    \u0275\u0275elementStart(9, "span", 11);
    \u0275\u0275text(10, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "div", 52)(12, "div", 53)(13, "div", 54)(14, "label", 55);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "input", 56);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_13_Template_input_ngModelChange_17_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form.fullName, $event) || (ctx_r1.form.fullName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 54)(19, "label", 55);
    \u0275\u0275text(20);
    \u0275\u0275pipe(21, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "input", 57);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_13_Template_input_ngModelChange_22_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form.phoneNumber, $event) || (ctx_r1.form.phoneNumber = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "div", 58)(24, "div", 54)(25, "label", 55);
    \u0275\u0275text(26);
    \u0275\u0275pipe(27, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "input", 59);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_13_Template_input_ngModelChange_28_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form.email, $event) || (ctx_r1.form.email = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "div", 54)(30, "label", 55);
    \u0275\u0275text(31, "National ID");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "input", 57);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_13_Template_input_ngModelChange_32_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form.nationalId, $event) || (ctx_r1.form.nationalId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(33, "div", 58)(34, "div", 54)(35, "label", 55);
    \u0275\u0275text(36);
    \u0275\u0275pipe(37, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "input", 60);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_13_Template_input_ngModelChange_38_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form.dateOfBirth, $event) || (ctx_r1.form.dateOfBirth = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(39, "div", 54)(40, "label", 55);
    \u0275\u0275text(41);
    \u0275\u0275pipe(42, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "select", 57);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_13_Template_select_ngModelChange_43_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form.gender, $event) || (ctx_r1.form.gender = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(44, "option", 61);
    \u0275\u0275text(45);
    \u0275\u0275pipe(46, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "option", 62);
    \u0275\u0275text(48);
    \u0275\u0275pipe(49, "translate");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(50, "div", 58)(51, "div", 54)(52, "label", 55);
    \u0275\u0275text(53);
    \u0275\u0275pipe(54, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "select", 57);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_13_Template_select_ngModelChange_55_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form.bloodType, $event) || (ctx_r1.form.bloodType = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(56, "option", 39);
    \u0275\u0275text(57, "\u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275template(58, PatientsComponent_div_13_option_58_Template, 2, 2, "option", 63);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(59, "div", 54)(60, "label", 55);
    \u0275\u0275text(61);
    \u0275\u0275pipe(62, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(63, "input", 57);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_13_Template_input_ngModelChange_63_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form.emergencyContact, $event) || (ctx_r1.form.emergencyContact = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(64, "div", 64)(65, "label", 55);
    \u0275\u0275text(66);
    \u0275\u0275pipe(67, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(68, "textarea", 65);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_13_Template_textarea_ngModelChange_68_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form.allergies, $event) || (ctx_r1.form.allergies = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(69, "div", 64)(70, "label", 55);
    \u0275\u0275text(71);
    \u0275\u0275pipe(72, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(73, "textarea", 65);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_13_Template_textarea_ngModelChange_73_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form.medicalHistory, $event) || (ctx_r1.form.medicalHistory = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(74, "div", 66)(75, "button", 67);
    \u0275\u0275listener("click", function PatientsComponent_div_13_Template_button_click_75_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showForm = false);
    });
    \u0275\u0275text(76);
    \u0275\u0275pipe(77, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(78, "button", 68);
    \u0275\u0275listener("click", function PatientsComponent_div_13_Template_button_click_78_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.save());
    });
    \u0275\u0275template(79, PatientsComponent_div_13_span_79_Template, 1, 0, "span", 69);
    \u0275\u0275text(80);
    \u0275\u0275pipe(81, "translate");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", ctx_r1.editing ? \u0275\u0275pipeBind1(5, 28, "EDIT") : \u0275\u0275pipeBind1(6, 30, "ADD_NEW"), " ", \u0275\u0275pipeBind1(7, 32, "PATIENTS"), "");
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind1(16, 34, "FULL_NAME"), " *");
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form.fullName);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(21, 36, "PHONE"));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form.phoneNumber);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(27, 38, "EMAIL"));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form.email);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form.nationalId);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(37, 40, "DATE_OF_BIRTH"));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form.dateOfBirth);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(42, 42, "GENDER"));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form.gender);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(46, 44, "MALE"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(49, 46, "FEMALE"));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(54, 48, "BLOOD_TYPE"));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form.bloodType);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r1.bloodTypes);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(62, 50, "EMERGENCY_CONTACT"));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form.emergencyContact);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(67, 52, "ALLERGIES"));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form.allergies);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(72, 54, "MEDICAL_HISTORY"));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form.medicalHistory);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(77, 56, "CANCEL"));
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.saving);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.saving);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(81, 58, "SAVE"), " ");
  }
}
function PatientsComponent_div_14_option_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 73);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r12 = ctx.$implicit;
    \u0275\u0275property("ngValue", p_r12.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", p_r12.fullName, " (", p_r12.patientCode, ")");
  }
}
function PatientsComponent_div_14_div_38_label_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 55);
    \u0275\u0275text(1, "Description");
    \u0275\u0275elementEnd();
  }
}
function PatientsComponent_div_14_div_38_label_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 55);
    \u0275\u0275text(1, "Qty");
    \u0275\u0275elementEnd();
  }
}
function PatientsComponent_div_14_div_38_label_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 55);
    \u0275\u0275text(1, "Amount");
    \u0275\u0275elementEnd();
  }
}
function PatientsComponent_div_14_div_38_label_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 55);
    \u0275\u0275text(1, "Discount");
    \u0275\u0275elementEnd();
  }
}
function PatientsComponent_div_14_div_38_label_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 55);
    \u0275\u0275text(1, "Total");
    \u0275\u0275elementEnd();
  }
}
function PatientsComponent_div_14_div_38_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 83)(1, "div", 84);
    \u0275\u0275template(2, PatientsComponent_div_14_div_38_label_2_Template, 2, 0, "label", 85);
    \u0275\u0275elementStart(3, "input", 86);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_14_div_38_Template_input_ngModelChange_3_listener($event) {
      const line_r14 = \u0275\u0275restoreView(_r13).$implicit;
      \u0275\u0275twoWayBindingSet(line_r14.description, $event) || (line_r14.description = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 87);
    \u0275\u0275template(5, PatientsComponent_div_14_div_38_label_5_Template, 2, 0, "label", 85);
    \u0275\u0275elementStart(6, "input", 88);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_14_div_38_Template_input_ngModelChange_6_listener($event) {
      const line_r14 = \u0275\u0275restoreView(_r13).$implicit;
      \u0275\u0275twoWayBindingSet(line_r14.quantity, $event) || (line_r14.quantity = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function PatientsComponent_div_14_div_38_Template_input_input_6_listener() {
      const line_r14 = \u0275\u0275restoreView(_r13).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.calcLine(line_r14));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 89);
    \u0275\u0275template(8, PatientsComponent_div_14_div_38_label_8_Template, 2, 0, "label", 85);
    \u0275\u0275elementStart(9, "input", 90);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_14_div_38_Template_input_ngModelChange_9_listener($event) {
      const line_r14 = \u0275\u0275restoreView(_r13).$implicit;
      \u0275\u0275twoWayBindingSet(line_r14.unitPrice, $event) || (line_r14.unitPrice = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function PatientsComponent_div_14_div_38_Template_input_input_9_listener() {
      const line_r14 = \u0275\u0275restoreView(_r13).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.calcLine(line_r14));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 87);
    \u0275\u0275template(11, PatientsComponent_div_14_div_38_label_11_Template, 2, 0, "label", 85);
    \u0275\u0275elementStart(12, "input", 90);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_14_div_38_Template_input_ngModelChange_12_listener($event) {
      const line_r14 = \u0275\u0275restoreView(_r13).$implicit;
      \u0275\u0275twoWayBindingSet(line_r14.discount, $event) || (line_r14.discount = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function PatientsComponent_div_14_div_38_Template_input_input_12_listener() {
      const line_r14 = \u0275\u0275restoreView(_r13).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.calcLine(line_r14));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 89);
    \u0275\u0275template(14, PatientsComponent_div_14_div_38_label_14_Template, 2, 0, "label", 85);
    \u0275\u0275elementStart(15, "div", 91);
    \u0275\u0275text(16);
    \u0275\u0275pipe(17, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 92)(19, "button", 27);
    \u0275\u0275listener("click", function PatientsComponent_div_14_div_38_Template_button_click_19_listener() {
      const i_r15 = \u0275\u0275restoreView(_r13).index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.removeLine(i_r15));
    });
    \u0275\u0275elementStart(20, "span", 26);
    \u0275\u0275text(21, "delete");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const line_r14 = ctx.$implicit;
    const i_r15 = ctx.index;
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", i_r15 === 0);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", line_r14.description);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", i_r15 === 0);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", line_r14.quantity);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", i_r15 === 0);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", line_r14.unitPrice);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", i_r15 === 0);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", line_r14.discount);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", i_r15 === 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(17, 10, line_r14._total));
  }
}
function PatientsComponent_div_14_span_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 71);
  }
}
function PatientsComponent_div_14_span_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span")(1, "span", 26);
    \u0275\u0275text(2, "save");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Save Bill");
    \u0275\u0275elementEnd();
  }
}
function PatientsComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 48);
    \u0275\u0275listener("click", function PatientsComponent_div_14_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showInvoiceForm = false);
    });
    \u0275\u0275elementStart(1, "div", 72);
    \u0275\u0275listener("click", function PatientsComponent_div_14_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r11);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 50)(3, "h3");
    \u0275\u0275text(4, "New Patient Bill");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 25);
    \u0275\u0275listener("click", function PatientsComponent_div_14_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showInvoiceForm = false);
    });
    \u0275\u0275elementStart(6, "span", 11);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 52)(9, "div", 53)(10, "div", 54)(11, "label", 55);
    \u0275\u0275text(12, "Patient *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "select", 57);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_14_Template_select_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.invoiceForm.patientId, $event) || (ctx_r1.invoiceForm.patientId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(14, "option", 73);
    \u0275\u0275text(15, "\u2014 Select Patient \u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275template(16, PatientsComponent_div_14_option_16_Template, 2, 3, "option", 74);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 54)(18, "label", 55);
    \u0275\u0275text(19, "Invoice Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "input", 60);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_14_Template_input_ngModelChange_20_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.invoiceForm.invoiceDate, $event) || (ctx_r1.invoiceForm.invoiceDate = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 54)(22, "label", 55);
    \u0275\u0275text(23, "Due Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "input", 60);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_14_Template_input_ngModelChange_24_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.invoiceForm.dueDate, $event) || (ctx_r1.invoiceForm.dueDate = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(25, "div", 64)(26, "label", 55);
    \u0275\u0275text(27, "Notes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "input", 75);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_14_Template_input_ngModelChange_28_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.invoiceForm.notes, $event) || (ctx_r1.invoiceForm.notes = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275element(29, "div", 76);
    \u0275\u0275elementStart(30, "div", 36)(31, "h4");
    \u0275\u0275text(32, "Bill Items / Services");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "button", 25);
    \u0275\u0275listener("click", function PatientsComponent_div_14_Template_button_click_33_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addLine());
    });
    \u0275\u0275elementStart(34, "span", 26);
    \u0275\u0275text(35, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(36, " Add Item");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "div", 77);
    \u0275\u0275template(38, PatientsComponent_div_14_div_38_Template, 22, 12, "div", 78);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "div", 79)(40, "div", 80)(41, "span");
    \u0275\u0275text(42, "Sub Total:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "span");
    \u0275\u0275text(44);
    \u0275\u0275pipe(45, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "div", 80)(47, "span");
    \u0275\u0275text(48, "Tax Amount:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "input", 81);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_14_Template_input_ngModelChange_49_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.invoiceForm.taxAmount, $event) || (ctx_r1.invoiceForm.taxAmount = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(50, "div", 80)(51, "span");
    \u0275\u0275text(52, "Global Discount:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "input", 81);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_14_Template_input_ngModelChange_53_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.invoiceForm.discountAmount, $event) || (ctx_r1.invoiceForm.discountAmount = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(54, "div", 82)(55, "span");
    \u0275\u0275text(56, "Total:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "span");
    \u0275\u0275text(58);
    \u0275\u0275pipe(59, "currency");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(60, "div", 66)(61, "button", 67);
    \u0275\u0275listener("click", function PatientsComponent_div_14_Template_button_click_61_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showInvoiceForm = false);
    });
    \u0275\u0275text(62);
    \u0275\u0275pipe(63, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(64, "button", 68);
    \u0275\u0275listener("click", function PatientsComponent_div_14_Template_button_click_64_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveInvoice());
    });
    \u0275\u0275template(65, PatientsComponent_div_14_span_65_Template, 1, 0, "span", 69)(66, PatientsComponent_div_14_span_66_Template, 4, 0, "span", 4);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(13);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.invoiceForm.patientId);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r1.patients);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.invoiceForm.invoiceDate);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.invoiceForm.dueDate);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.invoiceForm.notes);
    \u0275\u0275advance(10);
    \u0275\u0275property("ngForOf", ctx_r1.invoiceForm.items);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(45, 15, ctx_r1.getSubTotal()));
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.invoiceForm.taxAmount);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.invoiceForm.discountAmount);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(59, 17, ctx_r1.getTotal()));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(63, 19, "CANCEL"));
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.saving);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.saving);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.saving);
  }
}
function PatientsComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 48);
    \u0275\u0275listener("click", function PatientsComponent_div_15_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showPayModal = false);
    });
    \u0275\u0275elementStart(1, "div", 93);
    \u0275\u0275listener("click", function PatientsComponent_div_15_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r16);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 50)(3, "h3");
    \u0275\u0275text(4, "Record Payment");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 25);
    \u0275\u0275listener("click", function PatientsComponent_div_15_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showPayModal = false);
    });
    \u0275\u0275elementStart(6, "span", 11);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 52)(9, "div", 94)(10, "div", 95)(11, "span", 96);
    \u0275\u0275text(12, "Invoice");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 22);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 95)(16, "span", 96);
    \u0275\u0275text(17, "Patient");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 95)(21, "span", 96);
    \u0275\u0275text(22, "Total Amount");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span");
    \u0275\u0275text(24);
    \u0275\u0275pipe(25, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div", 95)(27, "span", 96);
    \u0275\u0275text(28, "Paid So Far");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "span", 45);
    \u0275\u0275text(30);
    \u0275\u0275pipe(31, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "div", 95)(33, "span", 96);
    \u0275\u0275text(34, "Remaining");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "span", 97);
    \u0275\u0275text(36);
    \u0275\u0275pipe(37, "currency");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(38, "div", 64)(39, "label", 55);
    \u0275\u0275text(40, "Payment Amount *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "input", 98);
    \u0275\u0275twoWayListener("ngModelChange", function PatientsComponent_div_15_Template_input_ngModelChange_41_listener($event) {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.payAmount, $event) || (ctx_r1.payAmount = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(42, "div", 66)(43, "button", 67);
    \u0275\u0275listener("click", function PatientsComponent_div_15_Template_button_click_43_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showPayModal = false);
    });
    \u0275\u0275text(44);
    \u0275\u0275pipe(45, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "button", 99);
    \u0275\u0275listener("click", function PatientsComponent_div_15_Template_button_click_46_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.confirmPay());
    });
    \u0275\u0275elementStart(47, "span", 26);
    \u0275\u0275text(48, "payments");
    \u0275\u0275elementEnd();
    \u0275\u0275text(49, " Confirm Payment");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(14);
    \u0275\u0275textInterpolate(ctx_r1.selectedInvoice == null ? null : ctx_r1.selectedInvoice.invoiceNumber);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.selectedInvoice == null ? null : ctx_r1.selectedInvoice.patientName);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(25, 8, ctx_r1.selectedInvoice == null ? null : ctx_r1.selectedInvoice.totalAmount));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(31, 10, ctx_r1.selectedInvoice == null ? null : ctx_r1.selectedInvoice.paidAmount));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(37, 12, (ctx_r1.selectedInvoice == null ? null : ctx_r1.selectedInvoice.totalAmount) - (ctx_r1.selectedInvoice == null ? null : ctx_r1.selectedInvoice.paidAmount)));
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.payAmount);
    \u0275\u0275property("max", (ctx_r1.selectedInvoice == null ? null : ctx_r1.selectedInvoice.totalAmount) - (ctx_r1.selectedInvoice == null ? null : ctx_r1.selectedInvoice.paidAmount));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(45, 14, "CANCEL"));
  }
}
var PatientsComponent = class _PatientsComponent {
  constructor(svc, invSvc, toast) {
    this.svc = svc;
    this.invSvc = invSvc;
    this.toast = toast;
    this.tab = "patients";
    this.patients = [];
    this.invoices = [];
    this.loading = true;
    this.search = "";
    this.invoiceFilter = "";
    this.page = 1;
    this.totalPages = 1;
    this.showForm = false;
    this.showInvoiceForm = false;
    this.showPayModal = false;
    this.editing = null;
    this.saving = false;
    this.form = {};
    this.invoiceForm = this.freshInvoiceForm();
    this.selectedInvoice = null;
    this.payAmount = 0;
    this.bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  }
  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.loading = true;
    this.svc.getAll({ page: this.page, pageSize: 20, search: this.search }).subscribe({
      next: (r) => {
        this.patients = r.items;
        this.totalPages = r.totalPages;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  loadInvoices() {
    this.invSvc.getAll({}, this.invoiceFilter || void 0, "Hospital").subscribe({
      next: (r) => this.invoices = r.items
    });
  }
  freshInvoiceForm() {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const due = new Date(Date.now() + 14 * 864e5).toISOString().split("T")[0];
    return { patientId: null, invoiceDate: today, dueDate: due, notes: "", discountAmount: 0, taxAmount: 0, invoiceType: "Hospital", items: [this.freshLine()] };
  }
  freshLine() {
    return { description: "", quantity: 1, unitPrice: 0, taxRate: 0, discount: 0, _total: 0 };
  }
  openForm(patient) {
    this.editing = patient || null;
    this.form = patient ? __spreadProps(__spreadValues({}, patient), { dateOfBirth: patient.dateOfBirth?.split("T")[0] }) : { gender: "Male", dateOfBirth: "" };
    this.showForm = true;
  }
  openInvoiceForm() {
    if (this.patients.length === 0)
      this.loadData();
    this.invoiceForm = this.freshInvoiceForm();
    this.showInvoiceForm = true;
  }
  openPayModal(inv) {
    this.selectedInvoice = inv;
    this.payAmount = +(inv.totalAmount - inv.paidAmount).toFixed(2);
    this.showPayModal = true;
  }
  addLine() {
    this.invoiceForm.items.push(this.freshLine());
  }
  removeLine(i) {
    if (this.invoiceForm.items.length > 1)
      this.invoiceForm.items.splice(i, 1);
  }
  calcLine(line) {
    const qty = +line.quantity || 0;
    const price = +line.unitPrice || 0;
    const disc = +line.discount || 0;
    line._total = qty * price - disc;
  }
  getSubTotal() {
    return this.invoiceForm.items.reduce((s, l) => s + (+l.quantity * +l.unitPrice - +l.discount), 0);
  }
  getTotal() {
    return this.getSubTotal() + (+this.invoiceForm.taxAmount || 0) - (+this.invoiceForm.discountAmount || 0);
  }
  save() {
    if (!this.form.fullName)
      return;
    this.saving = true;
    const obs = this.editing ? this.svc.update(this.editing.id, this.form) : this.svc.create(this.form);
    obs.subscribe({
      next: () => {
        this.toast.success("Saved successfully");
        this.showForm = false;
        this.saving = false;
        this.loadData();
      },
      error: () => {
        this.toast.error("Error saving");
        this.saving = false;
      }
    });
  }
  saveInvoice() {
    if (!this.invoiceForm.patientId) {
      this.toast.error("Please select a patient");
      return;
    }
    if (!this.invoiceForm.items.some((l) => l.description)) {
      this.toast.error("Add at least one item description");
      return;
    }
    this.saving = true;
    const payload = __spreadProps(__spreadValues({}, this.invoiceForm), {
      taxAmount: +this.invoiceForm.taxAmount,
      discountAmount: +this.invoiceForm.discountAmount,
      items: this.invoiceForm.items.filter((l) => l.description).map((l) => ({
        description: l.description,
        quantity: +l.quantity,
        unitPrice: +l.unitPrice,
        taxRate: +l.taxRate,
        discount: +l.discount
      }))
    });
    this.invSvc.create(payload).subscribe({
      next: () => {
        this.toast.success("Bill created");
        this.showInvoiceForm = false;
        this.saving = false;
        this.tab = "invoices";
        this.loadInvoices();
      },
      error: (e) => {
        this.toast.error(e.error?.message || "Error creating bill");
        this.saving = false;
      }
    });
  }
  confirmPay() {
    if (!this.payAmount || this.payAmount <= 0) {
      this.toast.error("Enter a valid amount");
      return;
    }
    this.invSvc.recordPayment({ invoiceId: this.selectedInvoice.id, patientId: this.selectedInvoice.patientId, amount: this.payAmount, paymentMethod: "Cash" }).subscribe({
      next: () => {
        this.toast.success("Payment recorded");
        this.showPayModal = false;
        this.loadInvoices();
      },
      error: () => this.toast.error("Payment failed")
    });
  }
  deletePatient(p) {
    if (confirm("Delete patient?")) {
      this.svc.delete(p.id).subscribe({ next: () => {
        this.toast.success("Deleted");
        this.loadData();
      } });
    }
  }
  static {
    this.\u0275fac = function PatientsComponent_Factory(t) {
      return new (t || _PatientsComponent)(\u0275\u0275directiveInject(PatientService), \u0275\u0275directiveInject(InvoiceService), \u0275\u0275directiveInject(ToastService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PatientsComponent, selectors: [["app-patients"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 16, vars: 19, consts: [[1, "page-header"], [1, "page-title"], [1, "flex", "gap-2"], [1, "btn", 3, "click"], [4, "ngIf"], ["class", "modal-overlay", 3, "click", 4, "ngIf"], [1, "filter-bar", "mb-4"], [1, "search-bar"], [1, "material-icons-round", "search-icon"], [1, "form-control", 3, "ngModelChange", "input", "placeholder", "ngModel"], [1, "btn", "btn-primary", 3, "click"], [1, "material-icons-round"], [1, "card", 2, "padding", "0"], ["class", "loading-container", 4, "ngIf"], ["class", "table-container", 4, "ngIf"], ["class", "pagination", 4, "ngIf"], [1, "loading-container"], [1, "spinner"], [1, "table-container"], [1, "table"], [4, "ngFor", "ngForOf"], [1, "badge", "badge-primary"], [1, "font-semibold"], [1, "badge", 3, "ngClass"], [1, "flex", "gap-1"], [1, "btn", "btn-sm", "btn-secondary", 3, "click"], [1, "material-icons-round", 2, "font-size", "16px"], [1, "btn", "btn-sm", "btn-danger", 3, "click"], ["colspan", "7"], [1, "empty-state"], [1, "material-icons-round", "empty-icon"], [1, "empty-title"], [1, "pagination"], [1, "pagination-info"], [1, "pagination-buttons"], [1, "page-btn", 3, "click", "disabled"], [1, "flex", "justify-between", "items-center", "mb-4"], [1, "filter-bar"], [1, "form-control", 2, "min-width", "160px", 3, "ngModelChange", "change", "ngModel"], ["value", ""], ["value", "Pending"], ["value", "PartiallyPaid"], ["value", "Paid"], [1, "btn", "btn-primary", "btn-sm", 3, "click"], [1, "badge", "badge-info"], [1, "text-success"], ["class", "btn btn-sm btn-success", 3, "click", 4, "ngIf"], [1, "btn", "btn-sm", "btn-success", 3, "click"], [1, "modal-overlay", 3, "click"], [1, "modal", 3, "click"], [1, "modal-header"], [1, "modal-title"], [1, "modal-body"], [1, "form-row"], [1, "form-group"], [1, "form-label"], ["required", "", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "form-control", 3, "ngModelChange", "ngModel"], [1, "form-row", "mt-4"], ["type", "email", 1, "form-control", 3, "ngModelChange", "ngModel"], ["type", "date", 1, "form-control", 3, "ngModelChange", "ngModel"], ["value", "Male"], ["value", "Female"], [3, "value", 4, "ngFor", "ngForOf"], [1, "form-group", "mt-4"], ["rows", "2", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "modal-footer"], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["class", "spinner spinner-sm", 4, "ngIf"], [3, "value"], [1, "spinner", "spinner-sm"], [1, "modal", "modal-lg", 3, "click"], [3, "ngValue"], [3, "ngValue", 4, "ngFor", "ngForOf"], ["placeholder", "Optional notes...", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "divider"], [1, "inv-lines"], ["class", "inv-line", 4, "ngFor", "ngForOf"], [1, "inv-summary"], [1, "summary-row"], ["type", "number", 1, "form-control", 2, "width", "120px", "text-align", "end", 3, "ngModelChange", "ngModel"], [1, "summary-row", "total"], [1, "inv-line"], [1, "form-group", 2, "flex", "2"], ["class", "form-label", 4, "ngIf"], ["placeholder", "Consultation, X-Ray, etc.", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "form-group", 2, "flex", "0.8"], ["type", "number", "min", "1", 1, "form-control", 3, "ngModelChange", "input", "ngModel"], [1, "form-group", 2, "flex", "1"], ["type", "number", 1, "form-control", 3, "ngModelChange", "input", "ngModel"], [1, "form-control", 2, "background", "rgba(255,255,255,0.03)", "color", "var(--success)", "font-weight", "700"], [2, "display", "flex", "align-items", "flex-end", "padding-bottom", "2px"], [1, "modal", 2, "max-width", "420px", 3, "click"], [1, "pay-info-card"], [1, "pay-row"], [1, "text-muted"], [1, "text-danger", "font-semibold"], ["type", "number", "min", "0.01", "placeholder", "Enter amount...", 1, "form-control", 3, "ngModelChange", "ngModel", "max"], [1, "btn", "btn-success", 3, "click"]], template: function PatientsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div")(2, "h1", 1);
        \u0275\u0275text(3);
        \u0275\u0275pipe(4, "translate");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(5, "div", 2)(6, "button", 3);
        \u0275\u0275listener("click", function PatientsComponent_Template_button_click_6_listener() {
          return ctx.tab = "patients";
        });
        \u0275\u0275text(7);
        \u0275\u0275pipe(8, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "button", 3);
        \u0275\u0275listener("click", function PatientsComponent_Template_button_click_9_listener() {
          ctx.tab = "invoices";
          return ctx.loadInvoices();
        });
        \u0275\u0275text(10, "Patient Invoices (Billing)");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(11, PatientsComponent_div_11_Template, 16, 10, "div", 4)(12, PatientsComponent_div_12_Template, 41, 2, "div", 4)(13, PatientsComponent_div_13_Template, 82, 60, "div", 5)(14, PatientsComponent_div_14_Template, 67, 21, "div", 5)(15, PatientsComponent_div_15_Template, 50, 16, "div", 5);
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 15, "PATIENTS"));
        \u0275\u0275advance(3);
        \u0275\u0275classProp("btn-primary", ctx.tab === "patients")("btn-secondary", ctx.tab !== "patients");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 17, "PATIENTS"));
        \u0275\u0275advance(2);
        \u0275\u0275classProp("btn-primary", ctx.tab === "invoices")("btn-secondary", ctx.tab !== "invoices");
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.tab === "patients");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.tab === "invoices");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showForm);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showInvoiceForm);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showPayModal);
      }
    }, dependencies: [CommonModule, NgClass, NgForOf, NgIf, CurrencyPipe, DatePipe, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, RequiredValidator, MinValidator, MaxValidator, NgModel, TranslateModule, TranslatePipe], styles: ["\n\n.inv-lines[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.inv-line[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: flex-start;\n}\n.inv-line[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.inv-summary[_ngcontent-%COMP%] {\n  margin-top: 20px;\n  border-top: 1px solid var(--border);\n  padding-top: 16px;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 8px;\n}\n.summary-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  font-size: 0.9rem;\n}\n.summary-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:first-child {\n  color: var(--text-secondary);\n  min-width: 100px;\n  text-align: end;\n}\n.summary-row.total[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 700;\n  color: var(--primary-light);\n  border-top: 1px solid var(--border);\n  padding-top: 8px;\n  margin-top: 4px;\n}\n.pay-info-card[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.03);\n  border-radius: 12px;\n  padding: 16px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.pay-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  font-size: 0.9rem;\n}\n/*# sourceMappingURL=patients.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PatientsComponent, { className: "PatientsComponent", filePath: "src\\app\\features\\patients\\patients.component.ts", lineNumber: 266 });
})();
export {
  PatientsComponent
};
//# sourceMappingURL=chunk-I6QDHA4N.js.map
