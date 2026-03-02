import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface NotificationDto {
    id: number;
    title: string;
    message: string;
    notificationType: string;
    isRead: boolean;
    createdDate: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private readonly API = `${environment.apiUrl}/notifications`;
    private hubConnection!: signalR.HubConnection;

    private notificationsSubject = new BehaviorSubject<NotificationDto[]>([]);
    notifications$ = this.notificationsSubject.asObservable();

    private unreadCountSubject = new BehaviorSubject<number>(0);
    unreadCount$ = this.unreadCountSubject.asObservable();

    constructor(private http: HttpClient, private auth: AuthService) { }

    startConnection(): void {
        if (!this.auth.token) return;

        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.hubUrl}/hubs/notifications`, {
                accessTokenFactory: () => this.auth.token ?? ''
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        this.hubConnection.on('ReceiveNotification', (notification: any) => {
            const current = this.notificationsSubject.value;
            this.notificationsSubject.next([notification, ...current]);
            this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
        });

        this.hubConnection.on('AppointmentCreated', (data: any) => console.log('Appointment created:', data));
        this.hubConnection.on('InvoiceCreated', (data: any) => console.log('Invoice created:', data));
        this.hubConnection.on('PaymentReceived', (data: any) => console.log('Payment received:', data));
        this.hubConnection.on('StockUpdated', (data: any) => console.log('Stock updated:', data));

        this.hubConnection.start().catch(err => console.error('SignalR error:', err));
    }

    stopConnection(): void {
        this.hubConnection?.stop();
    }

    loadNotifications(): Observable<NotificationDto[]> {
        return this.http.get<NotificationDto[]>(this.API).pipe(
            tap(n => this.notificationsSubject.next(n))
        );
    }

    getUnreadCount(): Observable<{ count: number }> {
        return this.http.get<{ count: number }>(`${this.API}/unread-count`).pipe(
            tap(r => this.unreadCountSubject.next(r.count))
        );
    }

    markAsRead(id: number): Observable<any> {
        return this.http.post(`${this.API}/${id}/read`, {}).pipe(
            tap(() => {
                const updated = this.notificationsSubject.value.map(n =>
                    n.id === id ? { ...n, isRead: true } : n
                );
                this.notificationsSubject.next(updated);
                const unread = updated.filter(n => !n.isRead).length;
                this.unreadCountSubject.next(unread);
            })
        );
    }

    markAllAsRead(): Observable<any> {
        return this.http.post(`${this.API}/read-all`, {}).pipe(
            tap(() => {
                const updated = this.notificationsSubject.value.map(n => ({ ...n, isRead: true }));
                this.notificationsSubject.next(updated);
                this.unreadCountSubject.next(0);
            })
        );
    }
}
