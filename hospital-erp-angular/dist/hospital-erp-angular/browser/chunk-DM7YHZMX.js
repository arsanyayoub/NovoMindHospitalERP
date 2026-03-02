import {
  TranslateService,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-QQTHLIA4.js";

// src/app/core/services/language.service.ts
var LanguageService = class _LanguageService {
  constructor(translate) {
    this.translate = translate;
    this.LANG_KEY = "erp_language";
  }
  initLanguage() {
    const saved = localStorage.getItem(this.LANG_KEY) ?? "en";
    this.setLanguage(saved);
  }
  setLanguage(lang) {
    localStorage.setItem(this.LANG_KEY, lang);
    this.translate.use(lang);
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.body.style.fontFamily = lang === "ar" ? "'Cairo', sans-serif" : "'Inter', sans-serif";
  }
  getCurrentLang() {
    return localStorage.getItem(this.LANG_KEY) ?? "en";
  }
  isRTL() {
    return this.getCurrentLang() === "ar";
  }
  toggleLanguage() {
    this.setLanguage(this.getCurrentLang() === "en" ? "ar" : "en");
  }
  static {
    this.\u0275fac = function LanguageService_Factory(t) {
      return new (t || _LanguageService)(\u0275\u0275inject(TranslateService));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LanguageService, factory: _LanguageService.\u0275fac, providedIn: "root" });
  }
};
var ToastService = class _ToastService {
  constructor() {
    this.toasts = [];
    this.idCounter = 0;
  }
  show(message, type = "info", duration = 3500) {
    const id = ++this.idCounter;
    this.toasts.push({ message, type, id });
    setTimeout(() => this.remove(id), duration);
  }
  success(message) {
    this.show(message, "success");
  }
  error(message) {
    this.show(message, "error");
  }
  info(message) {
    this.show(message, "info");
  }
  warning(message) {
    this.show(message, "warning");
  }
  remove(id) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }
  static {
    this.\u0275fac = function ToastService_Factory(t) {
      return new (t || _ToastService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ToastService, factory: _ToastService.\u0275fac, providedIn: "root" });
  }
};

export {
  LanguageService,
  ToastService
};
//# sourceMappingURL=chunk-DM7YHZMX.js.map
