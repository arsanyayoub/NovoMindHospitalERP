import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiry: string;
    userId: number;
    username: string;
    fullName: string;
    role: string;
}

export interface LoginDto { username: string; password: string; }
export interface RegisterDto { username: string; email: string; password: string; fullName: string; phoneNumber?: string; roleId: number; }

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly API = `${environment.apiUrl}/auth`;
    private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getStoredUser());
    currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) { }

    get currentUser() { return this.currentUserSubject.value; }
    get isLoggedIn() { return !!this.currentUser; }
    get token() { return this.currentUser?.accessToken; }
    get userRole() { return this.currentUser?.role ?? ''; }
    get userId() { return this.currentUser?.userId ?? 0; }

    login(dto: LoginDto): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API}/login`, dto).pipe(
            tap(res => {
                localStorage.setItem('auth_user', JSON.stringify(res));
                this.currentUserSubject.next(res);
            })
        );
    }

    register(dto: RegisterDto): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API}/register`, dto).pipe(
            tap(res => {
                localStorage.setItem('auth_user', JSON.stringify(res));
                this.currentUserSubject.next(res);
            })
        );
    }

    refreshToken(): Observable<AuthResponse> {
        const refreshToken = this.currentUser?.refreshToken;
        return this.http.post<AuthResponse>(`${this.API}/refresh-token`, { refreshToken }).pipe(
            tap(res => {
                localStorage.setItem('auth_user', JSON.stringify(res));
                this.currentUserSubject.next(res);
            })
        );
    }

    logout(): void {
        this.http.post(`${this.API}/logout`, {}).subscribe();
        localStorage.removeItem('auth_user');
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth/login']);
    }

    hasRole(role: string): boolean {
        return this.currentUser?.role === role;
    }

    private getStoredUser(): AuthResponse | null {
        try {
            const stored = localStorage.getItem('auth_user');
            if (!stored) return null;
            const user: AuthResponse = JSON.parse(stored);
            if (new Date(user.expiry) <= new Date()) { localStorage.removeItem('auth_user'); return null; }
            return user;
        } catch { return null; }
    }
}
