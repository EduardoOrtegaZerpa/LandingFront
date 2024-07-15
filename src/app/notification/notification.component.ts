import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from './notification.service';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {

  isShown: boolean = false;
  message: string = '';
  animateOut: boolean = false;
  isError: boolean = false;
  isLoading: boolean = false;
  private timeoutRef: any;

  constructor(
    private notificationService: NotificationService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.loadingService.isLoading$().subscribe(isLoading => {
      this.isLoading = isLoading;
      this.checkNotification();
    });

    this.checkNotification();

    this.notificationService.getNotificationMessage().subscribe(message => {
      this.message = message;
    });

    this.notificationService.isError().subscribe(isError => {
      this.isError = isError;
    });
  }

  ngOnDestroy(): void {
    this.clearTimeout();
  }

  checkNotification() {
    this.notificationService.isNotificationShown().subscribe(isShown => {
      if (isShown && !this.isLoading) {
        this.isShown = true;
        this.animateOut = false;
        this.clearTimeout();
        this.timeoutRef = setTimeout(() => {
          this.animateOut = true;
          this.timeoutRef = setTimeout(() => {
            this.close();
          }, 500);
        }, 3000);
      }
    });
  }

  close() {
    this.clearTimeout();
    this.isShown = false;
    this.animateOut = false;
    this.notificationService.hide();
  }

  private clearTimeout() {
    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef);
      this.timeoutRef = null;
    }
  }
}
