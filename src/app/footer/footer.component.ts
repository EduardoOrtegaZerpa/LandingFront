import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  constructor (
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  suscribe(email: string) {
    const isValid = this.validateEmail(email);

    if (isValid) {
      this.userService.subscribeToNewsletter(email).subscribe({
        next: (response) => {
          if (response) {
            this.notificationService.show('You have subscribed to the newsletter', false);
          } else {
            this.notificationService.show('Error when subscribing to the newsletter', true);
          }
        },
        error: (error) => {
          this.notificationService.show('Error when subscribing to the newsletter', true);
        }
      });
    } else {
      this.notificationService.show('Invalid email', true);
    }
  }

  validateEmail(email: string): boolean {  
    const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return pattern.test(email);
  }
}
