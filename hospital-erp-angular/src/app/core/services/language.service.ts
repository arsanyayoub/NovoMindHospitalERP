import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
    private readonly LANG_KEY = 'erp_language';

    constructor(private translate: TranslateService) { }

    initLanguage(): void {
        const saved = localStorage.getItem(this.LANG_KEY) ?? 'en';
        this.setLanguage(saved);
    }

    setLanguage(lang: string): void {
        localStorage.setItem(this.LANG_KEY, lang);
        this.translate.use(lang);
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.body.style.fontFamily = lang === 'ar'
            ? "'Cairo', sans-serif"
            : "'Inter', sans-serif";
    }

    getCurrentLang(): string {
        return localStorage.getItem(this.LANG_KEY) ?? 'en';
    }

    isRTL(): boolean {
        return this.getCurrentLang() === 'ar';
    }

    toggleLanguage(): void {
        this.setLanguage(this.getCurrentLang() === 'en' ? 'ar' : 'en');
    }
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    toasts: Array<{ message: string; type: string; id: number }> = [];
    private idCounter = 0;

    show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3500): void {
        const id = ++this.idCounter;
        this.toasts.push({ message, type, id });
        setTimeout(() => this.remove(id), duration);
    }

    success(message: string): void { this.show(message, 'success'); }
    error(message: string): void { this.show(message, 'error'); }
    info(message: string): void { this.show(message, 'info'); }
    warning(message: string): void { this.show(message, 'warning'); }

    remove(id: number): void {
        this.toasts = this.toasts.filter(t => t.id !== id);
    }
}
