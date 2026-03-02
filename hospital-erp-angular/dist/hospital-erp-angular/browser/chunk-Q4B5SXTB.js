import {
  DashboardService
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
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵpipeBind4,
  ɵɵproperty,
  ɵɵpropertyInterpolate1,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-QQTHLIA4.js";

// src/app/features/dashboard/dashboard.component.ts
function DashboardComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "div", 3);
    \u0275\u0275elementEnd();
  }
}
function DashboardComponent_div_1_div_100_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32)(1, "div", 33);
    \u0275\u0275element(2, "div", 34);
    \u0275\u0275pipe(3, "currency");
    \u0275\u0275element(4, "div", 35);
    \u0275\u0275pipe(5, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 36);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const m_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("height", ctx_r1.getBarHeight(m_r1.revenue), "%");
    \u0275\u0275propertyInterpolate1("title", "Revenue: ", \u0275\u0275pipeBind1(3, 9, m_r1.revenue), "");
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("height", ctx_r1.getBarHeight(m_r1.expenses), "%");
    \u0275\u0275propertyInterpolate1("title", "Expenses: ", \u0275\u0275pipeBind1(5, 11, m_r1.expenses), "");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(m_r1.month);
  }
}
function DashboardComponent_div_1_div_113_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 37)(1, "div", 38)(2, "span", 11);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 39)(5, "div", 40);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 41);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "date");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const a_r3 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("ngClass", a_r3.type.toLowerCase());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", a_r3.type === "Appointment" ? "event" : "payment", " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(a_r3.description);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(9, 4, a_r3.date, "short"));
  }
}
function DashboardComponent_div_1_div_114_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42)(1, "span", 43);
    \u0275\u0275text(2, "history");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 44);
    \u0275\u0275text(4, "No recent activity");
    \u0275\u0275elementEnd()();
  }
}
function DashboardComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "div", 5)(2, "div")(3, "h1", 6);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 7);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "date");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 8)(10, "div", 9)(11, "div", 10)(12, "span", 11);
    \u0275\u0275text(13, "personal_injury");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div")(15, "div", 12);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 13);
    \u0275\u0275text(18);
    \u0275\u0275pipe(19, "translate");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "div", 9)(21, "div", 14)(22, "span", 11);
    \u0275\u0275text(23, "calendar_month");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div")(25, "div", 12);
    \u0275\u0275text(26);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "div", 13);
    \u0275\u0275text(28);
    \u0275\u0275pipe(29, "translate");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(30, "div", 9)(31, "div", 15)(32, "span", 11);
    \u0275\u0275text(33, "payments");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(34, "div")(35, "div", 12);
    \u0275\u0275text(36);
    \u0275\u0275pipe(37, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "div", 13);
    \u0275\u0275text(39);
    \u0275\u0275pipe(40, "translate");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(41, "div", 9)(42, "div", 16)(43, "span", 11);
    \u0275\u0275text(44, "inventory");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(45, "div")(46, "div", 12);
    \u0275\u0275text(47);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "div", 13);
    \u0275\u0275text(49);
    \u0275\u0275pipe(50, "translate");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(51, "div", 17)(52, "div", 9)(53, "div", 10)(54, "span", 11);
    \u0275\u0275text(55, "medical_services");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(56, "div")(57, "div", 12);
    \u0275\u0275text(58);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "div", 13);
    \u0275\u0275text(60);
    \u0275\u0275pipe(61, "translate");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(62, "div", 9)(63, "div", 14)(64, "span", 11);
    \u0275\u0275text(65, "people");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(66, "div")(67, "div", 12);
    \u0275\u0275text(68);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(69, "div", 13);
    \u0275\u0275text(70);
    \u0275\u0275pipe(71, "translate");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(72, "div", 9)(73, "div", 18)(74, "span", 11);
    \u0275\u0275text(75, "pending_actions");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(76, "div")(77, "div", 12);
    \u0275\u0275text(78);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(79, "div", 13);
    \u0275\u0275text(80);
    \u0275\u0275pipe(81, "translate");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(82, "div", 9)(83, "div", 15)(84, "span", 11);
    \u0275\u0275text(85, "account_balance_wallet");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(86, "div")(87, "div", 12);
    \u0275\u0275text(88);
    \u0275\u0275pipe(89, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(90, "div", 13);
    \u0275\u0275text(91);
    \u0275\u0275pipe(92, "translate");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(93, "div", 19)(94, "div", 20)(95, "h3", 21);
    \u0275\u0275text(96);
    \u0275\u0275pipe(97, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(98, "div", 22)(99, "div", 23);
    \u0275\u0275template(100, DashboardComponent_div_1_div_100_Template, 8, 13, "div", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(101, "div", 25)(102, "span", 26);
    \u0275\u0275element(103, "span", 27);
    \u0275\u0275text(104, " Revenue");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(105, "span", 26);
    \u0275\u0275element(106, "span", 28);
    \u0275\u0275text(107, " Expenses");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(108, "div", 20)(109, "h3", 21);
    \u0275\u0275text(110);
    \u0275\u0275pipe(111, "translate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(112, "div", 29);
    \u0275\u0275template(113, DashboardComponent_div_1_div_113_Template, 10, 7, "div", 30)(114, DashboardComponent_div_1_div_114_Template, 5, 0, "div", 31);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(5, 23, "DASHBOARD"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(8, 25, ctx_r1.today, "fullDate"));
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate((ctx_r1.data == null ? null : ctx_r1.data.totalPatients) || 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(19, 28, "TOTAL_PATIENTS"));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate((ctx_r1.data == null ? null : ctx_r1.data.todayAppointments) || 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(29, 30, "TODAY_APPOINTMENTS"));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind4(37, 32, ctx_r1.data == null ? null : ctx_r1.data.monthlyRevenue, "USD", "symbol", "1.0-0"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(40, 37, "MONTHLY_REVENUE"));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate((ctx_r1.data == null ? null : ctx_r1.data.lowStockItems) || 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(50, 39, "LOW_STOCK_ITEMS"));
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate((ctx_r1.data == null ? null : ctx_r1.data.totalDoctors) || 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(61, 41, "DOCTORS"));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate((ctx_r1.data == null ? null : ctx_r1.data.totalEmployees) || 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(71, 43, "EMPLOYEES"));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate((ctx_r1.data == null ? null : ctx_r1.data.pendingInvoices) || 0);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(81, 45, "PENDING"));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind4(89, 47, ctx_r1.data == null ? null : ctx_r1.data.totalRevenue, "USD", "symbol", "1.0-0"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(92, 52, "TOTAL"));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(97, 54, "MONTHLY_REVENUE"));
    \u0275\u0275advance(4);
    \u0275\u0275property("ngForOf", ctx_r1.data == null ? null : ctx_r1.data.monthlyRevenues);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(111, 56, "RECENT_ACTIVITY"));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r1.data == null ? null : ctx_r1.data.recentActivities);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !(ctx_r1.data == null ? null : ctx_r1.data.recentActivities == null ? null : ctx_r1.data.recentActivities.length));
  }
}
var DashboardComponent = class _DashboardComponent {
  constructor(dashboardService) {
    this.dashboardService = dashboardService;
    this.data = null;
    this.loading = true;
    this.today = /* @__PURE__ */ new Date();
    this.maxRevenue = 1;
  }
  ngOnInit() {
    this.dashboardService.get().subscribe({
      next: (data) => {
        this.data = data;
        this.maxRevenue = Math.max(1, ...data.monthlyRevenues.map((m) => Math.max(m.revenue, m.expenses)));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  getBarHeight(value) {
    return Math.max(3, value / this.maxRevenue * 90);
  }
  static {
    this.\u0275fac = function DashboardComponent_Factory(t) {
      return new (t || _DashboardComponent)(\u0275\u0275directiveInject(DashboardService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DashboardComponent, selectors: [["app-dashboard"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 2, vars: 2, consts: [["class", "loading-container", 4, "ngIf"], ["class", "animate-fade-in", 4, "ngIf"], [1, "loading-container"], [1, "spinner"], [1, "animate-fade-in"], [1, "page-header"], [1, "page-title"], [1, "page-subtitle"], [1, "stats-grid"], [1, "stat-card"], [1, "stat-icon", "primary"], [1, "material-icons-round"], [1, "stat-value"], [1, "stat-label"], [1, "stat-icon", "accent"], [1, "stat-icon", "success"], [1, "stat-icon", "warning"], [1, "stats-grid", "mt-4"], [1, "stat-icon", "danger"], [1, "dashboard-grid", "mt-6"], [1, "card"], [1, "mb-4"], [1, "chart-container"], [1, "chart-bars"], ["class", "chart-bar-group", 4, "ngFor", "ngForOf"], [1, "chart-legend"], [1, "legend-item"], [1, "legend-dot", "revenue"], [1, "legend-dot", "expenses"], [1, "activity-list"], ["class", "activity-item", 4, "ngFor", "ngForOf"], ["class", "empty-state", 4, "ngIf"], [1, "chart-bar-group"], [1, "bar-wrapper"], [1, "bar", "revenue", 3, "title"], [1, "bar", "expenses", 3, "title"], [1, "bar-label"], [1, "activity-item"], [1, "activity-icon", 3, "ngClass"], [1, "activity-content"], [1, "activity-desc"], [1, "activity-time"], [1, "empty-state"], [1, "material-icons-round", "empty-icon"], [1, "empty-text"]], template: function DashboardComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275template(0, DashboardComponent_div_0_Template, 2, 0, "div", 0)(1, DashboardComponent_div_1_Template, 115, 58, "div", 1);
      }
      if (rf & 2) {
        \u0275\u0275property("ngIf", ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading);
      }
    }, dependencies: [CommonModule, NgClass, NgForOf, NgIf, CurrencyPipe, DatePipe, TranslateModule, TranslatePipe], styles: ["\n\n.stats-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));\n  gap: 16px;\n}\n.dashboard-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1.5fr 1fr;\n  gap: 20px;\n}\n@media (max-width: 900px) {\n  .dashboard-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.chart-container[_ngcontent-%COMP%] {\n  padding: 8px 0;\n}\n.chart-bars[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-end;\n  justify-content: space-between;\n  height: 200px;\n  gap: 6px;\n  padding-bottom: 28px;\n  position: relative;\n}\n.chart-bar-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  flex: 1;\n  height: 100%;\n}\n.bar-wrapper[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  align-items: flex-end;\n  gap: 3px;\n  width: 100%;\n  justify-content: center;\n}\n.bar[_ngcontent-%COMP%] {\n  width: 14px;\n  border-radius: 4px 4px 0 0;\n  transition: height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);\n  min-height: 4px;\n  cursor: pointer;\n}\n.bar.revenue[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      var(--primary-light),\n      var(--primary));\n}\n.bar.expenses[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      var(--accent),\n      var(--accent-dark));\n}\n.bar[_ngcontent-%COMP%]:hover {\n  opacity: 0.8;\n  transform: scaleY(1.02);\n}\n.bar-label[_ngcontent-%COMP%] {\n  font-size: 0.65rem;\n  color: var(--text-muted);\n  margin-top: 6px;\n}\n.chart-legend[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  gap: 20px;\n  margin-top: 12px;\n}\n.legend-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 0.8rem;\n  color: var(--text-secondary);\n}\n.legend-dot[_ngcontent-%COMP%] {\n  width: 10px;\n  height: 10px;\n  border-radius: 3px;\n}\n.legend-dot.revenue[_ngcontent-%COMP%] {\n  background: var(--primary);\n}\n.legend-dot.expenses[_ngcontent-%COMP%] {\n  background: var(--accent);\n}\n.activity-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.activity-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 10px;\n  border-radius: 10px;\n  transition: background 0.15s;\n}\n.activity-item[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.03);\n}\n.activity-icon[_ngcontent-%COMP%] {\n  width: 38px;\n  height: 38px;\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  font-size: 18px;\n}\n.activity-icon.appointment[_ngcontent-%COMP%] {\n  background: rgba(59, 130, 246, 0.12);\n  color: var(--info);\n}\n.activity-icon.payment[_ngcontent-%COMP%] {\n  background: rgba(16, 185, 129, 0.12);\n  color: var(--success);\n}\n.activity-icon[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 18px;\n}\n.activity-desc[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: var(--text-primary);\n}\n.activity-time[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: var(--text-muted);\n  margin-top: 2px;\n}\n/*# sourceMappingURL=dashboard.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DashboardComponent, { className: "DashboardComponent", filePath: "src\\app\\features\\dashboard\\dashboard.component.ts", lineNumber: 165 });
})();
export {
  DashboardComponent
};
//# sourceMappingURL=chunk-Q4B5SXTB.js.map
