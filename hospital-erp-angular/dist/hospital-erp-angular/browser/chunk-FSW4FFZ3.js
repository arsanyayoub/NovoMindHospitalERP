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
  HRService
} from "./chunk-56O4OOG6.js";
import {
  CommonModule,
  CurrencyPipe,
  NgClass,
  NgForOf,
  NgIf,
  TranslateModule,
  TranslatePipe,
  __spreadValues,
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

// src/app/features/hr/hr.component.ts
function HrComponent_div_12_tr_30_Template(rf, ctx) {
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
    \u0275\u0275elementStart(13, "td")(14, "span", 18);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "translate");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "td")(18, "div", 19)(19, "button", 20);
    \u0275\u0275listener("click", function HrComponent_div_12_tr_30_Template_button_click_19_listener() {
      const e_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.editEmp(e_r4));
    });
    \u0275\u0275elementStart(20, "span", 21);
    \u0275\u0275text(21, "edit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "button", 22);
    \u0275\u0275listener("click", function HrComponent_div_12_tr_30_Template_button_click_22_listener() {
      const e_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.deleteEmp(e_r4));
    });
    \u0275\u0275elementStart(23, "span", 21);
    \u0275\u0275text(24, "delete");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const e_r4 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(e_r4.employeeCode);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(e_r4.fullName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(e_r4.department);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(e_r4.position);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(12, 7, e_r4.basicSalary));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", e_r4.isActive ? "badge-success" : "badge-secondary");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(16, 9, e_r4.isActive ? "ACTIVE" : "INACTIVE"));
  }
}
function HrComponent_div_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 6)(2, "div", 7)(3, "span", 8);
    \u0275\u0275text(4, "search");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "input", 9);
    \u0275\u0275pipe(6, "translate");
    \u0275\u0275twoWayListener("ngModelChange", function HrComponent_div_12_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.search, $event) || (ctx_r1.search = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("input", function HrComponent_div_12_Template_input_input_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.loadEmployees());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 10);
    \u0275\u0275listener("click", function HrComponent_div_12_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.showEmpForm = true;
      return \u0275\u0275resetView(ctx_r1.empForm = {});
    });
    \u0275\u0275elementStart(8, "span", 11);
    \u0275\u0275text(9, "add");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 12)(11, "div", 13)(12, "table", 14)(13, "thead")(14, "tr")(15, "th");
    \u0275\u0275text(16, "Code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "th");
    \u0275\u0275text(18, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "th");
    \u0275\u0275text(20, "Department");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "th");
    \u0275\u0275text(22, "Position");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "th");
    \u0275\u0275text(24, "Salary");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "th");
    \u0275\u0275text(26, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "th");
    \u0275\u0275text(28, "Actions");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(29, "tbody");
    \u0275\u0275template(30, HrComponent_div_12_tr_30_Template, 25, 11, "tr", 15);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("placeholder", \u0275\u0275pipeBind1(6, 3, "SEARCH"));
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.search);
    \u0275\u0275advance(25);
    \u0275\u0275property("ngForOf", ctx_r1.employees);
  }
}
function HrComponent_div_13_tr_31_button_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 25);
    \u0275\u0275listener("click", function HrComponent_div_13_tr_31_button_21_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const p_r7 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.processPayroll(p_r7.id));
    });
    \u0275\u0275text(1, "Process");
    \u0275\u0275elementEnd();
  }
}
function HrComponent_div_13_tr_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 17);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275text(12);
    \u0275\u0275pipe(13, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td", 23);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "td")(18, "span", 18);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "td");
    \u0275\u0275template(21, HrComponent_div_13_tr_31_button_21_Template, 2, 0, "button", 24);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const p_r7 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r7.employeeName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", p_r7.month, "/", p_r7.year, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(7, 10, p_r7.basicSalary));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(10, 12, p_r7.allowances));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(13, 14, p_r7.deductions));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(16, 16, p_r7.netSalary));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", p_r7.status === "Paid" ? "badge-success" : "badge-warning");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r7.status);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", p_r7.status !== "Paid");
  }
}
function HrComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "div", 6)(2, "h3");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 10);
    \u0275\u0275listener("click", function HrComponent_div_13_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showGenPayroll = true);
    });
    \u0275\u0275elementStart(6, "span", 11);
    \u0275\u0275text(7, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(8, " Generate");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 12)(10, "div", 13)(11, "table", 14)(12, "thead")(13, "tr")(14, "th");
    \u0275\u0275text(15, "Employee");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Period");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th");
    \u0275\u0275text(19, "Basic");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "th");
    \u0275\u0275text(21, "Allowances");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "th");
    \u0275\u0275text(23, "Deductions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "th");
    \u0275\u0275text(25, "Net Salary");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "th");
    \u0275\u0275text(27, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "th");
    \u0275\u0275text(29, "Actions");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(30, "tbody");
    \u0275\u0275template(31, HrComponent_div_13_tr_31_Template, 22, 18, "tr", 15);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 2, "PAYROLL"));
    \u0275\u0275advance(28);
    \u0275\u0275property("ngForOf", ctx_r1.payrolls);
  }
}
function HrComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275listener("click", function HrComponent_div_14_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showEmpForm = false);
    });
    \u0275\u0275elementStart(1, "div", 27);
    \u0275\u0275listener("click", function HrComponent_div_14_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r8);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 28)(3, "h3");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 20);
    \u0275\u0275listener("click", function HrComponent_div_14_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showEmpForm = false);
    });
    \u0275\u0275elementStart(6, "span", 11);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 29)(9, "div", 30)(10, "div", 31)(11, "label", 32);
    \u0275\u0275text(12, "Full Name *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "input", 33);
    \u0275\u0275twoWayListener("ngModelChange", function HrComponent_div_14_Template_input_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.empForm.fullName, $event) || (ctx_r1.empForm.fullName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 31)(15, "label", 32);
    \u0275\u0275text(16, "National ID");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "input", 33);
    \u0275\u0275twoWayListener("ngModelChange", function HrComponent_div_14_Template_input_ngModelChange_17_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.empForm.nationalId, $event) || (ctx_r1.empForm.nationalId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "div", 34)(19, "div", 31)(20, "label", 32);
    \u0275\u0275text(21, "Department *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "input", 33);
    \u0275\u0275twoWayListener("ngModelChange", function HrComponent_div_14_Template_input_ngModelChange_22_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.empForm.department, $event) || (ctx_r1.empForm.department = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 31)(24, "label", 32);
    \u0275\u0275text(25, "Position *");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "input", 33);
    \u0275\u0275twoWayListener("ngModelChange", function HrComponent_div_14_Template_input_ngModelChange_26_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.empForm.position, $event) || (ctx_r1.empForm.position = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(27, "div", 34)(28, "div", 31)(29, "label", 32);
    \u0275\u0275text(30, "Hire Date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "input", 35);
    \u0275\u0275twoWayListener("ngModelChange", function HrComponent_div_14_Template_input_ngModelChange_31_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.empForm.hireDate, $event) || (ctx_r1.empForm.hireDate = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "div", 31)(33, "label", 32);
    \u0275\u0275text(34, "Basic Salary");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "input", 36);
    \u0275\u0275twoWayListener("ngModelChange", function HrComponent_div_14_Template_input_ngModelChange_35_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.empForm.basicSalary, $event) || (ctx_r1.empForm.basicSalary = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(36, "div", 34)(37, "div", 31)(38, "label", 32);
    \u0275\u0275text(39, "Allowances");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "input", 36);
    \u0275\u0275twoWayListener("ngModelChange", function HrComponent_div_14_Template_input_ngModelChange_40_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.empForm.allowances, $event) || (ctx_r1.empForm.allowances = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(41, "div", 31)(42, "label", 32);
    \u0275\u0275text(43, "Deductions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "input", 36);
    \u0275\u0275twoWayListener("ngModelChange", function HrComponent_div_14_Template_input_ngModelChange_44_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.empForm.deductions, $event) || (ctx_r1.empForm.deductions = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(45, "div", 34)(46, "div", 31)(47, "label", 32);
    \u0275\u0275text(48, "Phone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "input", 33);
    \u0275\u0275twoWayListener("ngModelChange", function HrComponent_div_14_Template_input_ngModelChange_49_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.empForm.phoneNumber, $event) || (ctx_r1.empForm.phoneNumber = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(50, "div", 31)(51, "label", 32);
    \u0275\u0275text(52, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "input", 33);
    \u0275\u0275twoWayListener("ngModelChange", function HrComponent_div_14_Template_input_ngModelChange_53_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.empForm.email, $event) || (ctx_r1.empForm.email = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(54, "div", 37)(55, "button", 38);
    \u0275\u0275listener("click", function HrComponent_div_14_Template_button_click_55_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showEmpForm = false);
    });
    \u0275\u0275text(56);
    \u0275\u0275pipe(57, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "button", 39);
    \u0275\u0275listener("click", function HrComponent_div_14_Template_button_click_58_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.saveEmp());
    });
    \u0275\u0275text(59);
    \u0275\u0275pipe(60, "translate");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", ctx_r1.empForm.id ? "Edit" : "New", " Employee");
    \u0275\u0275advance(9);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.empForm.fullName);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.empForm.nationalId);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.empForm.department);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.empForm.position);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.empForm.hireDate);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.empForm.basicSalary);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.empForm.allowances);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.empForm.deductions);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.empForm.phoneNumber);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.empForm.email);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(57, 13, "CANCEL"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(60, 15, "SAVE"));
  }
}
function HrComponent_div_15_option_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 43);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r10 = ctx.$implicit;
    \u0275\u0275property("ngValue", e_r10.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(e_r10.fullName);
  }
}
function HrComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275listener("click", function HrComponent_div_15_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showGenPayroll = false);
    });
    \u0275\u0275elementStart(1, "div", 40);
    \u0275\u0275listener("click", function HrComponent_div_15_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r9);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 28)(3, "h3");
    \u0275\u0275text(4, "Generate Payroll");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 20);
    \u0275\u0275listener("click", function HrComponent_div_15_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showGenPayroll = false);
    });
    \u0275\u0275elementStart(6, "span", 11);
    \u0275\u0275text(7, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 29)(9, "div", 31)(10, "label", 32);
    \u0275\u0275text(11, "Employee");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "select", 33);
    \u0275\u0275twoWayListener("ngModelChange", function HrComponent_div_15_Template_select_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.genForm.employeeId, $event) || (ctx_r1.genForm.employeeId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275template(13, HrComponent_div_15_option_13_Template, 2, 2, "option", 41);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 34)(15, "div", 31)(16, "label", 32);
    \u0275\u0275text(17, "Month");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "input", 42);
    \u0275\u0275twoWayListener("ngModelChange", function HrComponent_div_15_Template_input_ngModelChange_18_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.genForm.month, $event) || (ctx_r1.genForm.month = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 31)(20, "label", 32);
    \u0275\u0275text(21, "Year");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "input", 36);
    \u0275\u0275twoWayListener("ngModelChange", function HrComponent_div_15_Template_input_ngModelChange_22_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.genForm.year, $event) || (ctx_r1.genForm.year = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(23, "div", 34)(24, "div", 31)(25, "label", 32);
    \u0275\u0275text(26, "Bonuses");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "input", 36);
    \u0275\u0275twoWayListener("ngModelChange", function HrComponent_div_15_Template_input_ngModelChange_27_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.genForm.bonuses, $event) || (ctx_r1.genForm.bonuses = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 31)(29, "label", 32);
    \u0275\u0275text(30, "Extra Deductions");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "input", 36);
    \u0275\u0275twoWayListener("ngModelChange", function HrComponent_div_15_Template_input_ngModelChange_31_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.genForm.deductions, $event) || (ctx_r1.genForm.deductions = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(32, "div", 37)(33, "button", 38);
    \u0275\u0275listener("click", function HrComponent_div_15_Template_button_click_33_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showGenPayroll = false);
    });
    \u0275\u0275text(34);
    \u0275\u0275pipe(35, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "button", 39);
    \u0275\u0275listener("click", function HrComponent_div_15_Template_button_click_36_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.generatePayroll());
    });
    \u0275\u0275text(37, "Generate");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(12);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.genForm.employeeId);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.employees);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.genForm.month);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.genForm.year);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.genForm.bonuses);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.genForm.deductions);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(35, 7, "CANCEL"));
  }
}
var HrComponent = class _HrComponent {
  constructor(svc, toast) {
    this.svc = svc;
    this.toast = toast;
    this.tab = "employees";
    this.employees = [];
    this.payrolls = [];
    this.search = "";
    this.showEmpForm = false;
    this.showGenPayroll = false;
    this.empForm = {};
    this.genForm = { month: (/* @__PURE__ */ new Date()).getMonth() + 1, year: (/* @__PURE__ */ new Date()).getFullYear(), bonuses: 0, deductions: 0 };
  }
  editEmp(e) {
    this.showEmpForm = true;
    this.empForm = __spreadValues({}, e);
  }
  ngOnInit() {
    this.loadEmployees();
  }
  loadEmployees() {
    this.svc.getEmployees({ search: this.search }).subscribe((r) => this.employees = r.items);
  }
  loadPayrolls() {
    this.svc.getPayrolls({}).subscribe((r) => this.payrolls = r.items);
  }
  saveEmp() {
    const obs = this.empForm.id ? this.svc.updateEmployee(this.empForm.id, this.empForm) : this.svc.createEmployee(this.empForm);
    obs.subscribe({ next: () => {
      this.toast.success("Saved");
      this.showEmpForm = false;
      this.loadEmployees();
    }, error: () => this.toast.error("Error") });
  }
  deleteEmp(e) {
    if (confirm("Delete?"))
      this.svc.deleteEmployee(e.id).subscribe({ next: () => {
        this.toast.success("Deleted");
        this.loadEmployees();
      } });
  }
  generatePayroll() {
    this.svc.generatePayroll(this.genForm).subscribe({ next: () => {
      this.toast.success("Generated");
      this.showGenPayroll = false;
      this.loadPayrolls();
    }, error: (e) => this.toast.error(e.error?.message || "Error") });
  }
  processPayroll(id) {
    this.svc.processPayroll(id).subscribe({ next: () => {
      this.toast.success("Processed");
      this.loadPayrolls();
    } });
  }
  static {
    this.\u0275fac = function HrComponent_Factory(t) {
      return new (t || _HrComponent)(\u0275\u0275directiveInject(HRService), \u0275\u0275directiveInject(ToastService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HrComponent, selectors: [["app-hr"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 16, vars: 21, consts: [[1, "page-header"], [1, "page-title"], [1, "flex", "gap-2"], [1, "btn", 3, "click"], [4, "ngIf"], ["class", "modal-overlay", 3, "click", 4, "ngIf"], [1, "flex", "justify-between", "items-center", "mb-4"], [1, "search-bar"], [1, "material-icons-round", "search-icon"], [1, "form-control", 3, "ngModelChange", "input", "placeholder", "ngModel"], [1, "btn", "btn-primary", "btn-sm", 3, "click"], [1, "material-icons-round"], [1, "card", 2, "padding", "0"], [1, "table-container"], [1, "table"], [4, "ngFor", "ngForOf"], [1, "badge", "badge-primary"], [1, "font-semibold"], [1, "badge", 3, "ngClass"], [1, "flex", "gap-1"], [1, "btn", "btn-sm", "btn-secondary", 3, "click"], [1, "material-icons-round", 2, "font-size", "16px"], [1, "btn", "btn-sm", "btn-danger", 3, "click"], [1, "text-success", "font-bold"], ["class", "btn btn-sm btn-success", 3, "click", 4, "ngIf"], [1, "btn", "btn-sm", "btn-success", 3, "click"], [1, "modal-overlay", 3, "click"], [1, "modal", "modal-lg", 3, "click"], [1, "modal-header"], [1, "modal-body"], [1, "form-row"], [1, "form-group"], [1, "form-label"], [1, "form-control", 3, "ngModelChange", "ngModel"], [1, "form-row", "mt-4"], ["type", "date", 1, "form-control", 3, "ngModelChange", "ngModel"], ["type", "number", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "modal-footer"], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-primary", 3, "click"], [1, "modal", 3, "click"], [3, "ngValue", 4, "ngFor", "ngForOf"], ["type", "number", "min", "1", "max", "12", 1, "form-control", 3, "ngModelChange", "ngModel"], [3, "ngValue"]], template: function HrComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div")(2, "h1", 1);
        \u0275\u0275text(3);
        \u0275\u0275pipe(4, "translate");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(5, "div", 2)(6, "button", 3);
        \u0275\u0275listener("click", function HrComponent_Template_button_click_6_listener() {
          return ctx.tab = "employees";
        });
        \u0275\u0275text(7);
        \u0275\u0275pipe(8, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "button", 3);
        \u0275\u0275listener("click", function HrComponent_Template_button_click_9_listener() {
          ctx.tab = "payroll";
          return ctx.loadPayrolls();
        });
        \u0275\u0275text(10);
        \u0275\u0275pipe(11, "translate");
        \u0275\u0275elementEnd()()();
        \u0275\u0275template(12, HrComponent_div_12_Template, 31, 5, "div", 4)(13, HrComponent_div_13_Template, 32, 4, "div", 4)(14, HrComponent_div_14_Template, 61, 17, "div", 5)(15, HrComponent_div_15_Template, 38, 9, "div", 5);
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 15, "HR"));
        \u0275\u0275advance(3);
        \u0275\u0275classProp("btn-primary", ctx.tab === "employees")("btn-secondary", ctx.tab !== "employees");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 17, "EMPLOYEES"));
        \u0275\u0275advance(2);
        \u0275\u0275classProp("btn-primary", ctx.tab === "payroll")("btn-secondary", ctx.tab !== "payroll");
        \u0275\u0275advance();
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 19, "PAYROLL"));
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.tab === "employees");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.tab === "payroll");
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showEmpForm);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showGenPayroll);
      }
    }, dependencies: [CommonModule, NgClass, NgForOf, NgIf, CurrencyPipe, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, MinValidator, MaxValidator, NgModel, TranslateModule, TranslatePipe], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HrComponent, { className: "HrComponent", filePath: "src\\app\\features\\hr\\hr.component.ts", lineNumber: 70 });
})();
export {
  HrComponent
};
//# sourceMappingURL=chunk-FSW4FFZ3.js.map
