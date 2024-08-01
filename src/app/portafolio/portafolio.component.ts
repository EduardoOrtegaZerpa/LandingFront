import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioCardComponent } from './portfolio-card/portfolio-card.component';
import { ProjectResponse } from '../../interfaces/interfaces';
import { UserService } from '../user.service';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-portafolio',
  standalone: true,
  imports: [CommonModule, FormsModule, PortfolioCardComponent],
  templateUrl: './portafolio.component.html',
  styleUrl: './portafolio.component.css'
})
export class PortafolioComponent implements OnInit{

  projects: ProjectResponse[] = [];
  filteredProjects: ProjectResponse[] = [];
  searchTerm: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getProjects();
    if (this.projects.length === 0) {
      this.router.navigate(['/notAvailable']);
    }
    this.filteredProjects = [...this.projects];
  }

  filterProjects() {
    if (!this.searchTerm.trim()) {
      this.filteredProjects = [...this.projects];
    } else {
      const lowerSearchTerm = this.searchTerm.toLowerCase();
      this.filteredProjects = this.projects.filter(project =>
        project.title.toLowerCase().includes(lowerSearchTerm) ||
        project.description.toLowerCase().includes(lowerSearchTerm)
      );
    }
  }
  async getProjects(): Promise<void> {
    try {
      const response = await lastValueFrom(this.userService.getProjects());
      if (response) {
        this.projects = response;
      } else {
        console.error('Error getting posts');
      }
    } catch (error) {
      console.error('Error getting posts', error);
    }
  }

  goToProject(id: number) {
    this.router.navigateByUrl(`/projects/${id}`);
  }
}
