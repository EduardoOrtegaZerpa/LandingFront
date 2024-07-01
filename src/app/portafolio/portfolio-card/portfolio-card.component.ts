import { Component, Input, OnInit } from '@angular/core';
import { ProjectResponse } from '../../../interfaces/interfaces';
import { format, parseISO } from 'date-fns';


@Component({
  selector: 'app-portfolio-card',
  standalone: true,
  imports: [],
  templateUrl: './portfolio-card.component.html',
  styleUrl: './portfolio-card.component.css'
})
export class PortfolioCardComponent implements OnInit{

  @Input() project: ProjectResponse | undefined;
  formattedDate: string = '';

  constructor() {}

  ngOnInit(): void {
    if (this.project) {
      this.formattedDate = format(parseISO(this.project.created), 'MMM dd, yyyy');
    }
  }

}
