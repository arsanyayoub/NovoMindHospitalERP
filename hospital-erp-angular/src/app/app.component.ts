import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './core/services/language.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    constructor(
        private translate: TranslateService,
        private lang: LanguageService
    ) {
        this.translate.addLangs(['en', 'ar']);
    }

    ngOnInit() {
        this.lang.initLanguage();
    }
}
