import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const addToken = (request: HttpRequest<unknown>, token: string) =>
        request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

    if (auth.token) req = addToken(req, auth.token);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && auth.currentUser?.refreshToken) {
                return auth.refreshToken().pipe(
                    switchMap(res => next(addToken(req, res.accessToken))),
                    catchError(() => { auth.logout(); return throwError(() => error); })
                );
            }
            if (error.status === 401) { auth.logout(); router.navigate(['/auth/login']); }
            return throwError(() => error);
        })
    );
};
