import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  constructor (private userService: UserService) {}

  suscribe(email: string) {
    const isValid = this.validateEmail(email);

    if (isValid) {
      this.userService.subscribeToNewsletter(email).subscribe({
        next: (response) => {
          if (response) {
          } else {

          }
        },
        error: (error) => {
        }
      });
    } else {
      console.log('Email is not valid');
    }
  }

  validateEmail(email: string): boolean {  
    const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return pattern.test(email);
  }
}
