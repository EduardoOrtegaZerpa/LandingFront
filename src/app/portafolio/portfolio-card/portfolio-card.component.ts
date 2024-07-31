import { Component, Input, OnInit } from '@angular/core';
import { ProjectResponse } from '../../../interfaces/interfaces';
import { format, parseISO } from 'date-fns';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-portfolio-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio-card.component.html',
  styleUrl: './portfolio-card.component.css'
})
export class PortfolioCardComponent implements OnInit{

  @Input() project: ProjectResponse | undefined;
  formattedDate: string = '';
  imageLoaded: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (this.project) {
      this.formattedDate = format(parseISO(this.project.created), 'MMM dd, yyyy');
    }
  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  onImageError() {
    this.imageLoaded = false;
  }

}
