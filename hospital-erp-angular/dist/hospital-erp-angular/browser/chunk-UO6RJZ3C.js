import {
  DefaultValueAccessor,
  FormsModule,
  MaxValidator,
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
  InvoiceService,
  PatientService,
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
  ɵɵpropertyInterpolate,
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

// src/app/features/invoices/invoices.component.ts
function InvoicesComponent_div_37_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22);
    \u0275\u0275element(1, "div", 23);
    \u0275\u0275elementEnd();
  }
}
function InvoicesComponent_div_38_tr_26_button_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 37);
    \u0275\u0275listener("click", function InvoicesComponent_div_38_tr_26_button_26_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const inv_r3 = \u0275\u0275nextContext().$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.openPaymentForm(inv_r3));
    });
    \u0275\u0275elementStart(1, "span", 36);
    \u0275\u0275text(2, "payments");
    \u0275\u0275elementEnd()();
  }
}
function InvoicesComponent_div_38_tr_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 28);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 29);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td", 30);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td", 31);
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td")(21, "span", 32);
    \u0275\u0275text(22);
    \u0275\u0275pipe(23, "translate");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "td")(25, "div", 33);
    \u0275\u0275template(26, InvoicesComponent_div_38_tr_26_button_26_Template, 3, 0, "button", 34);
    \u0275\u0275elementStart(27, "button", 35);
    \u0275\u0275listener("click", function InvoicesComponent_div_38_tr_26_Template_button_click_27_listener() {
      const inv_r3 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.deleteInvoice(inv_r3));
    });
    \u0275\u0275elementStart(28, "span", 36);
    \u0275\u0275text(29, "delete");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const inv_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(inv_r3.invoiceNumber);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(inv_r3.patientName || inv_r3.customerName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(inv_r3.invoiceType);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(10, 10, inv_r3.invoiceDate, "mediumDate"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(13, 13, inv_r3.totalAmount));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(16, 15, inv_r3.paidAmount));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(19, 17, inv_r3.balanceDue));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", ctx_r3.getStatusClass(inv_r3.status));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(23, 19, inv_r3.status));
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", inv_r3.balanceDue > 0);
  }
}
function InvoicesComponent_div_38_tr_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 38)(2, "div", 39)(3, "span", 40);
    \u0275\u0275text(4, "receipt_long");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 41);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "translate");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(7, 1, "NO_DATA"));
  }
}
function InvoicesComponent_div_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24)(1, "table", 25)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "th");
    \u0275\u0275text(8, "Client");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "th");
    \u0275\u0275text(10, "Type");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "th");
    \u0275\u0275text(12, "Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "th");
    \u0275\u0275text(14, "Total");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "th");
    \u0275\u0275text(16, "Paid");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th");
    \u0275\u0275text(18, "Balance");
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
    \u0275\u0275template(26, InvoicesComponent_div_38_tr_26_Template, 30, 21, "tr", 26)(27, InvoicesComponent_div_38_tr_27_Template, 8, 3, "tr", 27);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 5, "INVOICE_NUM"));
    \u0275\u0275advance(15);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(21, 7, "STATUS"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(24, 9, "ACTIONS"));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r3.invoices);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r3.invoices.length === 0);
  }
}
function InvoicesComponent_div_39_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 42)(1, "span", 43);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 44)(4, "button", 45);
    \u0275\u0275listener("click", function InvoicesComponent_div_39_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext();
      ctx_r3.page = ctx_r3.page - 1;
      return \u0275\u0275resetView(ctx_r3.loadData());
    });
    \u0275\u0275elementStart(5, "span", 3);
    \u0275\u0275text(6, "chevron_left");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 45);
    \u0275\u0275listener("click", function InvoicesComponent_div_39_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext();
      ctx_r3.page = ctx_r3.page + 1;
      return \u0275\u0275resetView(ctx_r3.loadData());
    });
    \u0275\u0275elementStart(8, "span", 3);
    \u0275\u0275text(9, "chevron_right");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("Page ", ctx_r3.page, " of ", ctx_r3.totalPages, "");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r3.page <= 1);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r3.page >= ctx_r3.totalPages);
  }
}
function InvoicesComponent_div_40_div_19_option_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 80);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r8 = ctx.$implicit;
    \u0275\u0275property("value", p_r8.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", p_r8.fullName, " (", p_r8.patientCode, ")");
  }
}
function InvoicesComponent_div_40_div_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 53)(1, "label", 54);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "select", 78);
    \u0275\u0275twoWayListener("ngModelChange", function InvoicesComponent_div_40_div_19_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r3 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r3.form.patientId, $event) || (ctx_r3.form.patientId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275template(5, InvoicesComponent_div_40_div_19_option_5_Template, 2, 3, "option", 79);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind1(3, 3, "PATIENT"), " *");
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.form.patientId);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r3.patientsList);
  }
}
function InvoicesComponent_div_40_div_20_option_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 80);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r10 = ctx.$implicit;
    \u0275\u0275property("value", c_r10.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r10.customerName);
  }
}
function InvoicesComponent_div_40_div_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 53)(1, "label", 54);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "select", 78);
    \u0275\u0275twoWayListener("ngModelChange", function InvoicesComponent_div_40_div_20_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r3 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r3.form.customerId, $event) || (ctx_r3.form.customerId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275template(5, InvoicesComponent_div_40_div_20_option_5_Template, 2, 2, "option", 79);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind1(3, 3, "CUSTOMER"), " *");
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.form.customerId);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r3.customersList);
  }
}
function InvoicesComponent_div_40_tr_53_option_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 80);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const invItem_r13 = ctx.$implicit;
    \u0275\u0275property("value", invItem_r13.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(invItem_r13.itemName);
  }
}
function InvoicesComponent_div_40_tr_53_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "select", 81);
    \u0275\u0275twoWayListener("ngModelChange", function InvoicesComponent_div_40_tr_53_Template_select_ngModelChange_2_listener($event) {
      const item_r12 = \u0275\u0275restoreView(_r11).$implicit;
      \u0275\u0275twoWayBindingSet(item_r12.itemId, $event) || (item_r12.itemId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function InvoicesComponent_div_40_tr_53_Template_select_change_2_listener() {
      const item_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.onItemChange(item_r12));
    });
    \u0275\u0275elementStart(3, "option", 82);
    \u0275\u0275text(4, "Custom Item");
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, InvoicesComponent_div_40_tr_53_option_5_Template, 2, 2, "option", 79);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "td")(7, "input", 83);
    \u0275\u0275twoWayListener("ngModelChange", function InvoicesComponent_div_40_tr_53_Template_input_ngModelChange_7_listener($event) {
      const item_r12 = \u0275\u0275restoreView(_r11).$implicit;
      \u0275\u0275twoWayBindingSet(item_r12.description, $event) || (item_r12.description = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "td")(9, "input", 84);
    \u0275\u0275twoWayListener("ngModelChange", function InvoicesComponent_div_40_tr_53_Template_input_ngModelChange_9_listener($event) {
      const item_r12 = \u0275\u0275restoreView(_r11).$implicit;
      \u0275\u0275twoWayBindingSet(item_r12.quantity, $event) || (item_r12.quantity = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function InvoicesComponent_div_40_tr_53_Template_input_ngModelChange_9_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.calculateFormTotals());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td")(11, "input", 84);
    \u0275\u0275twoWayListener("ngModelChange", function InvoicesComponent_div_40_tr_53_Template_input_ngModelChange_11_listener($event) {
      const item_r12 = \u0275\u0275restoreView(_r11).$implicit;
      \u0275\u0275twoWayBindingSet(item_r12.unitPrice, $event) || (item_r12.unitPrice = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function InvoicesComponent_div_40_tr_53_Template_input_ngModelChange_11_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.calculateFormTotals());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td")(13, "input", 84);
    \u0275\u0275twoWayListener("ngModelChange", function InvoicesComponent_div_40_tr_53_Template_input_ngModelChange_13_listener($event) {
      const item_r12 = \u0275\u0275restoreView(_r11).$implicit;
      \u0275\u0275twoWayBindingSet(item_r12.taxRate, $event) || (item_r12.taxRate = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function InvoicesComponent_div_40_tr_53_Template_input_ngModelChange_13_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.calculateFormTotals());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "td")(15, "input", 84);
    \u0275\u0275twoWayListener("ngModelChange", function InvoicesComponent_div_40_tr_53_Template_input_ngModelChange_15_listener($event) {
      const item_r12 = \u0275\u0275restoreView(_r11).$implicit;
      \u0275\u0275twoWayBindingSet(item_r12.discount, $event) || (item_r12.discount = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function InvoicesComponent_div_40_tr_53_Template_input_ngModelChange_15_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.calculateFormTotals());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "td", 29);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "td")(20, "button", 85);
    \u0275\u0275listener("click", function InvoicesComponent_div_40_tr_53_Template_button_click_20_listener() {
      const i_r14 = \u0275\u0275restoreView(_r11).index;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.removeItem(i_r14));
    });
    \u0275\u0275elementStart(21, "span", 86);
    \u0275\u0275text(22, "close");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const item_r12 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", item_r12.itemId);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r3.itemsList);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", item_r12.description);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", item_r12.quantity);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", item_r12.unitPrice);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", item_r12.taxRate);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", item_r12.discount);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(18, 9, (item_r12.quantity * item_r12.unitPrice - item_r12.discount) * (1 + item_r12.taxRate / 100)));
  }
}
function InvoicesComponent_div_40_span_92_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 87);
  }
}
function InvoicesComponent_div_40_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 46);
    \u0275\u0275listener("click", function InvoicesComponent_div_40_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.showForm = false);
    });
    \u0275\u0275elementStart(1, "div", 47);
    \u0275\u0275listener("click", function InvoicesComponent_div_40_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r6);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 48)(3, "h3", 49);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 50);
    \u0275\u0275listener("click", function InvoicesComponent_div_40_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.showForm = false);
    });
    \u0275\u0275elementStart(7, "span", 3);
    \u0275\u0275text(8, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 51)(10, "div", 52)(11, "div", 53)(12, "label", 54);
    \u0275\u0275text(13, "Type *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "select", 55);
    \u0275\u0275twoWayListener("ngModelChange", function InvoicesComponent_div_40_Template_select_ngModelChange_14_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.form.invoiceType, $event) || (ctx_r3.form.invoiceType = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function InvoicesComponent_div_40_Template_select_change_14_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r3 = \u0275\u0275nextContext();
      ctx_r3.form.patientId = null;
      return \u0275\u0275resetView(ctx_r3.form.customerId = null);
    });
    \u0275\u0275elementStart(15, "option", 15);
    \u0275\u0275text(16, "Patient");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "option", 16);
    \u0275\u0275text(18, "Customer");
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(19, InvoicesComponent_div_40_div_19_Template, 6, 5, "div", 56)(20, InvoicesComponent_div_40_div_20_Template, 6, 5, "div", 56);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div", 57)(22, "div", 53)(23, "label", 54);
    \u0275\u0275text(24, "Date *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "input", 58);
    \u0275\u0275twoWayListener("ngModelChange", function InvoicesComponent_div_40_Template_input_ngModelChange_25_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.form.invoiceDate, $event) || (ctx_r3.form.invoiceDate = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "div", 53)(27, "label", 54);
    \u0275\u0275text(28, "Due Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "input", 58);
    \u0275\u0275twoWayListener("ngModelChange", function InvoicesComponent_div_40_Template_input_ngModelChange_29_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.form.dueDate, $event) || (ctx_r3.form.dueDate = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(30, "div", 59)(31, "h4", 60);
    \u0275\u0275text(32, "Items");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "div", 24)(34, "table", 25)(35, "thead")(36, "tr")(37, "th");
    \u0275\u0275text(38, "Item");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "th");
    \u0275\u0275text(40, "Description");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "th", 61);
    \u0275\u0275text(42, "Qty");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(43, "th", 62);
    \u0275\u0275text(44, "Price");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "th", 61);
    \u0275\u0275text(46, "Tax (%)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "th", 61);
    \u0275\u0275text(48, "Disc");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "th", 62);
    \u0275\u0275text(50, "Total");
    \u0275\u0275elementEnd();
    \u0275\u0275element(51, "th", 63);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(52, "tbody");
    \u0275\u0275template(53, InvoicesComponent_div_40_tr_53_Template, 23, 11, "tr", 26);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(54, "button", 64);
    \u0275\u0275listener("click", function InvoicesComponent_div_40_Template_button_click_54_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.addItem());
    });
    \u0275\u0275text(55, "+ Add Item");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(56, "div", 65)(57, "div", 66)(58, "div", 67)(59, "span");
    \u0275\u0275text(60, "Subtotal:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "span", 29);
    \u0275\u0275text(62);
    \u0275\u0275pipe(63, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(64, "div", 67)(65, "span");
    \u0275\u0275text(66, "Total Tax:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(67, "span", 29);
    \u0275\u0275text(68);
    \u0275\u0275pipe(69, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(70, "div", 67)(71, "span");
    \u0275\u0275text(72, "Total Discount:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(73, "span", 68);
    \u0275\u0275text(74);
    \u0275\u0275pipe(75, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(76, "div", 69)(77, "span", 70);
    \u0275\u0275text(78, "Total Amount:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(79, "span", 71);
    \u0275\u0275text(80);
    \u0275\u0275pipe(81, "currency");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(82, "div", 72)(83, "label", 54);
    \u0275\u0275text(84);
    \u0275\u0275pipe(85, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(86, "textarea", 73);
    \u0275\u0275twoWayListener("ngModelChange", function InvoicesComponent_div_40_Template_textarea_ngModelChange_86_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.form.notes, $event) || (ctx_r3.form.notes = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(87, "div", 74)(88, "button", 75);
    \u0275\u0275listener("click", function InvoicesComponent_div_40_Template_button_click_88_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.showForm = false);
    });
    \u0275\u0275text(89);
    \u0275\u0275pipe(90, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(91, "button", 76);
    \u0275\u0275listener("click", function InvoicesComponent_div_40_Template_button_click_91_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.save());
    });
    \u0275\u0275template(92, InvoicesComponent_div_40_span_92_Template, 1, 0, "span", 77);
    \u0275\u0275text(93);
    \u0275\u0275pipe(94, "translate");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 17, "ADD_NEW_INVOICE"));
    \u0275\u0275advance(10);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.form.invoiceType);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r3.form.invoiceType === "Patient");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r3.form.invoiceType === "Customer");
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.form.invoiceDate);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.form.dueDate);
    \u0275\u0275advance(24);
    \u0275\u0275property("ngForOf", ctx_r3.form.items);
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(63, 19, ctx_r3.calculation.subTotal));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(69, 21, ctx_r3.calculation.taxTotal));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("-", \u0275\u0275pipeBind1(75, 23, ctx_r3.calculation.discountTotal), "");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(81, 25, ctx_r3.calculation.grandTotal));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(85, 27, "NOTES"));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.form.notes);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(90, 29, "CANCEL"));
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r3.saving || !ctx_r3.isValid());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r3.saving);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(94, 31, "SAVE"), "");
  }
}
function InvoicesComponent_div_41_span_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 87);
  }
}
function InvoicesComponent_div_41_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 46);
    \u0275\u0275listener("click", function InvoicesComponent_div_41_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.showPaymentForm = false);
    });
    \u0275\u0275elementStart(1, "div", 88);
    \u0275\u0275listener("click", function InvoicesComponent_div_41_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r15);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 48)(3, "h3", 49);
    \u0275\u0275text(4, "Record Payment");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 50);
    \u0275\u0275listener("click", function InvoicesComponent_div_41_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.showPaymentForm = false);
    });
    \u0275\u0275elementStart(6, "span", 3);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 51)(9, "div", 89)(10, "div", 90);
    \u0275\u0275text(11, "Invoice Balance Due");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 91);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "currency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 53)(16, "label", 54);
    \u0275\u0275text(17, "Payment Amount *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "input", 92);
    \u0275\u0275twoWayListener("ngModelChange", function InvoicesComponent_div_41_Template_input_ngModelChange_18_listener($event) {
      \u0275\u0275restoreView(_r15);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.paymentForm.amount, $event) || (ctx_r3.paymentForm.amount = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 72)(20, "label", 54);
    \u0275\u0275text(21, "Payment Method *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "select", 78);
    \u0275\u0275twoWayListener("ngModelChange", function InvoicesComponent_div_41_Template_select_ngModelChange_22_listener($event) {
      \u0275\u0275restoreView(_r15);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.paymentForm.paymentMethod, $event) || (ctx_r3.paymentForm.paymentMethod = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(23, "option", 93);
    \u0275\u0275text(24, "Cash");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "option", 94);
    \u0275\u0275text(26, "Credit Card");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "option", 95);
    \u0275\u0275text(28, "Bank Transfer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "option", 96);
    \u0275\u0275text(30, "Cheque");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(31, "div", 72)(32, "label", 54);
    \u0275\u0275text(33, "Reference Number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "input", 78);
    \u0275\u0275twoWayListener("ngModelChange", function InvoicesComponent_div_41_Template_input_ngModelChange_34_listener($event) {
      \u0275\u0275restoreView(_r15);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.paymentForm.referenceNumber, $event) || (ctx_r3.paymentForm.referenceNumber = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(35, "div", 74)(36, "button", 75);
    \u0275\u0275listener("click", function InvoicesComponent_div_41_Template_button_click_36_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.showPaymentForm = false);
    });
    \u0275\u0275text(37);
    \u0275\u0275pipe(38, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "button", 97);
    \u0275\u0275listener("click", function InvoicesComponent_div_41_Template_button_click_39_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.savePayment());
    });
    \u0275\u0275template(40, InvoicesComponent_div_41_span_40_Template, 1, 0, "span", 77);
    \u0275\u0275text(41, " Record Payment");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(13);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(14, 8, ctx_r3.paymentForm.maxAmount));
    \u0275\u0275advance(5);
    \u0275\u0275propertyInterpolate("max", ctx_r3.paymentForm.maxAmount);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.paymentForm.amount);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.paymentForm.paymentMethod);
    \u0275\u0275advance(12);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.paymentForm.referenceNumber);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(38, 10, "CANCEL"));
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r3.savingPayment || ctx_r3.paymentForm.amount <= 0 || ctx_r3.paymentForm.amount > ctx_r3.paymentForm.maxAmount);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r3.savingPayment);
  }
}
var InvoicesComponent = class _InvoicesComponent {
  constructor(svc, patientSvc, salesSvc, inventorySvc, toast) {
    this.svc = svc;
    this.patientSvc = patientSvc;
    this.salesSvc = salesSvc;
    this.inventorySvc = inventorySvc;
    this.toast = toast;
    this.invoices = [];
    this.loading = true;
    this.search = "";
    this.statusFilter = "";
    this.typeFilter = "";
    this.page = 1;
    this.totalPages = 1;
    this.showForm = false;
    this.saving = false;
    this.form = {};
    this.showPaymentForm = false;
    this.savingPayment = false;
    this.paymentForm = {};
    this.patientsList = [];
    this.customersList = [];
    this.itemsList = [];
    this.calculation = { subTotal: 0, taxTotal: 0, discountTotal: 0, grandTotal: 0 };
  }
  ngOnInit() {
    this.loadData();
    this.loadLookups();
  }
  loadData() {
    this.loading = true;
    this.svc.getAll({ page: this.page, pageSize: 20, search: this.search }, this.statusFilter, this.typeFilter).subscribe({
      next: (r) => {
        this.invoices = r.items;
        this.totalPages = r.totalPages;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
  loadLookups() {
    this.patientSvc.getAll({ pageSize: 500 }).subscribe((r) => this.patientsList = r.items);
    this.salesSvc.getCustomers({ pageSize: 500 }).subscribe((r) => this.customersList = r.items);
    this.inventorySvc.getItems({ pageSize: 500 }).subscribe((r) => this.itemsList = r.items);
  }
  openForm() {
    this.form = {
      invoiceType: "Patient",
      invoiceDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      dueDate: "",
      patientId: null,
      customerId: null,
      items: [],
      notes: ""
    };
    this.addItem();
    this.calculateFormTotals();
    this.showForm = true;
  }
  addItem() {
    this.form.items.push({ itemId: null, description: "", quantity: 1, unitPrice: 0, taxRate: 0, discount: 0 });
  }
  removeItem(i) {
    this.form.items.splice(i, 1);
    this.calculateFormTotals();
  }
  onItemChange(itemRef) {
    if (itemRef.itemId) {
      const found = this.itemsList.find((x) => x.id === itemRef.itemId);
      if (found) {
        itemRef.description = found.itemName;
        itemRef.unitPrice = found.salePrice;
        itemRef.taxRate = found.taxRate;
        this.calculateFormTotals();
      }
    }
  }
  calculateFormTotals() {
    let sub = 0;
    let tax = 0;
    let disc = 0;
    this.form.items.forEach((i) => {
      const lineGross = i.quantity * i.unitPrice;
      const lineDisc = i.discount || 0;
      const lineNet = lineGross - lineDisc;
      const lineTax = lineNet * (i.taxRate / 100);
      sub += lineGross;
      disc += lineDisc;
      tax += lineTax;
    });
    this.calculation = {
      subTotal: sub,
      discountTotal: disc,
      taxTotal: tax,
      grandTotal: sub - disc + tax
    };
  }
  isValid() {
    if (this.form.invoiceType === "Patient" && !this.form.patientId)
      return false;
    if (this.form.invoiceType === "Customer" && !this.form.customerId)
      return false;
    if (!this.form.invoiceDate || this.form.items.length === 0)
      return false;
    return true;
  }
  save() {
    if (!this.isValid())
      return;
    this.saving = true;
    const data = __spreadProps(__spreadValues({}, this.form), {
      taxAmount: this.calculation.taxTotal,
      discountAmount: this.calculation.discountTotal
    });
    this.svc.create(data).subscribe({
      next: () => {
        this.toast.success("Invoice created");
        this.showForm = false;
        this.saving = false;
        this.loadData();
      },
      error: () => {
        this.toast.error("Error creating invoice");
        this.saving = false;
      }
    });
  }
  deleteInvoice(inv) {
    if (confirm("Are you sure you want to delete this invoice?")) {
      this.svc.delete(inv.id).subscribe({
        next: () => {
          this.toast.success("Deleted successfully");
          this.loadData();
        },
        error: () => this.toast.error("Could not delete invoice")
      });
    }
  }
  openPaymentForm(inv) {
    this.paymentForm = {
      invoiceId: inv.id,
      patientId: inv.patientId,
      amount: inv.balanceDue,
      maxAmount: inv.balanceDue,
      paymentMethod: "Cash",
      referenceNumber: ""
    };
    this.showPaymentForm = true;
  }
  savePayment() {
    this.savingPayment = true;
    this.svc.recordPayment(this.paymentForm).subscribe({
      next: () => {
        this.toast.success("Payment recorded");
        this.showPaymentForm = false;
        this.savingPayment = false;
        this.loadData();
      },
      error: () => {
        this.toast.error("Error recording payment");
        this.savingPayment = false;
      }
    });
  }
  getStatusClass(s) {
    switch (s) {
      case "Draft":
        return "badge-secondary";
      case "Unpaid":
        return "badge-warning";
      case "PartiallyPaid":
        return "badge-info";
      case "Paid":
        return "badge-success";
      case "Cancelled":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  }
  static {
    this.\u0275fac = function InvoicesComponent_Factory(t) {
      return new (t || _InvoicesComponent)(\u0275\u0275directiveInject(InvoiceService), \u0275\u0275directiveInject(PatientService), \u0275\u0275directiveInject(SalesService), \u0275\u0275directiveInject(InventoryService), \u0275\u0275directiveInject(ToastService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _InvoicesComponent, selectors: [["app-invoices"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 42, vars: 17, consts: [[1, "page-header"], [1, "page-title"], [1, "btn", "btn-primary", 3, "click"], [1, "material-icons-round"], [1, "filter-bar", "mb-4"], [1, "search-bar"], [1, "material-icons-round", "search-icon"], [1, "form-control", 3, "ngModelChange", "input", "placeholder", "ngModel"], [1, "form-control", 2, "width", "auto", 3, "ngModelChange", "change", "ngModel"], ["value", ""], ["value", "Draft"], ["value", "Unpaid"], ["value", "PartiallyPaid"], ["value", "Paid"], ["value", "Cancelled"], ["value", "Patient"], ["value", "Customer"], [1, "card", 2, "padding", "0"], ["class", "loading-container", 4, "ngIf"], ["class", "table-container", 4, "ngIf"], ["class", "pagination", 4, "ngIf"], ["class", "modal-overlay", 3, "click", 4, "ngIf"], [1, "loading-container"], [1, "spinner"], [1, "table-container"], [1, "table"], [4, "ngFor", "ngForOf"], [4, "ngIf"], [1, "badge", "badge-info"], [1, "font-semibold"], [1, "text-success"], [1, "text-danger"], [1, "badge", 3, "ngClass"], [1, "flex", "gap-1"], ["class", "btn btn-sm btn-primary", "title", "Record Payment", 3, "click", 4, "ngIf"], [1, "btn", "btn-sm", "btn-danger", 3, "click"], [1, "material-icons-round", 2, "font-size", "16px"], ["title", "Record Payment", 1, "btn", "btn-sm", "btn-primary", 3, "click"], ["colspan", "9"], [1, "empty-state"], [1, "material-icons-round", "empty-icon"], [1, "empty-title"], [1, "pagination"], [1, "pagination-info"], [1, "pagination-buttons"], [1, "page-btn", 3, "click", "disabled"], [1, "modal-overlay", 3, "click"], [1, "modal", "modal-xl", 3, "click"], [1, "modal-header"], [1, "modal-title"], [1, "btn", "btn-sm", "btn-secondary", 3, "click"], [1, "modal-body"], [1, "form-row"], [1, "form-group"], [1, "form-label"], [1, "form-control", 3, "ngModelChange", "change", "ngModel"], ["class", "form-group", 4, "ngIf"], [1, "form-row", "mt-4"], ["type", "date", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "mt-4"], [1, "font-semibold", "mb-2"], [2, "width", "100px"], [2, "width", "120px"], [2, "width", "50px"], [1, "btn", "btn-sm", "btn-secondary", "mt-2", 3, "click"], [1, "flex", "mt-4", 2, "justify-content", "flex-end"], [2, "width", "300px"], [1, "flex", "mb-2", 2, "justify-content", "space-between"], [1, "font-semibold", "text-danger"], [1, "flex", "mb-2", "border-t", "pt-2", "mt-2", 2, "justify-content", "space-between"], [1, "font-semibold", "text-lg"], [1, "font-semibold", "text-lg", "text-primary"], [1, "form-group", "mt-4"], ["rows", "2", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "modal-footer"], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["class", "spinner spinner-sm", 4, "ngIf"], [1, "form-control", 3, "ngModelChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], [3, "value"], [1, "form-control", "form-control-sm", 3, "ngModelChange", "change", "ngModel"], [3, "ngValue"], [1, "form-control", "form-control-sm", 3, "ngModelChange", "ngModel"], ["type", "number", 1, "form-control", "form-control-sm", 3, "ngModelChange", "ngModel"], [1, "btn-icon", "text-danger", 3, "click"], [1, "material-icons-round", 2, "font-size", "18px"], [1, "spinner", "spinner-sm"], [1, "modal", 3, "click"], [1, "mb-4"], [1, "text-sm", "text-muted"], [1, "text-2xl", "font-semibold", "text-danger"], ["type", "number", 1, "form-control", 3, "ngModelChange", "ngModel", "max"], ["value", "Cash"], ["value", "Credit Card"], ["value", "Bank Transfer"], ["value", "Cheque"], [1, "btn", "btn-success", 3, "click", "disabled"]], template: function InvoicesComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div")(2, "h1", 1);
        \u0275\u0275text(3);
        \u0275\u0275pipe(4, "translate");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(5, "button", 2);
        \u0275\u0275listener("click", function InvoicesComponent_Template_button_click_5_listener() {
          return ctx.openForm();
        });
        \u0275\u0275elementStart(6, "span", 3);
        \u0275\u0275text(7, "add");
        \u0275\u0275elementEnd();
        \u0275\u0275text(8);
        \u0275\u0275pipe(9, "translate");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(10, "div", 4)(11, "div", 5)(12, "span", 6);
        \u0275\u0275text(13, "search");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(14, "input", 7);
        \u0275\u0275pipe(15, "translate");
        \u0275\u0275twoWayListener("ngModelChange", function InvoicesComponent_Template_input_ngModelChange_14_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.search, $event) || (ctx.search = $event);
          return $event;
        });
        \u0275\u0275listener("input", function InvoicesComponent_Template_input_input_14_listener() {
          return ctx.loadData();
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(16, "select", 8);
        \u0275\u0275twoWayListener("ngModelChange", function InvoicesComponent_Template_select_ngModelChange_16_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.statusFilter, $event) || (ctx.statusFilter = $event);
          return $event;
        });
        \u0275\u0275listener("change", function InvoicesComponent_Template_select_change_16_listener() {
          return ctx.loadData();
        });
        \u0275\u0275elementStart(17, "option", 9);
        \u0275\u0275text(18, "All Status");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "option", 10);
        \u0275\u0275text(20, "Draft");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(21, "option", 11);
        \u0275\u0275text(22, "Unpaid");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "option", 12);
        \u0275\u0275text(24, "Partially Paid");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(25, "option", 13);
        \u0275\u0275text(26, "Paid");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(27, "option", 14);
        \u0275\u0275text(28, "Cancelled");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(29, "select", 8);
        \u0275\u0275twoWayListener("ngModelChange", function InvoicesComponent_Template_select_ngModelChange_29_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.typeFilter, $event) || (ctx.typeFilter = $event);
          return $event;
        });
        \u0275\u0275listener("change", function InvoicesComponent_Template_select_change_29_listener() {
          return ctx.loadData();
        });
        \u0275\u0275elementStart(30, "option", 9);
        \u0275\u0275text(31, "All Types");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(32, "option", 15);
        \u0275\u0275text(33, "Patient");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(34, "option", 16);
        \u0275\u0275text(35, "Customer");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(36, "div", 17);
        \u0275\u0275template(37, InvoicesComponent_div_37_Template, 2, 0, "div", 18)(38, InvoicesComponent_div_38_Template, 28, 11, "div", 19)(39, InvoicesComponent_div_39_Template, 10, 4, "div", 20);
        \u0275\u0275elementEnd();
        \u0275\u0275template(40, InvoicesComponent_div_40_Template, 95, 33, "div", 21)(41, InvoicesComponent_div_41_Template, 42, 12, "div", 21);
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 11, "INVOICES"));
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(9, 13, "ADD_NEW"), "");
        \u0275\u0275advance(6);
        \u0275\u0275property("placeholder", \u0275\u0275pipeBind1(15, 15, "SEARCH"));
        \u0275\u0275twoWayProperty("ngModel", ctx.search);
        \u0275\u0275advance(2);
        \u0275\u0275twoWayProperty("ngModel", ctx.statusFilter);
        \u0275\u0275advance(13);
        \u0275\u0275twoWayProperty("ngModel", ctx.typeFilter);
        \u0275\u0275advance(8);
        \u0275\u0275property("ngIf", ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.totalPages > 1);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showForm);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showPaymentForm);
      }
    }, dependencies: [CommonModule, NgClass, NgForOf, NgIf, CurrencyPipe, DatePipe, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, MaxValidator, NgModel, TranslateModule, TranslatePipe], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(InvoicesComponent, { className: "InvoicesComponent", filePath: "src\\app\\features\\invoices\\invoices.component.ts", lineNumber: 204 });
})();
export {
  InvoicesComponent
};
//# sourceMappingURL=chunk-UO6RJZ3C.js.map
