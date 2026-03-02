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
  AppointmentService,
  DoctorService,
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

// src/app/features/appointments/appointments.component.ts
function AppointmentsComponent_div_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "div", 21);
    \u0275\u0275elementEnd();
  }
}
function AppointmentsComponent_div_30_tr_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "span", 26);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 27);
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
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td")(14, "span", 28);
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "translate");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "td");
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "td")(21, "div", 29)(22, "button", 30);
    \u0275\u0275listener("click", function AppointmentsComponent_div_30_tr_27_Template_button_click_22_listener() {
      const a_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openForm(a_r2));
    });
    \u0275\u0275elementStart(23, "span", 31);
    \u0275\u0275text(24, "edit");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "button", 32);
    \u0275\u0275listener("click", function AppointmentsComponent_div_30_tr_27_Template_button_click_25_listener() {
      const a_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.deleteAppt(a_r2));
    });
    \u0275\u0275elementStart(26, "span", 31);
    \u0275\u0275text(27, "delete");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const a_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(a_r2.appointmentCode);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(a_r2.patientName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(a_r2.doctorName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(10, 8, a_r2.appointmentDate, "mediumDate"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(a_r2.appointmentTime);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngClass", ctx_r2.getStatusClass(a_r2.status));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(16, 11, a_r2.status));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(19, 13, a_r2.fee));
  }
}
function AppointmentsComponent_div_30_tr_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 33)(2, "div", 34)(3, "span", 35);
    \u0275\u0275text(4, "calendar_month");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 36);
    \u0275\u0275text(6);
    \u0275\u0275pipe(7, "translate");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(7, 1, "NO_DATA"));
  }
}
function AppointmentsComponent_div_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "table", 23)(2, "thead")(3, "tr")(4, "th");
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
    \u0275\u0275text(17, "Time");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "th");
    \u0275\u0275text(19);
    \u0275\u0275pipe(20, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "th");
    \u0275\u0275text(22, "Fee");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "th");
    \u0275\u0275text(24);
    \u0275\u0275pipe(25, "translate");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(26, "tbody");
    \u0275\u0275template(27, AppointmentsComponent_div_30_tr_27_Template, 28, 15, "tr", 24)(28, AppointmentsComponent_div_30_tr_28_Template, 8, 3, "tr", 25);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(6, 8, "APPOINTMENT_CODE"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(9, 10, "PATIENT_NAME"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(12, 12, "DOCTOR_NAME"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(15, 14, "DATE"));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(20, 16, "STATUS"));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(25, 18, "ACTIONS"));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r2.appointments);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.appointments.length === 0);
  }
}
function AppointmentsComponent_div_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 37)(1, "span", 38);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 39)(4, "button", 40);
    \u0275\u0275listener("click", function AppointmentsComponent_div_31_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      ctx_r2.page = ctx_r2.page - 1;
      return \u0275\u0275resetView(ctx_r2.loadData());
    });
    \u0275\u0275elementStart(5, "span", 3);
    \u0275\u0275text(6, "chevron_left");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "button", 40);
    \u0275\u0275listener("click", function AppointmentsComponent_div_31_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      ctx_r2.page = ctx_r2.page + 1;
      return \u0275\u0275resetView(ctx_r2.loadData());
    });
    \u0275\u0275elementStart(8, "span", 3);
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
function AppointmentsComponent_div_32_option_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 63);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r6 = ctx.$implicit;
    \u0275\u0275property("value", p_r6.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", p_r6.fullName, " (", p_r6.patientCode, ")");
  }
}
function AppointmentsComponent_div_32_option_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 63);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r7 = ctx.$implicit;
    \u0275\u0275property("value", d_r7.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", d_r7.fullName, " \u2014 ", d_r7.specialization, "");
  }
}
function AppointmentsComponent_div_32_div_45_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 47)(1, "label", 48);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "select", 49);
    \u0275\u0275twoWayListener("ngModelChange", function AppointmentsComponent_div_32_div_45_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.form.status, $event) || (ctx_r2.form.status = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(5, "option", 10);
    \u0275\u0275text(6, "Scheduled");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "option", 11);
    \u0275\u0275text(8, "Confirmed");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "option", 64);
    \u0275\u0275text(10, "In Progress");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "option", 12);
    \u0275\u0275text(12, "Completed");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "option", 13);
    \u0275\u0275text(14, "Cancelled");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 2, "STATUS"));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form.status);
  }
}
function AppointmentsComponent_div_32_div_46_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 57)(1, "label", 48);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "textarea", 58);
    \u0275\u0275twoWayListener("ngModelChange", function AppointmentsComponent_div_32_div_46_Template_textarea_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.form.diagnosis, $event) || (ctx_r2.form.diagnosis = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 2, "DIAGNOSIS"));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form.diagnosis);
  }
}
function AppointmentsComponent_div_32_div_47_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 57)(1, "label", 48);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "textarea", 58);
    \u0275\u0275twoWayListener("ngModelChange", function AppointmentsComponent_div_32_div_47_Template_textarea_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r10);
      const ctx_r2 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r2.form.prescription, $event) || (ctx_r2.form.prescription = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 2, "PRESCRIPTION"));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form.prescription);
  }
}
function AppointmentsComponent_div_32_span_58_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 65);
  }
}
function AppointmentsComponent_div_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 41);
    \u0275\u0275listener("click", function AppointmentsComponent_div_32_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.showForm = false);
    });
    \u0275\u0275elementStart(1, "div", 42);
    \u0275\u0275listener("click", function AppointmentsComponent_div_32_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r5);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "div", 43)(3, "h3", 44);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "translate");
    \u0275\u0275pipe(6, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 30);
    \u0275\u0275listener("click", function AppointmentsComponent_div_32_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.showForm = false);
    });
    \u0275\u0275elementStart(8, "span", 3);
    \u0275\u0275text(9, "close");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 45)(11, "div", 46)(12, "div", 47)(13, "label", 48);
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "select", 49);
    \u0275\u0275twoWayListener("ngModelChange", function AppointmentsComponent_div_32_Template_select_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.form.patientId, $event) || (ctx_r2.form.patientId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275template(17, AppointmentsComponent_div_32_option_17_Template, 2, 3, "option", 50);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "div", 47)(19, "label", 48);
    \u0275\u0275text(20);
    \u0275\u0275pipe(21, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "select", 49);
    \u0275\u0275twoWayListener("ngModelChange", function AppointmentsComponent_div_32_Template_select_ngModelChange_22_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.form.doctorId, $event) || (ctx_r2.form.doctorId = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275template(23, AppointmentsComponent_div_32_option_23_Template, 2, 3, "option", 50);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "div", 51)(25, "div", 47)(26, "label", 48);
    \u0275\u0275text(27);
    \u0275\u0275pipe(28, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "input", 52);
    \u0275\u0275twoWayListener("ngModelChange", function AppointmentsComponent_div_32_Template_input_ngModelChange_29_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.form.appointmentDate, $event) || (ctx_r2.form.appointmentDate = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(30, "div", 47)(31, "label", 48);
    \u0275\u0275text(32);
    \u0275\u0275pipe(33, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "input", 53);
    \u0275\u0275twoWayListener("ngModelChange", function AppointmentsComponent_div_32_Template_input_ngModelChange_34_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.form.appointmentTimeStr, $event) || (ctx_r2.form.appointmentTimeStr = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 47)(36, "label", 48);
    \u0275\u0275text(37);
    \u0275\u0275pipe(38, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "input", 54);
    \u0275\u0275twoWayListener("ngModelChange", function AppointmentsComponent_div_32_Template_input_ngModelChange_39_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.form.durationMinutes, $event) || (ctx_r2.form.durationMinutes = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(40, "div", 51)(41, "div", 47)(42, "label", 48);
    \u0275\u0275text(43, "Fee");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(44, "input", 54);
    \u0275\u0275twoWayListener("ngModelChange", function AppointmentsComponent_div_32_Template_input_ngModelChange_44_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.form.fee, $event) || (ctx_r2.form.fee = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275template(45, AppointmentsComponent_div_32_div_45_Template, 15, 4, "div", 55);
    \u0275\u0275elementEnd();
    \u0275\u0275template(46, AppointmentsComponent_div_32_div_46_Template, 5, 4, "div", 56)(47, AppointmentsComponent_div_32_div_47_Template, 5, 4, "div", 56);
    \u0275\u0275elementStart(48, "div", 57)(49, "label", 48);
    \u0275\u0275text(50);
    \u0275\u0275pipe(51, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "textarea", 58);
    \u0275\u0275twoWayListener("ngModelChange", function AppointmentsComponent_div_32_Template_textarea_ngModelChange_52_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r2.form.notes, $event) || (ctx_r2.form.notes = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(53, "div", 59)(54, "button", 60);
    \u0275\u0275listener("click", function AppointmentsComponent_div_32_Template_button_click_54_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.showForm = false);
    });
    \u0275\u0275text(55);
    \u0275\u0275pipe(56, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "button", 61);
    \u0275\u0275listener("click", function AppointmentsComponent_div_32_Template_button_click_57_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.save());
    });
    \u0275\u0275template(58, AppointmentsComponent_div_32_span_58_Template, 1, 0, "span", 62);
    \u0275\u0275text(59);
    \u0275\u0275pipe(60, "translate");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.editing ? \u0275\u0275pipeBind1(5, 23, "EDIT") : \u0275\u0275pipeBind1(6, 25, "ADD_NEW"));
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind1(15, 27, "PATIENTS"), " *");
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form.patientId);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.patientsList);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind1(21, 29, "DOCTORS"), " *");
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form.doctorId);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.doctorsList);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(28, 31, "APPOINTMENT_DATE"));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form.appointmentDate);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(33, 33, "APPOINTMENT_TIME"));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form.appointmentTimeStr);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(38, 35, "DURATION"));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form.durationMinutes);
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form.fee);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.editing);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.editing);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.editing);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(51, 37, "NOTES"));
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.form.notes);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(56, 39, "CANCEL"));
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.saving);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r2.saving);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(60, 41, "SAVE"), "");
  }
}
var AppointmentsComponent = class _AppointmentsComponent {
  constructor(svc, patientSvc, doctorSvc, toast) {
    this.svc = svc;
    this.patientSvc = patientSvc;
    this.doctorSvc = doctorSvc;
    this.toast = toast;
    this.appointments = [];
    this.loading = true;
    this.search = "";
    this.statusFilter = "";
    this.dateFilter = "";
    this.page = 1;
    this.totalPages = 1;
    this.showForm = false;
    this.editing = null;
    this.saving = false;
    this.form = {};
    this.patientsList = [];
    this.doctorsList = [];
  }
  ngOnInit() {
    this.loadData();
    this.loadLookups();
  }
  loadData() {
    this.loading = true;
    this.svc.getAll({ page: this.page, pageSize: 20, search: this.search }, { status: this.statusFilter, date: this.dateFilter }).subscribe({ next: (r) => {
      this.appointments = r.items;
      this.totalPages = r.totalPages;
      this.loading = false;
    }, error: () => this.loading = false });
  }
  loadLookups() {
    this.patientSvc.getAll({ pageSize: 500 }).subscribe((r) => this.patientsList = r.items);
    this.doctorSvc.getAll({ pageSize: 500 }).subscribe((r) => this.doctorsList = r.items);
  }
  openForm(a) {
    this.editing = a || null;
    this.form = a ? __spreadProps(__spreadValues({}, a), { appointmentDate: a.appointmentDate?.split("T")[0], appointmentTimeStr: a.appointmentTime?.substring(0, 5) }) : { durationMinutes: 30, fee: 0, appointmentDate: "", appointmentTimeStr: "09:00" };
    this.showForm = true;
  }
  save() {
    if (!this.form.patientId || !this.form.doctorId)
      return;
    this.saving = true;
    const data = __spreadProps(__spreadValues({}, this.form), { appointmentTime: this.form.appointmentTimeStr + ":00" });
    const obs = this.editing ? this.svc.update(this.editing.id, data) : this.svc.create(data);
    obs.subscribe({ next: () => {
      this.toast.success("Saved");
      this.showForm = false;
      this.saving = false;
      this.loadData();
    }, error: () => {
      this.toast.error("Error");
      this.saving = false;
    } });
  }
  deleteAppt(a) {
    if (confirm("Delete?"))
      this.svc.delete(a.id).subscribe({ next: () => {
        this.toast.success("Deleted");
        this.loadData();
      } });
  }
  getStatusClass(s) {
    switch (s) {
      case "Scheduled":
        return "badge-info";
      case "Confirmed":
        return "badge-primary";
      case "InProgress":
        return "badge-warning";
      case "Completed":
        return "badge-success";
      case "Cancelled":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  }
  static {
    this.\u0275fac = function AppointmentsComponent_Factory(t) {
      return new (t || _AppointmentsComponent)(\u0275\u0275directiveInject(AppointmentService), \u0275\u0275directiveInject(PatientService), \u0275\u0275directiveInject(DoctorService), \u0275\u0275directiveInject(ToastService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppointmentsComponent, selectors: [["app-appointments"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 33, vars: 16, consts: [[1, "page-header"], [1, "page-title"], [1, "btn", "btn-primary", 3, "click"], [1, "material-icons-round"], [1, "filter-bar", "mb-4"], [1, "search-bar"], [1, "material-icons-round", "search-icon"], [1, "form-control", 3, "ngModelChange", "input", "placeholder", "ngModel"], [1, "form-control", 2, "width", "auto", 3, "ngModelChange", "change", "ngModel"], ["value", ""], ["value", "Scheduled"], ["value", "Confirmed"], ["value", "Completed"], ["value", "Cancelled"], ["type", "date", 1, "form-control", 2, "width", "auto", 3, "ngModelChange", "change", "ngModel"], [1, "card", 2, "padding", "0"], ["class", "loading-container", 4, "ngIf"], ["class", "table-container", 4, "ngIf"], ["class", "pagination", 4, "ngIf"], ["class", "modal-overlay", 3, "click", 4, "ngIf"], [1, "loading-container"], [1, "spinner"], [1, "table-container"], [1, "table"], [4, "ngFor", "ngForOf"], [4, "ngIf"], [1, "badge", "badge-info"], [1, "font-semibold"], [1, "badge", 3, "ngClass"], [1, "flex", "gap-1"], [1, "btn", "btn-sm", "btn-secondary", 3, "click"], [1, "material-icons-round", 2, "font-size", "16px"], [1, "btn", "btn-sm", "btn-danger", 3, "click"], ["colspan", "8"], [1, "empty-state"], [1, "material-icons-round", "empty-icon"], [1, "empty-title"], [1, "pagination"], [1, "pagination-info"], [1, "pagination-buttons"], [1, "page-btn", 3, "click", "disabled"], [1, "modal-overlay", 3, "click"], [1, "modal", "modal-lg", 3, "click"], [1, "modal-header"], [1, "modal-title"], [1, "modal-body"], [1, "form-row"], [1, "form-group"], [1, "form-label"], [1, "form-control", 3, "ngModelChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], [1, "form-row", "mt-4"], ["type", "date", 1, "form-control", 3, "ngModelChange", "ngModel"], ["type", "time", 1, "form-control", 3, "ngModelChange", "ngModel"], ["type", "number", 1, "form-control", 3, "ngModelChange", "ngModel"], ["class", "form-group", 4, "ngIf"], ["class", "form-group mt-4", 4, "ngIf"], [1, "form-group", "mt-4"], ["rows", "2", 1, "form-control", 3, "ngModelChange", "ngModel"], [1, "modal-footer"], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["class", "spinner spinner-sm", 4, "ngIf"], [3, "value"], ["value", "InProgress"], [1, "spinner", "spinner-sm"]], template: function AppointmentsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div")(2, "h1", 1);
        \u0275\u0275text(3);
        \u0275\u0275pipe(4, "translate");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(5, "button", 2);
        \u0275\u0275listener("click", function AppointmentsComponent_Template_button_click_5_listener() {
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
        \u0275\u0275twoWayListener("ngModelChange", function AppointmentsComponent_Template_input_ngModelChange_14_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.search, $event) || (ctx.search = $event);
          return $event;
        });
        \u0275\u0275listener("input", function AppointmentsComponent_Template_input_input_14_listener() {
          return ctx.loadData();
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(16, "select", 8);
        \u0275\u0275twoWayListener("ngModelChange", function AppointmentsComponent_Template_select_ngModelChange_16_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.statusFilter, $event) || (ctx.statusFilter = $event);
          return $event;
        });
        \u0275\u0275listener("change", function AppointmentsComponent_Template_select_change_16_listener() {
          return ctx.loadData();
        });
        \u0275\u0275elementStart(17, "option", 9);
        \u0275\u0275text(18, "All Status");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(19, "option", 10);
        \u0275\u0275text(20, "Scheduled");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(21, "option", 11);
        \u0275\u0275text(22, "Confirmed");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "option", 12);
        \u0275\u0275text(24, "Completed");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(25, "option", 13);
        \u0275\u0275text(26, "Cancelled");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(27, "input", 14);
        \u0275\u0275twoWayListener("ngModelChange", function AppointmentsComponent_Template_input_ngModelChange_27_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.dateFilter, $event) || (ctx.dateFilter = $event);
          return $event;
        });
        \u0275\u0275listener("change", function AppointmentsComponent_Template_input_change_27_listener() {
          return ctx.loadData();
        });
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(28, "div", 15);
        \u0275\u0275template(29, AppointmentsComponent_div_29_Template, 2, 0, "div", 16)(30, AppointmentsComponent_div_30_Template, 29, 20, "div", 17)(31, AppointmentsComponent_div_31_Template, 10, 4, "div", 18);
        \u0275\u0275elementEnd();
        \u0275\u0275template(32, AppointmentsComponent_div_32_Template, 61, 43, "div", 19);
      }
      if (rf & 2) {
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(4, 10, "APPOINTMENTS"));
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind1(9, 12, "ADD_NEW"), "");
        \u0275\u0275advance(6);
        \u0275\u0275property("placeholder", \u0275\u0275pipeBind1(15, 14, "SEARCH"));
        \u0275\u0275twoWayProperty("ngModel", ctx.search);
        \u0275\u0275advance(2);
        \u0275\u0275twoWayProperty("ngModel", ctx.statusFilter);
        \u0275\u0275advance(11);
        \u0275\u0275twoWayProperty("ngModel", ctx.dateFilter);
        \u0275\u0275advance(2);
        \u0275\u0275property("ngIf", ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.totalPages > 1);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.showForm);
      }
    }, dependencies: [CommonModule, NgClass, NgForOf, NgIf, CurrencyPipe, DatePipe, FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel, TranslateModule, TranslatePipe], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppointmentsComponent, { className: "AppointmentsComponent", filePath: "src\\app\\features\\appointments\\appointments.component.ts", lineNumber: 69 });
})();
export {
  AppointmentsComponent
};
//# sourceMappingURL=chunk-MAOWDOOM.js.map
