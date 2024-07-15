import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationSubject = new BehaviorSubject<boolean>(false);
  private notificationMessageSubject = new BehaviorSubject<string>('');
  private isErrorSubject = new BehaviorSubject<boolean>(false);

  constructor() { }

  show(message: string, error: boolean) {
    this.notificationMessageSubject.next(message);
    this.notificationSubject.next(true);
    this.isErrorSubject.next(error);
  }

  hide() {
    this.notificationSubject.next(false);
  }

  isNotificationShown() {
    return this.notificationSubject.asObservable();
  }

  getNotificationMessage() {
    return this.notificationMessageSubject.asObservable();
  }

  isError() {
    return this.isErrorSubject.asObservable();
  }

}
