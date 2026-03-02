import {
  DefaultValueAccessor,
  FormsModule,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-GVBL3DCA.js";
import {
  ToastService
} from "./chunk-DM7YHZMX.js";
import {
  InventoryService,
  SalesService
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
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-QQTHLIA4.js";

// src/app/features/sales/sales.component.ts
function SalesComponent_div_12_tr_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 16);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 17);
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
    \u0275\u0275pipe(12, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td")(14, "button", 18);
    \u0275\u0275listener("click", function SalesComponent_div_12_tr_30_Template_button_click_14_listener() {
      const c_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.editCust(c_r4));
    });
    \u0275\u0275elementStart(15, "span", 19);
    \u0275\u0275text(16, "edit");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const c_r4 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(c_r4.customerCode);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r4.customerName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r4.contactPerson);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r4.phoneNumber);
    \u0275\u0275advance();
    \u0275\u0275classProp("text-danger", c_r4.balance > 0)("text-success", c_r4.balance <= 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(12, 9, c_r4.balance));
  }
}
function SalesComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 6)(2, "div", 7)(3, "span", 8);
    \u0275\u0275text(4, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "input", 9);
    \u0275\u0275pipe(6, "translate");
    \u0275\u0275twoWayListener("ngModelChange", function SalesComponent_div_12_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.search, $event) || (ctx_r1.search = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function SalesComponent_div_12_Template_input_input_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.loadCustomers());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 10);
    \u0275\u0275listener("click", function SalesComponent_div_12_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openCustomerForm());
    });
    \u0275\u0275elementStart(8, "span", 11);
    \u0275\u0275text(9, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "translate");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 12)(13, "div", 13)(14, "table", 14)(15, "thead")(16, "tr")(17, "th");
    \u0275\u0275text(18, "Code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th");
    \u0275\u0275text(20, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "th");
    \u0275\u0275text(22, "Contact");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "th");
    \u0275\u0275text(24, "Phone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "th");
    \u0275\u0275text(26, "Balance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "th");
    \u0275\u0275text(28, "Actions");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(29, "tbody");
    \u0275\u0275template(30, SalesComponent_div_12_tr_30_Template, 17, 11, "tr", 15);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("placeholder", \u0275\u0275pipeBind1(6, 4, "SEARCH"));
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.search);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(11, 6, "ADD_NEW"), "");
    \u0275\u0275advance(20);
    \u0275\u0275property("ngForOf", ctx_r1.customers);
  }
}
function SalesComponent_div_13_tr_40_button_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 30);
    \u0275\u0275listener("click", function SalesComponent_div_13_tr_40_button_25_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const i_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openPayModal(i_r7));
    });
    \u0275\u0275elementStart(1, "span", 19);
    \u0275\u0275text(2, "payments");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Pay");
    \u0275\u0275elementEnd();
  }
}
function SalesComponent_div_13_tr_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 26);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 17);
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
    \u0275\u0275elementStart(15, "td", 27);
    \u0275\u0275text(16);
    \u0275\u0275pipe(17, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "td");
    \u0275\u0275text(19);
    \u0275\u0275pipe(20, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "td")(22, "span", 28);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "td");
    \u0275\u0275template(25, SalesComponent_div_13_tr_40_button_25_Template, 4, 0, "button", 29);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const i_r7 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(i_r7.invoiceNumber);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(i_r7.customerName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(8, 12, i_r7.invoiceDate, "mediumDate"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(11, 15, i_r7.dueDate, "mediumDate"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(14, 18, i_r7.totalAmount));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(17, 20, i_r7.paidAmount));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("text-danger", i_r7.totalAmount - i_r7.paidAmount > 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(20, 22, i_r7.totalAmount - i_r7.paidAmount));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", i_r7.status === "Paid" ? "badge-success" : i_r7.status === "PartiallyPaid" ? "badge-warning" : "badge-danger");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(i_r7.status);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", i_r7.status !== "Paid");
  }
}
function SalesComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 6)(2, "div", 20)(3, "select", 21);
    \u0275\u0275twoWayListener("ngModelChange", function SalesComponent_div_13_Template_select_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.invoiceFilter, $event) || (ctx_r1.invoiceFilter = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function SalesComponent_div_13_Template_select_change_3_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.loadInvoices());
    });
    \u0275\u0275elementStart(4, "option", 22);
    \u0275\u0275text(5, "All Statuses");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "option", 23);
    \u0275\u0275text(7, "Pending");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "option", 24);
    \u0275\u0275text(9, "Partially Paid");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "option", 25);
    \u0275\u0275text(11, "Paid");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "button", 10);
    \u0275\u0275listener("click", function SalesComponent_div_13_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openInvoiceForm());
    });
    \u0275\u0275elementStart(13, "span", 11);
    \u0275\u0275text(14, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(15, " New Invoice");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 12)(17, "div", 13)(18, "table", 14)(19, "thead")(20, "tr")(21, "th");
    \u0275\u0275text(22, "Invoice #");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "th");
    \u0275\u0275text(24, "Customer");
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
    \u0275\u0275template(40, SalesComponent_div_13_tr_40_Template, 26, 24, "tr", 15);
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
function SalesComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 31);
    \u0275\u0275listener("click", function SalesComponent_div_14_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showCustForm = false);
    });
    \u0275\u0275elementStart(1, "div", 32);
    \u0275\u0275listener("click", function SalesComponent_div_14_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r8);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 33)(3, "h3");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 18);
    \u0275\u0275listener("click", function SalesComponent_div_14_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showCustForm = false);
    });
    \u0275\u0275elementStart(6, "span", 11);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 34)(9, "div", 35)(10, "div", 36)(11, "label", 37);
    \u0275\u0275text(12, "Name *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "input", 38);
    \u0275\u0275twoWayListener("ngModelChange", function SalesComponent_div_14_Template_input_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.custForm.customerName, $event) || (ctx_r1.custForm.customerName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 36)(15, "label", 37);
    \u0275\u0275text(16, "Contact Person");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "input", 38);
    \u0275\u0275twoWayListener("ngModelChange", function SalesComponent_div_14_Template_input_ngModelChange_17_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.custForm.contactPerson, $event) || (ctx_r1.custForm.contactPerson = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "div", 39)(19, "div", 36)(20, "label", 37);
    \u0275\u0275text(21, "Phone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "input", 38);
    \u0275\u0275twoWayListener("ngModelChange", function SalesComponent_div_14_Template_input_ngModelChange_22_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.custForm.phoneNumber, $event) || (ctx_r1.custForm.phoneNumber = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 36)(24, "label", 37);
    \u0275\u0275text(25, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "input", 38);
    \u0275\u0275twoWayListener("ngModelChange", function SalesComponent_div_14_Template_input_ngModelChange_26_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.custForm.email, $event) || (ctx_r1.custForm.email = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(27, "div", 39)(28, "div", 36)(29, "label", 37);
    \u0275\u0275text(30, "Address");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "input", 38);
    \u0275\u0275twoWayListener("ngModelChange", function SalesComponent_div_14_Template_input_ngModelChange_31_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.custForm.address, $event) || (ctx_r1.custForm.address = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "div", 36)(33, "label", 37);
    \u0275\u0275text(34, "Tax Number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "input", 38);
    \u0275\u0275twoWayListener("ngModelChange", function SalesComponent_div_14_Template_input_ngModelChange_35_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.custForm.taxNumber, $event) || (ctx_r1.custForm.taxNumber = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(36, "div", 40)(37, "button", 41);
    \u0275\u0275listener("click", function SalesComponent_div_14_Template_button_click_37_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showCustForm = false);
    });
    \u0275\u0275text(38);
    \u0275\u0275pipe(39, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "button", 42);
    \u0275\u0275listener("click", function SalesComponent_div_14_Template_button_click_40_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveCust());
    });
    \u0275\u0275text(41);
    \u0275\u0275pipe(42, "translate");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", ctx_r1.custForm.id ? "Edit" : "New", " Customer");
    \u0275\u0275advance(9);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.custForm.customerName);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.custForm.contactPerson);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.custForm.phoneNumber);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.custForm.email);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.custForm.address);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.custForm.taxNumber);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(39, 9, "CANCEL"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(42, 11, "SAVE"));
  }
}
function SalesComponent_div_15_option_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 44);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r10 = ctx.$implicit;
    \u0275\u0275property("ngValue", c_r10.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r10.customerName);
  }
}
function SalesComponent_div_15_div_38_label_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 37);
    \u0275\u0275text(1, "Item");
    \u0275\u0275elementEnd();
  }
}
function SalesComponent_div_15_div_38_option_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 44);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const it_r13 = ctx.$implicit;
    \u0275\u0275property("ngValue", it_r13.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(it_r13.itemName);
  }
}
function SalesComponent_div_15_div_38_label_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 37);
    \u0275\u0275text(1, "Warehouse");
    \u0275\u0275elementEnd();
  }
}
function SalesComponent_div_15_div_38_option_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 44);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const w_r14 = ctx.$implicit;
    \u0275\u0275property("ngValue", w_r14.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(w_r14.warehouseName);
  }
}
function SalesComponent_div_15_div_38_label_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 37);
    \u0275\u0275text(1, "Qty");
    \u0275\u0275elementEnd();
  }
}
function SalesComponent_div_15_div_38_label_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 37);
    \u0275\u0275text(1, "Unit Price");
    \u0275\u0275elementEnd();
  }
}
function SalesComponent_div_15_div_38_label_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 37);
    \u0275\u0275text(1, "Tax %");
    \u0275\u0275elementEnd();
  }
}
function SalesComponent_div_15_div_38_label_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 37);
    \u0275\u0275text(1, "Discount");
    \u0275\u0275elementEnd();
  }
}
function SalesComponent_div_15_div_38_label_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 37);
    \u0275\u0275text(1, "Total");
    \u0275\u0275elementEnd();
  }
}
function SalesComponent_div_15_div_38_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 58)(1, "div", 59);
    \u0275\u0275template(2, SalesComponent_div_15_div_38_label_2_Template, 2, 0, "label", 60);
    \u0275\u0275elementStart(3, "select", 61);
    \u0275\u0275twoWayListener("ngModelChange", function SalesComponent_div_15_div_38_Template_select_ngModelChange_3_listener($event) {
      const line_r12 = \u0275\u0275restoreView(_r11).$implicit;
      \u0275\u0275twoWayBindingSet(line_r12.itemId, $event) || (line_r12.itemId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function SalesComponent_div_15_div_38_Template_select_change_3_listener() {
      const line_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onItemSelect(line_r12));
    });
    \u0275\u0275elementStart(4, "option", 44);
    \u0275\u0275text(5, "\u2014 Select Item \u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, SalesComponent_div_15_div_38_option_6_Template, 2, 2, "option", 45);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 62);
    \u0275\u0275template(8, SalesComponent_div_15_div_38_label_8_Template, 2, 0, "label", 60);
    \u0275\u0275elementStart(9, "select", 38);
    \u0275\u0275twoWayListener("ngModelChange", function SalesComponent_div_15_div_38_Template_select_ngModelChange_9_listener($event) {
      const line_r12 = \u0275\u0275restoreView(_r11).$implicit;
      \u0275\u0275twoWayBindingSet(line_r12.warehouseId, $event) || (line_r12.warehouseId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(10, "option", 44);
    \u0275\u0275text(11, "\u2014 Warehouse \u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275template(12, SalesComponent_div_15_div_38_option_12_Template, 2, 2, "option", 45);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 63);
    \u0275\u0275template(14, SalesComponent_div_15_div_38_label_14_Template, 2, 0, "label", 60);
    \u0275\u0275elementStart(15, "input", 64);
    \u0275\u0275twoWayListener("ngModelChange", function SalesComponent_div_15_div_38_Template_input_ngModelChange_15_listener($event) {
      const line_r12 = \u0275\u0275restoreView(_r11).$implicit;
      \u0275\u0275twoWayBindingSet(line_r12.quantity, $event) || (line_r12.quantity = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function SalesComponent_div_15_div_38_Template_input_input_15_listener() {
      const line_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.calcLine(line_r12));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 65);
    \u0275\u0275template(17, SalesComponent_div_15_div_38_label_17_Template, 2, 0, "label", 60);
    \u0275\u0275elementStart(18, "input", 66);
    \u0275\u0275twoWayListener("ngModelChange", function SalesComponent_div_15_div_38_Template_input_ngModelChange_18_listener($event) {
      const line_r12 = \u0275\u0275restoreView(_r11).$implicit;
      \u0275\u0275twoWayBindingSet(line_r12.unitPrice, $event) || (line_r12.unitPrice = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function SalesComponent_div_15_div_38_Template_input_input_18_listener() {
      const line_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.calcLine(line_r12));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 63);
    \u0275\u0275template(20, SalesComponent_div_15_div_38_label_20_Template, 2, 0, "label", 60);
    \u0275\u0275elementStart(21, "input", 66);
    \u0275\u0275twoWayListener("ngModelChange", function SalesComponent_div_15_div_38_Template_input_ngModelChange_21_listener($event) {
      const line_r12 = \u0275\u0275restoreView(_r11).$implicit;
      \u0275\u0275twoWayBindingSet(line_r12.taxRate, $event) || (line_r12.taxRate = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function SalesComponent_div_15_div_38_Template_input_input_21_listener() {
      const line_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.calcLine(line_r12));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "div", 63);
    \u0275\u0275template(23, SalesComponent_div_15_div_38_label_23_Template, 2, 0, "label", 60);
    \u0275\u0275elementStart(24, "input", 66);
    \u0275\u0275twoWayListener("ngModelChange", function SalesComponent_div_15_div_38_Template_input_ngModelChange_24_listener($event) {
      const line_r12 = \u0275\u0275restoreView(_r11).$implicit;
      \u0275\u0275twoWayBindingSet(line_r12.discount, $event) || (line_r12.discount = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function SalesComponent_div_15_div_38_Template_input_input_24_listener() {
      const line_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.calcLine(line_r12));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 65);
    \u0275\u0275template(26, SalesComponent_div_15_div_38_label_26_Template, 2, 0, "label", 60);
    \u0275\u0275elementStart(27, "div", 67);
    \u0275\u0275text(28);
    \u0275\u0275pipe(29, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "div", 68)(31, "button", 69);
    \u0275\u0275listener("click", function SalesComponent_div_15_div_38_Template_button_click_31_listener() {
      const i_r15 = \u0275\u0275restoreView(_r11).index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.removeLine(i_r15));
    });
    \u0275\u0275elementStart(32, "span", 19);
    \u0275\u0275text(33, "delete");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const line_r12 = ctx.$implicit;
    const i_r15 = ctx.index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", i_r15 === 0);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", line_r12.itemId);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r1.inventoryItems);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", i_r15 === 0);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", line_r12.warehouseId);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r1.warehouses);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", i_r15 === 0);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", line_r12.quantity);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", i_r15 === 0);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", line_r12.unitPrice);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", i_r15 === 0);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", line_r12.taxRate);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", i_r15 === 0);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", line_r12.discount);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", i_r15 === 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(29, 18, line_r12._total));
  }
}
function SalesComponent_div_15_span_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 70);
  }
}
function SalesComponent_div_15_span_68_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span")(1, "span", 19);
    \u0275\u0275text(2, "save");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Save Invoice");
    \u0275\u0275elementEnd();
  }
}
function SalesComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 31);
    \u0275\u0275listener("click", function SalesComponent_div_15_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showInvoiceForm = false);
    });
    \u0275\u0275elementStart(1, "div", 43);
    \u0275\u0275listener("click", function SalesComponent_div_15_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r9);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 33)(3, "h3");
    \u0275\u0275text(4, "New Sales Invoice");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 18);
    \u0275\u0275listener("click", function SalesComponent_div_15_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showInvoiceForm = false);
    });
    \u0275\u0275elementStart(6, "span", 11);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 34)(9, "div", 35)(10, "div", 36)(11, "label", 37);
    \u0275\u0275text(12, "Customer *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "select", 38);
    \u0275\u0275twoWayListener("ngModelChange", function SalesComponent_div_15_Template_select_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.invoiceForm.customerId, $event) || (ctx_r1.invoiceForm.customerId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(14, "option", 44);
    \u0275\u0275text(15, "\u2014 Select Customer \u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275template(16, SalesComponent_div_15_option_16_Template, 2, 2, "option", 45);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 36)(18, "label", 37);
    \u0275\u0275text(19, "Invoice Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "input", 46);
    \u0275\u0275twoWayListener("ngModelChange", function SalesComponent_div_15_Template_input_ngModelChange_20_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.invoiceForm.invoiceDate, $event) || (ctx_r1.invoiceForm.invoiceDate = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 36)(22, "label", 37);
    \u0275\u0275text(23, "Due Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "input", 46);
    \u0275\u0275twoWayListener("ngModelChange", function SalesComponent_div_15_Template_input_ngModelChange_24_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.invoiceForm.dueDate, $event) || (ctx_r1.invoiceForm.dueDate = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(25, "div", 47)(26, "label", 37);
    \u0275\u0275text(27, "Notes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "input", 48);
    \u0275\u0275twoWayListener("ngModelChange", function SalesComponent_div_15_Template_input_ngModelChange_28_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.invoiceForm.notes, $event) || (ctx_r1.invoiceForm.notes = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275element(29, "div", 49);
    \u0275\u0275elementStart(30, "div", 6)(31, "h4");
    \u0275\u0275text(32, "Invoice Lines");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "button", 18);
    \u0275\u0275listener("click", function SalesComponent_div_15_Template_button_click_33_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.addLine());
    });
    \u0275\u0275elementStart(34, "span", 19);
    \u0275\u0275text(35, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(36, " Add Line");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(37, "div", 50);
    \u0275\u0275template(38, SalesComponent_div_15_div_38_Template, 34, 20, "div", 51);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "div", 52)(40, "div", 53)(41, "span");
    \u0275\u0275text(42, "Sub Total:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "span");
    \u0275\u0275text(44);
    \u0275\u0275pipe(45, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(46, "div", 53)(47, "span");
    \u0275\u0275text(48, "Tax:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "span");
    \u0275\u0275text(50);
    \u0275\u0275pipe(51, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(52, "div", 53)(53, "span");
    \u0275\u0275text(54, "Discount:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "input", 54);
    \u0275\u0275twoWayListener("ngModelChange", function SalesComponent_div_15_Template_input_ngModelChange_55_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.invoiceForm.discountAmount, $event) || (ctx_r1.invoiceForm.discountAmount = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(56, "div", 55)(57, "span");
    \u0275\u0275text(58, "Total:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "span");
    \u0275\u0275text(60);
    \u0275\u0275pipe(61, "currency");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(62, "div", 40)(63, "button", 41);
    \u0275\u0275listener("click", function SalesComponent_div_15_Template_button_click_63_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showInvoiceForm = false);
    });
    \u0275\u0275text(64);
    \u0275\u0275pipe(65, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "button", 56);
    \u0275\u0275listener("click", function SalesComponent_div_15_Template_button_click_66_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveInvoice());
    });
    \u0275\u0275template(67, SalesComponent_div_15_span_67_Template, 1, 0, "span", 57)(68, SalesComponent_div_15_span_68_Template, 4, 0, "span", 4);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(13);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.invoiceForm.customerId);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r1.customers);
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
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(51, 17, ctx_r1.getTax()));
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.invoiceForm.discountAmount);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(61, 19, ctx_r1.getTotal()));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(65, 21, "CANCEL"));
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.saving);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.saving);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.saving);
  }
}
function SalesComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 31);
    \u0275\u0275listener("click", function SalesComponent_div_16_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showPayModal = false);
    });
    \u0275\u0275elementStart(1, "div", 71);
    \u0275\u0275listener("click", function SalesComponent_div_16_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r16);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 33)(3, "h3");
    \u0275\u0275text(4, "Record Payment");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 18);
    \u0275\u0275listener("click", function SalesComponent_div_16_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showPayModal = false);
    });
    \u0275\u0275elementStart(6, "span", 11);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 34)(9, "div", 72)(10, "div", 73)(11, "span", 74);
    \u0275\u0275text(12, "Invoice");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 17);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 73)(16, "span", 74);
    \u0275\u0275text(17, "Customer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "div", 73)(21, "span", 74);
    \u0275\u0275text(22, "Total Amount");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span");
    \u0275\u0275text(24);
    \u0275\u0275pipe(25, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div", 73)(27, "span", 74);
    \u0275\u0275text(28, "Paid So Far");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "span", 27);
    \u0275\u0275text(30);
    \u0275\u0275pipe(31, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "div", 73)(33, "span", 74);
    \u0275\u0275text(34, "Remaining");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "span", 75);
    \u0275\u0275text(36);
    \u0275\u0275pipe(37, "currency");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(38, "div", 47)(39, "label", 37);
    \u0275\u0275text(40, "Payment Amount *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "input", 76);
    \u0275\u0275twoWayListener("ngModelChange", function SalesComponent_div_16_Template_input_ngModelChange_41_listener($event) {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.payAmount, $event) || (ctx_r1.payAmount = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(42, "div", 40)(43, "button", 41);
    \u0275\u0275listener("click", function SalesComponent_div_16_Template_button_click_43_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showPayModal = false);
    });
    \u0275\u0275text(44);
    \u0275\u0275pipe(45, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "button", 77);
    \u0275\u0275listener("click", function SalesComponent_div_16_Template_button_click_46_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.confirmPay());
    });
    \u0275\u0275elementStart(47, "span", 19);
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
    \u0275\u0275textInterpolate(ctx_r1.selectedInvoice == null ? null : ctx_r1.selectedInvoice.customerName);
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
var SalesComponent = class _SalesComponent {
  constructor(svc, invSvc, toast) {
    this.svc = svc;
    this.invSvc = invSvc;
    this.toast = toast;
    this.tab = "customers";
    this.customers = [];
    this.invoices = [];
    this.inventoryItems = [];
    this.warehouses = [];
    this.search = "";
    this.invoiceFilter = "";
    this.showCustForm = false;
    this.showInvoiceForm = false;
    this.showPayModal = false;
    this.saving = false;
    this.custForm = {};
    this.invoiceForm = this.freshInvoiceForm();
    this.selectedInvoice = null;
    this.payAmount = 0;
  }
  ngOnInit() {
    this.loadCustomers();
    this.invSvc.getItems({}).subscribe((r) => this.inventoryItems = r.items);
    this.invSvc.getWarehouses().subscribe((w) => this.warehouses = w);
  }
  freshInvoiceForm() {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const due = new Date(Date.now() + 30 * 864e5).toISOString().split("T")[0];
    return { customerId: null, invoiceDate: today, dueDate: due, notes: "", discountAmount: 0, items: [this.freshLine()] };
  }
  freshLine() {
    return { itemId: null, warehouseId: null, quantity: 1, unitPrice: 0, taxRate: 0, discount: 0, _total: 0 };
  }
  openCustomerForm() {
    this.custForm = {};
    this.showCustForm = true;
  }
  editCust(c) {
    this.custForm = __spreadValues({}, c);
    this.showCustForm = true;
  }
  openInvoiceForm() {
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
  onItemSelect(line) {
    const item = this.inventoryItems.find((it) => it.id === line.itemId);
    if (item) {
      line.unitPrice = item.salePrice || 0;
      line.taxRate = item.taxRate || 0;
      this.calcLine(line);
    }
  }
  calcLine(line) {
    const qty = +line.quantity || 0;
    const price = +line.unitPrice || 0;
    const tax = +line.taxRate || 0;
    const disc = +line.discount || 0;
    line._total = qty * price - disc + qty * price * tax / 100;
  }
  getSubTotal() {
    return this.invoiceForm.items.reduce((s, l) => s + (+l.quantity * +l.unitPrice - +l.discount), 0);
  }
  getTax() {
    return this.invoiceForm.items.reduce((s, l) => s + +l.quantity * +l.unitPrice * +l.taxRate / 100, 0);
  }
  getTotal() {
    return this.getSubTotal() + this.getTax() - (+this.invoiceForm.discountAmount || 0);
  }
  loadCustomers() {
    this.svc.getCustomers({ search: this.search }).subscribe((r) => this.customers = r.items);
  }
  loadInvoices() {
    this.svc.getSalesInvoices({}, this.invoiceFilter || void 0).subscribe((r) => this.invoices = r.items);
  }
  saveCust() {
    const obs = this.custForm.id ? this.svc.updateCustomer(this.custForm.id, this.custForm) : this.svc.createCustomer(this.custForm);
    obs.subscribe({ next: () => {
      this.toast.success("Saved");
      this.showCustForm = false;
      this.loadCustomers();
    }, error: () => this.toast.error("Error") });
  }
  saveInvoice() {
    if (!this.invoiceForm.customerId) {
      this.toast.error("Please select a customer");
      return;
    }
    if (!this.invoiceForm.items.some((l) => l.itemId)) {
      this.toast.error("Add at least one item");
      return;
    }
    this.saving = true;
    const payload = __spreadProps(__spreadValues({}, this.invoiceForm), {
      items: this.invoiceForm.items.filter((l) => l.itemId).map((l) => ({
        itemId: l.itemId,
        warehouseId: l.warehouseId,
        quantity: +l.quantity,
        unitPrice: +l.unitPrice,
        taxRate: +l.taxRate,
        discount: +l.discount
      }))
    });
    this.svc.createSalesInvoice(payload).subscribe({
      next: () => {
        this.toast.success("Invoice created");
        this.showInvoiceForm = false;
        this.saving = false;
        this.tab = "invoices";
        this.loadInvoices();
      },
      error: (e) => {
        this.toast.error(e.error?.message || "Error creating invoice");
        this.saving = false;
      }
    });
  }
  confirmPay() {
    if (!this.payAmount || this.payAmount <= 0) {
      this.toast.error("Enter a valid amount");
      return;
    }
    this.svc.paySalesInvoice(this.selectedInvoice.id, this.payAmount).subscribe({
      next: () => {
        this.toast.success("Payment recorded");
        this.showPayModal = false;
        this.loadInvoices();
      },
      error: () => this.toast.error("Payment failed")
    });
  }
  static {
    this.\u0275fac = function SalesComponent_Factory(t) {
      return new (t || _SalesComponent)(\u0275\u0275directiveInject(SalesService), \u0275\u0275directiveInject(InventoryService), \u0275\u0275directiveInject(ToastService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SalesComponent, selectors: [["app-sales"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 17, vars: 22, consts: [[1, "page-header"], [1, "page-title"], [1, "flex", "gap-2"], [1, "btn", 3, "click"], [4, "ngIf"], ["class", "modal-overlay", 3, "click", 4, "ngIf"], [1, "flex", "justify-between", "items-center", "mb-4"], [1, "search-bar"], [1, "material-icons-round", "search-icon"], [1, "form-control", 3, "ngModelChange", "input", "placeholder", "ngModel"], [1, "btn", "btn-primary", "btn-sm", 3, "click"], [1, "material-icons-round"], [1, "card", 2, "padding", "0"], [1, "table-container"], [1, "table"], [4, "ngFor", "ngForOf"], [1, "badge", "badge-primary"], [1, "font-semibold"], [1, "btn", "btn-sm", "btn-secondary", 3, "click"], [1, "material-icons-round", 2, "font-size", "16px"], [1, "filter-bar"], [1, "form-control", 2, "min-width", "160px", 3, "ngModelChange", "change", "ngModel"], ["value", ""], ["value", "Pending"], ["value", "PartiallyPaid"], ["value", "Paid"], [1, "badge", "badge-info"], [1, "text-success"], [1, "badge", 3, "ngClass"], ["class", "btn btn-sm btn-success", 3, "click", 4, "ngIf"], [1, "btn", "btn-sm", "btn-success", 3, "click"], [1, "modal-overlay", 3, "click"], [1, "modal", 3, "click"], [1, "modal-header"], [1, "modal-body"], [1, "form-row"], [1, "form-group"], [1, "form-label"], [1, "form-control", 3, "ngModelChange", "ngModel"], [1, "form-row", "mt-4"], [1, "modal-footer"], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-primary", 3, "click"], [1, "modal", "modal-lg", 3, "click"], [3, "ngValue"], [3, "ngValue", 4, "ngFor", "ngForOf"], ["type", "date", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "form-group", "mt-4"], ["placeholder", "Optional notes...", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "divider"], [1, "inv-lines"], ["class", "inv-line", 4, "ngFor", "ngForOf"], [1, "inv-summary"], [1, "summary-row"], ["type", "number", 1, "form-control", 2, "width", "120px", "text-align", "end", 3, "ngModelChange", "ngModel"], [1, "summary-row", "total"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["class", "spinner spinner-sm", 4, "ngIf"], [1, "inv-line"], [1, "form-group", 2, "flex", "2"], ["class", "form-label", 4, "ngIf"], [1, "form-control", 3, "ngModelChange", "change", "ngModel"], [1, "form-group", 2, "flex", "1.5"], [1, "form-group", 2, "flex", "0.8"], ["type", "number", "min", "1", 1, "form-control", 3, "ngModelChange", "input", "ngModel"], [1, "form-group", 2, "flex", "1"], ["type", "number", 1, "form-control", 3, "ngModelChange", "input", "ngModel"], [1, "form-control", 2, "background", "rgba(255,255,255,0.03)", "color", "var(--success)", "font-weight", "700"], [2, "display", "flex", "align-items", "flex-end", "padding-bottom", "2px"], [1, "btn", "btn-sm", "btn-danger", 3, "click"], [1, "spinner", "spinner-sm"], [1, "modal", 2, "max-width", "420px", 3, "click"], [1, "pay-info-card"], [1, "pay-row"], [1, "text-muted"], [1, "text-danger", "font-semibold"], ["type", "number", "min", "0.01", "placeholder", "Enter amount...", 1, "form-control", 3, "ngModelChange", "ngModel", "max"], [1, "btn", "btn-success", 3, "click"]], template: function SalesComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div")(2, "h1", 1);
        \u0275\u0275text(3);
        \u0275\u0275pipe(4, "translate");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(5, "div", 2)(6, "button", 3);
        \u0275\u0275listener("click", function SalesComponent_Template_button_click_6_listener() {
          return ctx.tab = "customers";
        });
        \u0275\u0275text(7);
        \u0275\u0275pipe(8, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "button", 3);
        \u0275\u0275listener("click", function SalesComponent_Template_button_click_9_listener() {
          ctx.tab = "invoices";
          return ctx.loadInvoices();
        });
        \u0275\u0275text(10);
        \u0275\u0275pipe(11, "translate");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(12, SalesComponent_div_12_Template, 31, 8, "div", 4)(13, SalesComponent_div_13_Template, 41, 2, "div", 4)(14, SalesComponent_div_14_Template, 43, 13, "div", 5)(15, SalesComponent_div_15_Template, 69, 23, "div", 5)(16, SalesComponent_div_16_Template, 50, 16, "div", 5);
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 16, "SALES"));
        \u0275\u0275advance(3);
        \u0275\u0275classProp("btn-primary", ctx.tab === "customers")("btn-secondary", ctx.tab !== "customers");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 18, "CUSTOMERS"));
        \u0275\u0275advance(2);
        \u0275\u0275classProp("btn-primary", ctx.tab === "invoices")("btn-secondary", ctx.tab !== "invoices");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 20, "SALES_INVOICES"));
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.tab === "customers");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.tab === "invoices");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showCustForm);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showInvoiceForm);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showPayModal);
      }
    }, dependencies: [CommonModule, NgClass, NgForOf, NgIf, CurrencyPipe, DatePipe, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, MinValidator, MaxValidator, NgModel, TranslateModule, TranslatePipe], styles: ["\n\n.inv-lines[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.inv-line[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: flex-start;\n}\n.inv-line[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.inv-summary[_ngcontent-%COMP%] {\n  margin-top: 20px;\n  border-top: 1px solid var(--border);\n  padding-top: 16px;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 8px;\n}\n.summary-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  font-size: 0.9rem;\n}\n.summary-row[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:first-child {\n  color: var(--text-secondary);\n  min-width: 80px;\n  text-align: end;\n}\n.summary-row.total[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  font-weight: 700;\n  color: var(--primary-light);\n  border-top: 1px solid var(--border);\n  padding-top: 8px;\n  margin-top: 4px;\n}\n.pay-info-card[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.03);\n  border-radius: 12px;\n  padding: 16px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.pay-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  font-size: 0.9rem;\n}\n/*# sourceMappingURL=sales.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SalesComponent, { className: "SalesComponent", filePath: "src\\app\\features\\sales\\sales.component.ts", lineNumber: 202 });
})();
export {
  SalesComponent
};
//# sourceMappingURL=chunk-CMQQJJL7.js.map
