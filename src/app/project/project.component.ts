import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { ProjectResponse } from '../../interfaces/interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit {

  projectId: string | null = null;
  project: ProjectResponse | undefined = undefined;

  constructor(    
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private userService: UserService) { }
  
  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.getProjectById();
  }

  getProjectById() {
    if (!this.projectId) return;

    this.userService.getProject(this.projectId).subscribe(async (project: ProjectResponse | undefined) => {
      if (project) {
        this.project = project;
      }else{
        this.router.navigateByUrl('/notAvailable');
      }
    });
  }

  stylesHtml(html: string): SafeHtml {
    const styles = `
      <style>
        .post-content h1 {
          font-size: 3rem;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        .post-content h2 {
          font-size: 2.5rem;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        .post-content h3 {
          margin-bottom: 2rem;
          margin-top: 1rem;
          font-size: x-large;
        }
        .post-content h4 {
          margin-bottom: 1.8rem;
          margin-top: 1rem;
          font-size: large;
        }
        .post-content ul {
          margin-bottom: 1rem;
          margin-top: 1rem;
          list-style: circle;
          margin-left: 1.5rem;
        }
        .post-content ol {
          margin-bottom: 1rem;
          margin-top: 1rem;
          list-style-type: decimal;
        }
        .post-content li {
          margin-bottom: 0.5rem;
          list-style-type: decimal;
          font-size: 1.4rem;
        }
        .post-content p {
          font-size: 1.4rem;
          overflow-wrap: break-word;
        }

        
      </style>
    `;

    return this.sanitizer.bypassSecurityTrustHtml(styles + html);
  }
}
