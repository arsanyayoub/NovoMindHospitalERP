import {
  AuthService,
  Router
} from "./chunk-JQD4BPPZ.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-GVBL3DCA.js";
import {
  LanguageService
} from "./chunk-DM7YHZMX.js";
import {
  CommonModule,
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
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-QQTHLIA4.js";

// src/app/features/auth/login/login.component.ts
function LoginComponent_div_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27)(1, "span", 21);
    \u0275\u0275text(2, "error");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.error, " ");
  }
}
function LoginComponent_span_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 28);
  }
}
function LoginComponent_span_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "translate");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(2, 1, "LOGIN"));
  }
}
var LoginComponent = class _LoginComponent {
  constructor(auth, router, langService) {
    this.auth = auth;
    this.router = router;
    this.langService = langService;
    this.username = "";
    this.password = "";
    this.error = "";
    this.loading = false;
    this.showPassword = false;
    if (auth.isLoggedIn)
      this.router.navigate(["/dashboard"]);
  }
  login() {
    if (!this.username || !this.password) {
      this.error = "Please enter username and password";
      return;
    }
    this.loading = true;
    this.error = "";
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(["/dashboard"]);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || "Invalid credentials";
      }
    });
  }
  static {
    this.\u0275fac = function LoginComponent_Factory(t) {
      return new (t || _LoginComponent)(\u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(LanguageService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 47, vars: 21, consts: [[1, "login-page"], [1, "login-bg"], [1, "bg-gradient"], [1, "bg-shapes"], [1, "shape", "shape1"], [1, "shape", "shape2"], [1, "shape", "shape3"], [1, "login-card", "animate-slide-up"], [1, "login-header"], [1, "logo-wrapper"], [1, "material-icons-round", "logo-icon"], [1, "text-muted"], [1, "login-form", 3, "ngSubmit"], ["class", "alert alert-danger", 4, "ngIf"], [1, "form-group"], [1, "form-label"], [1, "input-with-icon"], [1, "material-icons-round", "input-icon"], ["type", "text", "name", "username", "placeholder", "admin", "required", "", "autocomplete", "username", 1, "form-control", 3, "ngModelChange", "ngModel"], ["name", "password", "placeholder", "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", "required", "", "autocomplete", "current-password", 1, "form-control", 3, "ngModelChange", "type", "ngModel"], ["type", "button", 1, "toggle-pass", 3, "click"], [1, "material-icons-round"], ["type", "submit", 1, "btn", "btn-primary", "btn-lg", "w-full", 3, "disabled"], ["class", "spinner spinner-sm", 4, "ngIf"], [4, "ngIf"], [1, "login-footer"], [1, "lang-toggle", 3, "click"], [1, "alert", "alert-danger"], [1, "spinner", "spinner-sm"]], template: function LoginComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
        \u0275\u0275element(2, "div", 2);
        \u0275\u0275elementStart(3, "div", 3);
        \u0275\u0275element(4, "div", 4)(5, "div", 5)(6, "div", 6);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(7, "div", 7)(8, "div", 8)(9, "div", 9)(10, "span", 10);
        \u0275\u0275text(11, "local_hospital");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(12, "h1");
        \u0275\u0275text(13);
        \u0275\u0275pipe(14, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "p", 11);
        \u0275\u0275text(16);
        \u0275\u0275pipe(17, "translate");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(18, "form", 12);
        \u0275\u0275listener("ngSubmit", function LoginComponent_Template_form_ngSubmit_18_listener() {
          return ctx.login();
        });
        \u0275\u0275template(19, LoginComponent_div_19_Template, 4, 1, "div", 13);
        \u0275\u0275elementStart(20, "div", 14)(21, "label", 15);
        \u0275\u0275text(22);
        \u0275\u0275pipe(23, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(24, "div", 16)(25, "span", 17);
        \u0275\u0275text(26, "person");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(27, "input", 18);
        \u0275\u0275twoWayListener("ngModelChange", function LoginComponent_Template_input_ngModelChange_27_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.username, $event) || (ctx.username = $event);
          return $event;
        });
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(28, "div", 14)(29, "label", 15);
        \u0275\u0275text(30);
        \u0275\u0275pipe(31, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(32, "div", 16)(33, "span", 17);
        \u0275\u0275text(34, "lock");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(35, "input", 19);
        \u0275\u0275twoWayListener("ngModelChange", function LoginComponent_Template_input_ngModelChange_35_listener($event) {
          \u0275\u0275twoWayBindingSet(ctx.password, $event) || (ctx.password = $event);
          return $event;
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(36, "button", 20);
        \u0275\u0275listener("click", function LoginComponent_Template_button_click_36_listener() {
          return ctx.showPassword = !ctx.showPassword;
        });
        \u0275\u0275elementStart(37, "span", 21);
        \u0275\u0275text(38);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(39, "button", 22);
        \u0275\u0275template(40, LoginComponent_span_40_Template, 1, 0, "span", 23)(41, LoginComponent_span_41_Template, 3, 3, "span", 24);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(42, "div", 25)(43, "button", 26);
        \u0275\u0275listener("click", function LoginComponent_Template_button_click_43_listener() {
          return ctx.langService.toggleLanguage();
        });
        \u0275\u0275elementStart(44, "span", 21);
        \u0275\u0275text(45, "translate");
        \u0275\u0275elementEnd();
        \u0275\u0275text(46);
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(13);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(14, 13, "APP_NAME"));
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(17, 15, "LOGIN"));
        \u0275\u0275advance(3);
        \u0275\u0275property("ngIf", ctx.error);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(23, 17, "USERNAME"));
        \u0275\u0275advance(5);
        \u0275\u0275twoWayProperty("ngModel", ctx.username);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(31, 19, "PASSWORD"));
        \u0275\u0275advance(5);
        \u0275\u0275property("type", ctx.showPassword ? "text" : "password");
        \u0275\u0275twoWayProperty("ngModel", ctx.password);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate(ctx.showPassword ? "visibility_off" : "visibility");
        \u0275\u0275advance();
        \u0275\u0275property("disabled", ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.loading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.loading);
        \u0275\u0275advance(5);
        \u0275\u0275textInterpolate1(" ", ctx.langService.getCurrentLang() === "en" ? "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" : "English", " ");
      }
    }, dependencies: [CommonModule, NgIf, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, NgModel, NgForm, TranslateModule, TranslatePipe], styles: ["\n\n.login-page[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n  position: relative;\n  overflow: hidden;\n}\n.login-bg[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 0;\n}\n.bg-gradient[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background:\n    radial-gradient(\n      ellipse at 30% 20%,\n      rgba(99, 102, 241, 0.15) 0%,\n      transparent 50%),\n    radial-gradient(\n      ellipse at 70% 80%,\n      rgba(6, 182, 212, 0.1) 0%,\n      transparent 50%),\n    var(--bg-body);\n}\n.bg-shapes[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  overflow: hidden;\n}\n.shape[_ngcontent-%COMP%] {\n  position: absolute;\n  border-radius: 50%;\n  opacity: 0.03;\n  background:\n    linear-gradient(\n      135deg,\n      var(--primary),\n      var(--accent));\n}\n.shape1[_ngcontent-%COMP%] {\n  width: 400px;\n  height: 400px;\n  top: -100px;\n  right: -100px;\n  animation: _ngcontent-%COMP%_float 12s ease-in-out infinite;\n}\n.shape2[_ngcontent-%COMP%] {\n  width: 300px;\n  height: 300px;\n  bottom: -50px;\n  left: -50px;\n  animation: _ngcontent-%COMP%_float 15s ease-in-out infinite reverse;\n}\n.shape3[_ngcontent-%COMP%] {\n  width: 200px;\n  height: 200px;\n  top: 40%;\n  left: 60%;\n  animation: _ngcontent-%COMP%_float 10s ease-in-out infinite;\n}\n@keyframes _ngcontent-%COMP%_float {\n  0%, 100% {\n    transform: translate(0, 0) rotate(0deg);\n  }\n  33% {\n    transform: translate(30px, -30px) rotate(120deg);\n  }\n  66% {\n    transform: translate(-20px, 20px) rotate(240deg);\n  }\n}\n.login-card[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  background: rgba(26, 29, 46, 0.8);\n  -webkit-backdrop-filter: blur(20px);\n  backdrop-filter: blur(20px);\n  border: 1px solid var(--border);\n  border-radius: 24px;\n  padding: 48px 40px;\n  width: 100%;\n  max-width: 440px;\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);\n}\n.login-header[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 36px;\n}\n.logo-wrapper[_ngcontent-%COMP%] {\n  width: 64px;\n  height: 64px;\n  margin: 0 auto 16px;\n  background:\n    linear-gradient(\n      135deg,\n      var(--primary),\n      var(--accent));\n  border-radius: 18px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);\n}\n.logo-icon[_ngcontent-%COMP%] {\n  font-size: 32px;\n  color: white;\n}\n.login-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 1.3rem;\n  font-weight: 800;\n  margin-bottom: 4px;\n}\n.login-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n}\n.login-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n.input-with-icon[_ngcontent-%COMP%] {\n  position: relative;\n}\n.input-with-icon[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%] {\n  padding-inline-start: 42px;\n  padding-inline-end: 42px;\n}\n.input-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 50%;\n  inset-inline-start: 12px;\n  transform: translateY(-50%);\n  color: var(--text-muted);\n  font-size: 20px;\n}\n.toggle-pass[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 50%;\n  inset-inline-end: 10px;\n  transform: translateY(-50%);\n  background: none;\n  border: none;\n  color: var(--text-muted);\n  cursor: pointer;\n  padding: 2px;\n}\n.toggle-pass[_ngcontent-%COMP%]:hover {\n  color: var(--text-primary);\n}\n.login-footer[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-top: 24px;\n}\n.lang-toggle[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  background: none;\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  padding: 6px 14px;\n  color: var(--text-secondary);\n  cursor: pointer;\n  font-family: var(--font-family);\n  font-size: 0.8rem;\n  transition: var(--transition);\n}\n.lang-toggle[_ngcontent-%COMP%]:hover {\n  border-color: var(--primary);\n  color: var(--primary-light);\n}\n.lang-toggle[_ngcontent-%COMP%]   .material-icons-round[_ngcontent-%COMP%] {\n  font-size: 16px;\n}\n.w-full[_ngcontent-%COMP%] {\n  width: 100%;\n  justify-content: center;\n}\n/*# sourceMappingURL=login.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src\\app\\features\\auth\\login\\login.component.ts", lineNumber: 143 });
})();
export {
  LoginComponent
};
//# sourceMappingURL=chunk-STJBVK3I.js.map
