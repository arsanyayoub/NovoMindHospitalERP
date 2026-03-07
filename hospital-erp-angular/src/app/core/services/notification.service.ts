import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { ToastService } from './language.service';

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

    private newMessageSubject = new Subject<any>();
    newMessage$ = this.newMessageSubject.asObservable();

    private stockUpdateSubject = new Subject<any>();
    stockUpdate$ = this.stockUpdateSubject.asObservable();

    private labUpdateSubject = new Subject<any>();
    labUpdate$ = this.labUpdateSubject.asObservable();

    private radiologyUpdateSubject = new Subject<any>();
    radiologyUpdate$ = this.radiologyUpdateSubject.asObservable();

    private erUpdateSubject = new Subject<any>();
    erUpdate$ = this.erUpdateSubject.asObservable();

    constructor(
        private http: HttpClient,
        private auth: AuthService,
        private toast: ToastService
    ) { }

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
            this.toast.info(notification.title + ': ' + notification.message);

            if (notification.notificationType === 'Lab') this.labUpdateSubject.next(notification);
            if (notification.notificationType === 'Radiology') this.radiologyUpdateSubject.next(notification);
            if (notification.notificationType === 'ER') this.erUpdateSubject.next(notification);
        });

        this.hubConnection.on('ReceiveMessage', (message: any) => {
            this.toast.info('New message from: ' + message.senderName);
            this.newMessageSubject.next(message);
        });

        this.hubConnection.on('AppointmentCreated', (data: any) => {
            this.toast.info('New Appointment: ' + data.patientName);
        });

        this.hubConnection.on('InvoiceCreated', (data: any) => {
            this.toast.success('Invoice Generated: #' + data.id);
        });

        this.hubConnection.on('PaymentReceived', (data: any) => {
            this.toast.success('Payment Received: ' + data.amount + ' ' + (data.currency || 'USD'));
        });

        this.hubConnection.on('StockUpdated', (data: any) => {
            if (data.quantity <= data.reorderLevel) {
                this.toast.error('Inventory Alert: ' + data.itemName + ' is low on stock!');
            } else {
                this.toast.info('Inventory Updated: ' + data.itemName);
            }
            this.stockUpdateSubject.next(data);
        });

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
