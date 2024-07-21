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
        .project-content h1 {
          font-size: 2.5rem;
          margin-top: 1rem;
          margin-bottom: 1rem;
          word-break: break-all;
        }
        .project-content h2 {
          font-size: 2.2rem;
          margin-top: 1rem;
          margin-bottom: 1rem;
          word-break: break-all;
        }
        .project-content h3 {
          margin-bottom: 1.8rem;
          margin-top: 1rem;
          font-size: 1.5rem;
          word-break: break-all;
        }
        .project-content h4 {
          margin-bottom: 1.6rem;
          margin-top: 1rem;
          font-size: 1.2rem;
          word-break: break-all;
        }
        .project-content ul, .project-content ol {
          margin-bottom: 1rem;
          margin-top: 1rem;
          margin-left: 1.4rem;
          list-style: circle;
        }
        .project-content li {
          margin-bottom: 0.5rem;
          font-size: 1.4rem;
          list-style-type: decimal;
          word-break: break-all;
        }
        .project-content p {
          font-size: 1.4rem;
          word-break: break-all;
        }

        @media (max-width: 900px) {
          .project-content h1 {
            font-size: 2.2rem;
          }
          .project-content h2 {
            font-size: 2rem;
          }
          .project-content h3 {
            font-size: 1.8rem;
          }
          .project-content h4 {
            font-size: 1.5rem;
          }
          .project-content p {
            font-size: 1.2rem;
          }
          .project-content li {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 600px) {
          .project-content h1 {
            font-size: 1.8rem;
          }
          .project-content h2 {
            font-size: 1.6rem;
          }
          .project-content h3 {
            font-size: 1.4rem;
          }
          .project-content h4 {
            font-size: 1.2rem;
          }
          .project-content p {
            font-size: 1rem;
          }
          .project-content li {
            font-size: 1rem;
          }
        }

        @media (max-width: 400px) {
          .project-content h1 {
            font-size: 1.3rem;
          }
          .project-content h2 {
            font-size: 1.2rem;
          }
          .project-content h3 {
            font-size: 1.1rem;
          }
          .project-content h4 {
            font-size: 1rem;
          }
          .project-content p {
            font-size: 0.8rem;
          }
          .project-content li {
            font-size: 0.8rem;
          }
        }


      </style>
    `;

    return this.sanitizer.bypassSecurityTrustHtml(styles + html);
  }
}
