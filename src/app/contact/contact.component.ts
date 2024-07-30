import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { NotificationService } from '../notification/notification.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private router: Router, 
    private userService: UserService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get subject() {
    return this.contactForm.get('subject');
  }

  get message() {
    return this.contactForm.get('message');
  }

  sendMail() {
    const from = this.contactForm.get('email')!.value;
    const subject = this.contactForm.get('subject')!.value;
    const message = this.contactForm.get('message')!.value;
    const name = this.contactForm.get('name')!.value;
    this.userService.sendContactMail(from, subject, message, name).subscribe((response) => {
      if (response) {
        this.notificationService.show('Email sent successfully', false);
        this.resetInputs();
      } else {
        this.notificationService.show('Error when sending the email', true);
      }
    });
  }

  resetInputs() {
    this.contactForm.reset();
  }
}
