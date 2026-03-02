import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NumberValueAccessor
} from "./chunk-GVBL3DCA.js";
import {
  ToastService
} from "./chunk-DM7YHZMX.js";
import {
  DoctorService
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

// src/app/features/doctors/doctors.component.ts
function DoctorsComponent_div_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275element(1, "div", 15);
    \u0275\u0275elementEnd();
  }
}
function DoctorsComponent_div_20_tr_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 20);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 21);
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
    \u0275\u0275elementStart(13, "td")(14, "span", 22);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "translate");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "td")(18, "div", 23)(19, "button", 24);
    \u0275\u0275listener("click", function DoctorsComponent_div_20_tr_26_Template_button_click_19_listener() {
      const d_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openForm(d_r2));
    });
    \u0275\u0275elementStart(20, "span", 25);
    \u0275\u0275text(21, "edit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "button", 26);
    \u0275\u0275listener("click", function DoctorsComponent_div_20_tr_26_Template_button_click_22_listener() {
      const d_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.deleteDoc(d_r2));
    });
    \u0275\u0275elementStart(23, "span", 25);
    \u0275\u0275text(24, "delete");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const d_r2 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(d_r2.doctorCode);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r2.fullName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r2.specialization);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(d_r2.phoneNumber || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(12, 7, d_r2.consultationFee));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngClass", d_r2.isActive ? "badge-success" : "badge-secondary");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(16, 9, d_r2.isActive ? "ACTIVE" : "INACTIVE"));
  }
}
function DoctorsComponent_div_20_tr_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 27)(2, "div", 28)(3, "span", 29);
    \u0275\u0275text(4, "medical_services");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 30);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "translate");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(7, 1, "NO_DATA"));
  }
}
function DoctorsComponent_div_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16)(1, "table", 17)(2, "thead")(3, "tr")(4, "th");
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
    \u0275\u0275template(26, DoctorsComponent_div_20_tr_26_Template, 25, 11, "tr", 18)(27, DoctorsComponent_div_20_tr_27_Template, 8, 3, "tr", 19);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 9, "DOCTOR_CODE"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(9, 11, "DOCTOR_NAME"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(12, 13, "SPECIALIZATION"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(15, 15, "PHONE"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(18, 17, "CONSULTATION_FEE"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(21, 19, "STATUS"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(24, 21, "ACTIONS"));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r2.doctors);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.doctors.length === 0);
  }
}
function DoctorsComponent_div_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 31)(1, "span", 32);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 33)(4, "button", 34);
    \u0275\u0275listener("click", function DoctorsComponent_div_21_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      ctx_r2.page = ctx_r2.page - 1;
      return \u0275\u0275resetView(ctx_r2.loadData());
    });
    \u0275\u0275elementStart(5, "span", 4);
    \u0275\u0275text(6, "chevron_left");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 34);
    \u0275\u0275listener("click", function DoctorsComponent_div_21_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      ctx_r2.page = ctx_r2.page + 1;
      return \u0275\u0275resetView(ctx_r2.loadData());
    });
    \u0275\u0275elementStart(8, "span", 4);
    \u0275\u0275text(9, "chevron_right");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("Page ", ctx_r2.page, " of ", ctx_r2.totalPages, "");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.page <= 1);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r2.page >= ctx_r2.totalPages);
  }
}
function DoctorsComponent_div_22_span_58_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 52);
  }
}
function DoctorsComponent_div_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 35);
    \u0275\u0275listener("click", function DoctorsComponent_div_22_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.showForm = false);
    });
    \u0275\u0275elementStart(1, "div", 36);
    \u0275\u0275listener("click", function DoctorsComponent_div_22_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r5);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 37)(3, "h3", 38);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "translate");
    \u0275\u0275pipe(6, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 24);
    \u0275\u0275listener("click", function DoctorsComponent_div_22_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.showForm = false);
    });
    \u0275\u0275elementStart(8, "span", 4);
    \u0275\u0275text(9, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 39)(11, "div", 40)(12, "div", 41)(13, "label", 42);
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "input", 43);
    \u0275\u0275twoWayListener("ngModelChange", function DoctorsComponent_div_22_Template_input_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.form.fullName, $event) || (ctx_r2.form.fullName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 41)(18, "label", 42);
    \u0275\u0275text(19);
    \u0275\u0275pipe(20, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "input", 43);
    \u0275\u0275twoWayListener("ngModelChange", function DoctorsComponent_div_22_Template_input_ngModelChange_21_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.form.specialization, $event) || (ctx_r2.form.specialization = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(22, "div", 44)(23, "div", 41)(24, "label", 42);
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "input", 43);
    \u0275\u0275twoWayListener("ngModelChange", function DoctorsComponent_div_22_Template_input_ngModelChange_27_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.form.phoneNumber, $event) || (ctx_r2.form.phoneNumber = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 41)(29, "label", 42);
    \u0275\u0275text(30);
    \u0275\u0275pipe(31, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "input", 43);
    \u0275\u0275twoWayListener("ngModelChange", function DoctorsComponent_div_22_Template_input_ngModelChange_32_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.form.email, $event) || (ctx_r2.form.email = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(33, "div", 44)(34, "div", 41)(35, "label", 42);
    \u0275\u0275text(36, "License Number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "input", 43);
    \u0275\u0275twoWayListener("ngModelChange", function DoctorsComponent_div_22_Template_input_ngModelChange_37_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.form.licenseNumber, $event) || (ctx_r2.form.licenseNumber = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(38, "div", 41)(39, "label", 42);
    \u0275\u0275text(40);
    \u0275\u0275pipe(41, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "input", 45);
    \u0275\u0275twoWayListener("ngModelChange", function DoctorsComponent_div_22_Template_input_ngModelChange_42_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.form.consultationFee, $event) || (ctx_r2.form.consultationFee = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(43, "div", 44)(44, "div", 41)(45, "label", 42);
    \u0275\u0275text(46);
    \u0275\u0275pipe(47, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "input", 46);
    \u0275\u0275twoWayListener("ngModelChange", function DoctorsComponent_div_22_Template_input_ngModelChange_48_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.form.workingDays, $event) || (ctx_r2.form.workingDays = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(49, "div", 41)(50, "label", 42);
    \u0275\u0275text(51, "Working Hours");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "input", 47);
    \u0275\u0275twoWayListener("ngModelChange", function DoctorsComponent_div_22_Template_input_ngModelChange_52_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.form.workingHours, $event) || (ctx_r2.form.workingHours = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(53, "div", 48)(54, "button", 49);
    \u0275\u0275listener("click", function DoctorsComponent_div_22_Template_button_click_54_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.showForm = false);
    });
    \u0275\u0275text(55);
    \u0275\u0275pipe(56, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "button", 50);
    \u0275\u0275listener("click", function DoctorsComponent_div_22_Template_button_click_57_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.save());
    });
    \u0275\u0275template(58, DoctorsComponent_div_22_span_58_Template, 1, 0, "span", 51);
    \u0275\u0275text(59);
    \u0275\u0275pipe(60, "translate");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.editing ? \u0275\u0275pipeBind1(5, 19, "EDIT") : \u0275\u0275pipeBind1(6, 21, "ADD_NEW"));
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind1(15, 23, "FULL_NAME"), " *");
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form.fullName);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind1(20, 25, "SPECIALIZATION"), " *");
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form.specialization);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(26, 27, "PHONE"));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form.phoneNumber);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(31, 29, "EMAIL"));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form.email);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form.licenseNumber);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(41, 31, "CONSULTATION_FEE"));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form.consultationFee);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(47, 33, "WORKING_DAYS"));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form.workingDays);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form.workingHours);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(56, 35, "CANCEL"));
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.saving);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.saving);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(60, 37, "SAVE"), "");
  }
}
var DoctorsComponent = class _DoctorsComponent {
  constructor(svc, toast) {
    this.svc = svc;
    this.toast = toast;
    this.doctors = [];
    this.loading = true;
    this.search = "";
    this.page = 1;
    this.totalPages = 1;
    this.showForm = false;
    this.editing = null;
    this.saving = false;
    this.form = {};
  }
  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.loading = true;
    this.svc.getAll({ page: this.page, pageSize: 20, search: this.search }).subscribe({ next: (r) => {
      this.doctors = r.items;
      this.totalPages = r.totalPages;
      this.loading = false;
    }, error: () => this.loading = false });
  }
  openForm(d) {
    this.editing = d || null;
    this.form = d ? __spreadValues({}, d) : { consultationFee: 0 };
    this.showForm = true;
  }
  save() {
    if (!this.form.fullName || !this.form.specialization)
      return;
    this.saving = true;
    const o = this.editing ? this.svc.update(this.editing.id, this.form) : this.svc.create(this.form);
    o.subscribe({ next: () => {
      this.toast.success("Saved");
      this.showForm = false;
      this.saving = false;
      this.loadData();
    }, error: () => {
      this.toast.error("Error");
      this.saving = false;
    } });
  }
  deleteDoc(d) {
    if (confirm("Delete?"))
      this.svc.delete(d.id).subscribe({ next: () => {
        this.toast.success("Deleted");
        this.loadData();
      } });
  }
  static {
    this.\u0275fac = function DoctorsComponent_Factory(t) {
      return new (t || _DoctorsComponent)(\u0275\u0275directiveInject(DoctorService), \u0275\u0275directiveInject(ToastService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DoctorsComponent, selectors: [["app-doctors"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 23, vars: 14, consts: [[1, "page-header"], [1, "page-title"], [1, "page-subtitle"], [1, "btn", "btn-primary", 3, "click"], [1, "material-icons-round"], [1, "filter-bar", "mb-4"], [1, "search-bar"], [1, "material-icons-round", "search-icon"], [1, "form-control", 3, "ngModelChange", "input", "placeholder", "ngModel"], [1, "card", 2, "padding", "0"], ["class", "loading-container", 4, "ngIf"], ["class", "table-container", 4, "ngIf"], ["class", "pagination", 4, "ngIf"], ["class", "modal-overlay", 3, "click", 4, "ngIf"], [1, "loading-container"], [1, "spinner"], [1, "table-container"], [1, "table"], [4, "ngFor", "ngForOf"], [4, "ngIf"], [1, "badge", "badge-info"], [1, "font-semibold"], [1, "badge", 3, "ngClass"], [1, "flex", "gap-1"], [1, "btn", "btn-sm", "btn-secondary", 3, "click"], [1, "material-icons-round", 2, "font-size", "16px"], [1, "btn", "btn-sm", "btn-danger", 3, "click"], ["colspan", "7"], [1, "empty-state"], [1, "material-icons-round", "empty-icon"], [1, "empty-title"], [1, "pagination"], [1, "pagination-info"], [1, "pagination-buttons"], [1, "page-btn", 3, "click", "disabled"], [1, "modal-overlay", 3, "click"], [1, "modal", 3, "click"], [1, "modal-header"], [1, "modal-title"], [1, "modal-body"], [1, "form-row"], [1, "form-group"], [1, "form-label"], [1, "form-control", 3, "ngModelChange", "ngModel"], [1, "form-row", "mt-4"], ["type", "number", 1, "form-control", 3, "ngModelChange", "ngModel"], ["placeholder", "Sun-Thu", 1, "form-control", 3, "ngModelChange", "ngModel"], ["placeholder", "09:00 - 17:00", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "modal-footer"], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["class", "spinner spinner-sm", 4, "ngIf"], [1, "spinner", "spinner-sm"]], template: function DoctorsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div")(2, "h1", 1);
        \u0275\u0275text(3);
        \u0275\u0275pipe(4, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "p", 2);
        \u0275\u0275text(6, "Manage doctors");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "button", 3);
        \u0275\u0275listener("click", function DoctorsComponent_Template_button_click_7_listener() {
          return ctx.openForm();
        });
        \u0275\u0275elementStart(8, "span", 4);
        \u0275\u0275text(9, "add");
        \u0275\u0275elementEnd();
        \u0275\u0275text(10);
        \u0275\u0275pipe(11, "translate");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(12, "div", 5)(13, "div", 6)(14, "span", 7);
        \u0275\u0275text(15, "search");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(16, "input", 8);
        \u0275\u0275pipe(17, "translate");
        \u0275\u0275twoWayListener("ngModelChange", function DoctorsComponent_Template_input_ngModelChange_16_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.search, $event) || (ctx.search = $event);
          return $event;
        });
        \u0275\u0275listener("input", function DoctorsComponent_Template_input_input_16_listener() {
          return ctx.loadData();
        });
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(18, "div", 9);
        \u0275\u0275template(19, DoctorsComponent_div_19_Template, 2, 0, "div", 10)(20, DoctorsComponent_div_20_Template, 28, 23, "div", 11)(21, DoctorsComponent_div_21_Template, 10, 4, "div", 12);
        \u0275\u0275elementEnd();
        \u0275\u0275template(22, DoctorsComponent_div_22_Template, 61, 39, "div", 13);
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 8, "DOCTORS"));
        \u0275\u0275advance(7);
        \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(11, 10, "ADD_NEW"), "");
        \u0275\u0275advance(6);
        \u0275\u0275property("placeholder", \u0275\u0275pipeBind1(17, 12, "SEARCH"));
        \u0275\u0275twoWayProperty("ngModel", ctx.search);
        \u0275\u0275advance(3);
        \u0275\u0275property("ngIf", ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.totalPages > 1);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showForm);
      }
    }, dependencies: [CommonModule, NgClass, NgForOf, NgIf, CurrencyPipe, FormsModule, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, NgModel, TranslateModule, TranslatePipe], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DoctorsComponent, { className: "DoctorsComponent", filePath: "src\\app\\features\\doctors\\doctors.component.ts", lineNumber: 54 });
})();
export {
  DoctorsComponent
};
//# sourceMappingURL=chunk-SQQXWSW7.js.map
