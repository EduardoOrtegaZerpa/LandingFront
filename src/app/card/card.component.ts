import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() iconClass: string | undefined;
  @Input() title: string | undefined;
  @Input() description: string | undefined;

  isHovered: boolean = false;

  toggleHover() {
    this.isHovered = !this.isHovered;
  }
}
