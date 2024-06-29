import { Component } from '@angular/core';
import { AdminCardComponent } from './admin-card/admin-card.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AdminCardComponent, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {


  public static imageChecker(file: File): boolean {
    if (file && this.isImageFile(file)) {
      return true;
    } else {
      return false;
    }
  }

  public static isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }


}
