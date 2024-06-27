import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginService } from '../login/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  constructor(private loginService: LoginService) {}

  loggedIn: boolean = false;

  ngOnInit(): void {
    this.loginService.loginStatus$().subscribe((loggedIn: boolean) => {
        this.loggedIn = loggedIn;
    });
  }
}
