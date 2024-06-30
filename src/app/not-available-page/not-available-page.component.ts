import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-not-available-page',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './not-available-page.component.html',
  styleUrl: './not-available-page.component.css'
})
export class NotAvailablePageComponent {

}
