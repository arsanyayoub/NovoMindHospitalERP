import {
  DefaultValueAccessor,
  FormsModule,
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
  AccountingService
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
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
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

// src/app/features/accounting/accounting.component.ts
function AccountingComponent_div_15_tr_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 13);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 14);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td")(9, "span", 15);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "currency");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const a_r3 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(a_r3.accountCode);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(a_r3.accountName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(a_r3.accountNameAr);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(a_r3.accountType);
    \u0275\u0275advance();
    \u0275\u0275classProp("text-success", a_r3.balance >= 0)("text-danger", a_r3.balance < 0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(13, 9, a_r3.balance));
  }
}
function AccountingComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 6)(2, "h3");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 7);
    \u0275\u0275listener("click", function AccountingComponent_div_15_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showAccForm = true);
    });
    \u0275\u0275elementStart(6, "span", 8);
    \u0275\u0275text(7, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "translate");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 9)(11, "div", 10)(12, "table", 11)(13, "thead")(14, "tr")(15, "th");
    \u0275\u0275text(16, "Code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th");
    \u0275\u0275text(18, "Account Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th");
    \u0275\u0275text(20, "Arabic Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "th");
    \u0275\u0275text(22, "Type");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "th");
    \u0275\u0275text(24, "Balance");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(25, "tbody");
    \u0275\u0275template(26, AccountingComponent_div_15_tr_26_Template, 14, 11, "tr", 12);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, "CHART_OF_ACCOUNTS"));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(9, 5, "ADD_NEW"), "");
    \u0275\u0275advance(18);
    \u0275\u0275property("ngForOf", ctx_r1.accounts);
  }
}
function AccountingComponent_div_16_tr_30_button_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 19);
    \u0275\u0275listener("click", function AccountingComponent_div_16_tr_30_button_19_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const je_r6 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.postEntry(je_r6.id));
    });
    \u0275\u0275text(1, "Post");
    \u0275\u0275elementEnd();
  }
}
function AccountingComponent_div_16_tr_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 16);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td");
    \u0275\u0275text(5);
    \u0275\u0275pipe(6, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "td");
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "td")(16, "span", 17);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "td");
    \u0275\u0275template(19, AccountingComponent_div_16_tr_30_button_19_Template, 2, 0, "button", 18);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const je_r6 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(je_r6.entryNumber);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(6, 8, je_r6.entryDate, "mediumDate"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(je_r6.description);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 11, je_r6.totalDebit));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(14, 13, je_r6.totalCredit));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", je_r6.status === "Posted" ? "badge-success" : "badge-warning");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(je_r6.status);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", je_r6.status === "Draft");
  }
}
function AccountingComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 6)(2, "h3");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 7);
    \u0275\u0275listener("click", function AccountingComponent_div_16_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.showJeForm = true;
      return \u0275\u0275resetView(ctx_r1.initJeForm());
    });
    \u0275\u0275elementStart(6, "span", 8);
    \u0275\u0275text(7, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "translate");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 9)(11, "div", 10)(12, "table", 11)(13, "thead")(14, "tr")(15, "th");
    \u0275\u0275text(16, "#");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th");
    \u0275\u0275text(18, "Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th");
    \u0275\u0275text(20, "Description");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "th");
    \u0275\u0275text(22, "Debit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "th");
    \u0275\u0275text(24, "Credit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "th");
    \u0275\u0275text(26, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "th");
    \u0275\u0275text(28, "Actions");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(29, "tbody");
    \u0275\u0275template(30, AccountingComponent_div_16_tr_30_Template, 20, 15, "tr", 12);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 3, "JOURNAL_ENTRIES"));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(9, 5, "ADD_NEW"), "");
    \u0275\u0275advance(22);
    \u0275\u0275property("ngForOf", ctx_r1.journalEntries);
  }
}
function AccountingComponent_div_17_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25)(1, "div", 26)(2, "div", 27)(3, "span", 8);
    \u0275\u0275text(4, "trending_up");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div")(6, "div", 28);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 29);
    \u0275\u0275text(10, "Total Revenue");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "div", 26)(12, "div", 30)(13, "span", 8);
    \u0275\u0275text(14, "trending_down");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div")(16, "div", 28);
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 29);
    \u0275\u0275text(20, "Total Expenses");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "div", 26)(22, "div", 31)(23, "span", 8);
    \u0275\u0275text(24, "account_balance");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div")(26, "div", 28);
    \u0275\u0275text(27);
    \u0275\u0275pipe(28, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "div", 29);
    \u0275\u0275text(30, "Net Income");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(31, "div", 26)(32, "div", 32)(33, "span", 8);
    \u0275\u0275text(34, "savings");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div")(36, "div", 28);
    \u0275\u0275text(37);
    \u0275\u0275pipe(38, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "div", 29);
    \u0275\u0275text(40, "Total Assets");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 4, ctx_r1.report.totalRevenue));
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(18, 6, ctx_r1.report.totalExpenses));
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(28, 8, ctx_r1.report.netIncome));
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(38, 10, ctx_r1.report.totalAssets));
  }
}
function AccountingComponent_div_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 20)(2, "div", 21)(3, "label", 22);
    \u0275\u0275text(4, "From");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "input", 23);
    \u0275\u0275twoWayListener("ngModelChange", function AccountingComponent_div_17_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.reportFrom, $event) || (ctx_r1.reportFrom = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function AccountingComponent_div_17_Template_input_change_5_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.loadReport());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 21)(7, "label", 22);
    \u0275\u0275text(8, "To");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "input", 23);
    \u0275\u0275twoWayListener("ngModelChange", function AccountingComponent_div_17_Template_input_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.reportTo, $event) || (ctx_r1.reportTo = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("change", function AccountingComponent_div_17_Template_input_change_9_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.loadReport());
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275template(10, AccountingComponent_div_17_div_10_Template, 41, 12, "div", 24);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.reportFrom);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.reportTo);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.report);
  }
}
function AccountingComponent_div_18_option_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 49);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r9 = ctx.$implicit;
    \u0275\u0275property("ngValue", a_r9.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", a_r9.accountCode, " \u2014 ", a_r9.accountName, "");
  }
}
function AccountingComponent_div_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 33);
    \u0275\u0275listener("click", function AccountingComponent_div_18_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showAccForm = false);
    });
    \u0275\u0275elementStart(1, "div", 34);
    \u0275\u0275listener("click", function AccountingComponent_div_18_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r8);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 35)(3, "h3", 36);
    \u0275\u0275text(4, "New Account");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 37);
    \u0275\u0275listener("click", function AccountingComponent_div_18_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showAccForm = false);
    });
    \u0275\u0275elementStart(6, "span", 8);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 38)(9, "div", 39)(10, "div", 21)(11, "label", 22);
    \u0275\u0275text(12, "Code *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "input", 40);
    \u0275\u0275twoWayListener("ngModelChange", function AccountingComponent_div_18_Template_input_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.accForm.accountCode, $event) || (ctx_r1.accForm.accountCode = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 21)(15, "label", 22);
    \u0275\u0275text(16, "Type *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "select", 40);
    \u0275\u0275twoWayListener("ngModelChange", function AccountingComponent_div_18_Template_select_ngModelChange_17_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.accForm.accountType, $event) || (ctx_r1.accForm.accountType = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(18, "option", 41);
    \u0275\u0275text(19, "Asset");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "option", 42);
    \u0275\u0275text(21, "Liability");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "option", 43);
    \u0275\u0275text(23, "Equity");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "option", 44);
    \u0275\u0275text(25, "Revenue");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "option", 45);
    \u0275\u0275text(27, "Expense");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(28, "div", 46)(29, "div", 21)(30, "label", 22);
    \u0275\u0275text(31, "Name (EN) *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "input", 40);
    \u0275\u0275twoWayListener("ngModelChange", function AccountingComponent_div_18_Template_input_ngModelChange_32_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.accForm.accountName, $event) || (ctx_r1.accForm.accountName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "div", 21)(34, "label", 22);
    \u0275\u0275text(35, "Name (AR)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "input", 47);
    \u0275\u0275twoWayListener("ngModelChange", function AccountingComponent_div_18_Template_input_ngModelChange_36_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.accForm.accountNameAr, $event) || (ctx_r1.accForm.accountNameAr = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(37, "div", 48)(38, "label", 22);
    \u0275\u0275text(39, "Parent Account");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "select", 40);
    \u0275\u0275twoWayListener("ngModelChange", function AccountingComponent_div_18_Template_select_ngModelChange_40_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.accForm.parentAccountId, $event) || (ctx_r1.accForm.parentAccountId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(41, "option", 49);
    \u0275\u0275text(42, "\u2014 None \u2014");
    \u0275\u0275elementEnd();
    \u0275\u0275template(43, AccountingComponent_div_18_option_43_Template, 2, 3, "option", 50);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(44, "div", 51)(45, "button", 52);
    \u0275\u0275listener("click", function AccountingComponent_div_18_Template_button_click_45_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showAccForm = false);
    });
    \u0275\u0275text(46);
    \u0275\u0275pipe(47, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "button", 53);
    \u0275\u0275listener("click", function AccountingComponent_div_18_Template_button_click_48_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveAccount());
    });
    \u0275\u0275text(49);
    \u0275\u0275pipe(50, "translate");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(13);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.accForm.accountCode);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.accForm.accountType);
    \u0275\u0275advance(15);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.accForm.accountName);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.accForm.accountNameAr);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.accForm.parentAccountId);
    \u0275\u0275advance();
    \u0275\u0275property("ngValue", null);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r1.accounts);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(47, 9, "CANCEL"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(50, 11, "SAVE"));
  }
}
function AccountingComponent_div_19_div_24_option_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 49);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r13 = ctx.$implicit;
    \u0275\u0275property("ngValue", a_r13.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", a_r13.accountCode, " \u2014 ", a_r13.accountName, "");
  }
}
function AccountingComponent_div_19_div_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 60)(1, "div", 21)(2, "select", 40);
    \u0275\u0275twoWayListener("ngModelChange", function AccountingComponent_div_19_div_24_Template_select_ngModelChange_2_listener($event) {
      const l_r12 = \u0275\u0275restoreView(_r11).$implicit;
      \u0275\u0275twoWayBindingSet(l_r12.accountId, $event) || (l_r12.accountId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275template(3, AccountingComponent_div_19_div_24_option_3_Template, 2, 3, "option", 50);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 21)(5, "input", 61);
    \u0275\u0275twoWayListener("ngModelChange", function AccountingComponent_div_19_div_24_Template_input_ngModelChange_5_listener($event) {
      const l_r12 = \u0275\u0275restoreView(_r11).$implicit;
      \u0275\u0275twoWayBindingSet(l_r12.debitAmount, $event) || (l_r12.debitAmount = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 21)(7, "input", 62);
    \u0275\u0275twoWayListener("ngModelChange", function AccountingComponent_div_19_div_24_Template_input_ngModelChange_7_listener($event) {
      const l_r12 = \u0275\u0275restoreView(_r11).$implicit;
      \u0275\u0275twoWayBindingSet(l_r12.creditAmount, $event) || (l_r12.creditAmount = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "button", 63);
    \u0275\u0275listener("click", function AccountingComponent_div_19_div_24_Template_button_click_8_listener() {
      const i_r14 = \u0275\u0275restoreView(_r11).index;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.jeForm.lines.splice(i_r14, 1));
    });
    \u0275\u0275elementStart(9, "span", 59);
    \u0275\u0275text(10, "remove");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const l_r12 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", l_r12.accountId);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.accounts);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", l_r12.debitAmount);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", l_r12.creditAmount);
  }
}
function AccountingComponent_div_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 33);
    \u0275\u0275listener("click", function AccountingComponent_div_19_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showJeForm = false);
    });
    \u0275\u0275elementStart(1, "div", 54);
    \u0275\u0275listener("click", function AccountingComponent_div_19_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r10);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 35)(3, "h3", 36);
    \u0275\u0275text(4, "New Journal Entry");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 37);
    \u0275\u0275listener("click", function AccountingComponent_div_19_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showJeForm = false);
    });
    \u0275\u0275elementStart(6, "span", 8);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 38)(9, "div", 39)(10, "div", 21)(11, "label", 22);
    \u0275\u0275text(12, "Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "input", 55);
    \u0275\u0275twoWayListener("ngModelChange", function AccountingComponent_div_19_Template_input_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.jeForm.entryDate, $event) || (ctx_r1.jeForm.entryDate = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 21)(15, "label", 22);
    \u0275\u0275text(16, "Reference");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "input", 40);
    \u0275\u0275twoWayListener("ngModelChange", function AccountingComponent_div_19_Template_input_ngModelChange_17_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.jeForm.reference, $event) || (ctx_r1.jeForm.reference = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "div", 48)(19, "label", 22);
    \u0275\u0275text(20, "Description");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "input", 40);
    \u0275\u0275twoWayListener("ngModelChange", function AccountingComponent_div_19_Template_input_ngModelChange_21_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.jeForm.description, $event) || (ctx_r1.jeForm.description = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "h4", 56);
    \u0275\u0275text(23, "Lines");
    \u0275\u0275elementEnd();
    \u0275\u0275template(24, AccountingComponent_div_19_div_24_Template, 11, 4, "div", 57);
    \u0275\u0275elementStart(25, "button", 58);
    \u0275\u0275listener("click", function AccountingComponent_div_19_Template_button_click_25_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.jeForm.lines.push({ accountId: null, debitAmount: 0, creditAmount: 0 }));
    });
    \u0275\u0275elementStart(26, "span", 59);
    \u0275\u0275text(27, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(28, " Add Line");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "div", 51)(30, "button", 52);
    \u0275\u0275listener("click", function AccountingComponent_div_19_Template_button_click_30_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showJeForm = false);
    });
    \u0275\u0275text(31);
    \u0275\u0275pipe(32, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "button", 53);
    \u0275\u0275listener("click", function AccountingComponent_div_19_Template_button_click_33_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveJe());
    });
    \u0275\u0275text(34);
    \u0275\u0275pipe(35, "translate");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(13);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.jeForm.entryDate);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.jeForm.reference);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.jeForm.description);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r1.jeForm.lines);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(32, 6, "CANCEL"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(35, 8, "SAVE"));
  }
}
var AccountingComponent = class _AccountingComponent {
  constructor(svc, toast) {
    this.svc = svc;
    this.toast = toast;
    this.tab = "accounts";
    this.accounts = [];
    this.journalEntries = [];
    this.report = null;
    this.showAccForm = false;
    this.showJeForm = false;
    this.accForm = {};
    this.jeForm = { lines: [] };
    this.reportFrom = "";
    this.reportTo = "";
    const now = /* @__PURE__ */ new Date();
    this.reportFrom = new Date(now.getFullYear(), 0, 1).toISOString().split("T")[0];
    this.reportTo = now.toISOString().split("T")[0];
  }
  ngOnInit() {
    this.loadAccounts();
  }
  loadAccounts() {
    this.svc.getChartOfAccounts().subscribe((a) => this.accounts = a);
  }
  loadJournal() {
    this.svc.getJournalEntries({}).subscribe((r) => this.journalEntries = r.items);
  }
  loadReport() {
    this.svc.getFinancialReport(this.reportFrom, this.reportTo).subscribe((r) => this.report = r);
  }
  saveAccount() {
    this.svc.createAccount(this.accForm).subscribe({ next: () => {
      this.toast.success("Saved");
      this.showAccForm = false;
      this.loadAccounts();
    }, error: () => this.toast.error("Error") });
  }
  initJeForm() {
    this.jeForm = { entryDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0], description: "", reference: "", lines: [{ accountId: null, debitAmount: 0, creditAmount: 0 }, { accountId: null, debitAmount: 0, creditAmount: 0 }] };
  }
  saveJe() {
    this.svc.createJournalEntry(this.jeForm).subscribe({ next: () => {
      this.toast.success("Saved");
      this.showJeForm = false;
      this.loadJournal();
    }, error: (e) => this.toast.error(e.error?.message || "Error") });
  }
  postEntry(id) {
    this.svc.postJournalEntry(id).subscribe({ next: () => {
      this.toast.success("Posted");
      this.loadJournal();
    }, error: (e) => this.toast.error(e.error?.message || "Error") });
  }
  static {
    this.\u0275fac = function AccountingComponent_Factory(t) {
      return new (t || _AccountingComponent)(\u0275\u0275directiveInject(AccountingService), \u0275\u0275directiveInject(ToastService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AccountingComponent, selectors: [["app-accounting"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 20, vars: 29, consts: [[1, "page-header"], [1, "page-title"], [1, "flex", "gap-2"], [1, "btn", 3, "click"], [4, "ngIf"], ["class", "modal-overlay", 3, "click", 4, "ngIf"], [1, "flex", "justify-between", "items-center", "mb-4"], [1, "btn", "btn-primary", "btn-sm", 3, "click"], [1, "material-icons-round"], [1, "card", 2, "padding", "0"], [1, "table-container"], [1, "table"], [4, "ngFor", "ngForOf"], [1, "badge", "badge-primary"], [1, "font-semibold"], [1, "badge", "badge-secondary"], [1, "badge", "badge-info"], [1, "badge", 3, "ngClass"], ["class", "btn btn-sm btn-success", 3, "click", 4, "ngIf"], [1, "btn", "btn-sm", "btn-success", 3, "click"], [1, "filter-bar", "mb-4"], [1, "form-group"], [1, "form-label"], ["type", "date", 1, "form-control", 3, "ngModelChange", "change", "ngModel"], ["class", "card-grid", 4, "ngIf"], [1, "card-grid"], [1, "stat-card"], [1, "stat-icon", "success"], [1, "stat-value"], [1, "stat-label"], [1, "stat-icon", "danger"], [1, "stat-icon", "primary"], [1, "stat-icon", "accent"], [1, "modal-overlay", 3, "click"], [1, "modal", 3, "click"], [1, "modal-header"], [1, "modal-title"], [1, "btn", "btn-sm", "btn-secondary", 3, "click"], [1, "modal-body"], [1, "form-row"], [1, "form-control", 3, "ngModelChange", "ngModel"], ["value", "Asset"], ["value", "Liability"], ["value", "Equity"], ["value", "Revenue"], ["value", "Expense"], [1, "form-row", "mt-4"], ["dir", "rtl", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "form-group", "mt-4"], [3, "ngValue"], [3, "ngValue", 4, "ngFor", "ngForOf"], [1, "modal-footer"], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-primary", 3, "click"], [1, "modal", "modal-lg", 3, "click"], ["type", "date", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "mt-4", "mb-2"], ["class", "form-row mt-2", 4, "ngFor", "ngForOf"], [1, "btn", "btn-sm", "btn-secondary", "mt-2", 3, "click"], [1, "material-icons-round", 2, "font-size", "16px"], [1, "form-row", "mt-2"], ["type", "number", "placeholder", "Debit", 1, "form-control", 3, "ngModelChange", "ngModel"], ["type", "number", "placeholder", "Credit", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "btn", "btn-sm", "btn-danger", 3, "click"]], template: function AccountingComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div")(2, "h1", 1);
        \u0275\u0275text(3);
        \u0275\u0275pipe(4, "translate");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(5, "div", 2)(6, "button", 3);
        \u0275\u0275listener("click", function AccountingComponent_Template_button_click_6_listener() {
          return ctx.tab = "accounts";
        });
        \u0275\u0275text(7);
        \u0275\u0275pipe(8, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "button", 3);
        \u0275\u0275listener("click", function AccountingComponent_Template_button_click_9_listener() {
          ctx.tab = "journal";
          return ctx.loadJournal();
        });
        \u0275\u0275text(10);
        \u0275\u0275pipe(11, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "button", 3);
        \u0275\u0275listener("click", function AccountingComponent_Template_button_click_12_listener() {
          ctx.tab = "reports";
          return ctx.loadReport();
        });
        \u0275\u0275text(13);
        \u0275\u0275pipe(14, "translate");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(15, AccountingComponent_div_15_Template, 27, 7, "div", 4)(16, AccountingComponent_div_16_Template, 31, 7, "div", 4)(17, AccountingComponent_div_17_Template, 11, 3, "div", 4)(18, AccountingComponent_div_18_Template, 51, 13, "div", 5)(19, AccountingComponent_div_19_Template, 36, 10, "div", 5);
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 21, "ACCOUNTING"));
        \u0275\u0275advance(3);
        \u0275\u0275classProp("btn-primary", ctx.tab === "accounts")("btn-secondary", ctx.tab !== "accounts");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 23, "CHART_OF_ACCOUNTS"));
        \u0275\u0275advance(2);
        \u0275\u0275classProp("btn-primary", ctx.tab === "journal")("btn-secondary", ctx.tab !== "journal");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 25, "JOURNAL_ENTRIES"));
        \u0275\u0275advance(2);
        \u0275\u0275classProp("btn-primary", ctx.tab === "reports")("btn-secondary", ctx.tab !== "reports");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(14, 27, "FINANCIAL_REPORTS"));
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.tab === "accounts");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.tab === "journal");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.tab === "reports");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showAccForm);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showJeForm);
      }
    }, dependencies: [CommonModule, NgClass, NgForOf, NgIf, CurrencyPipe, DatePipe, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, TranslateModule, TranslatePipe], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AccountingComponent, { className: "AccountingComponent", filePath: "src\\app\\features\\accounting\\accounting.component.ts", lineNumber: 116 });
})();
export {
  AccountingComponent
};
//# sourceMappingURL=chunk-25Q3LU2T.js.map
