import { Component, OnInit } from '@angular/core';
import { TrajectoryResponse } from '../../interfaces/interfaces';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trajectory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trajectory.component.html',
  styleUrl: './trajectory.component.css'
})
export class TrajectoryComponent implements OnInit {

  trajectory: TrajectoryResponse | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getTrajectory();
  }

  getTrajectory() {
    this.userService.getTrajectory().subscribe(async (trajectory: TrajectoryResponse | undefined) => {
      if (trajectory) {
        this.trajectory = trajectory;
      }else{
        this.router.navigateByUrl('/notAvailable');
      }
    });
  }

  stylesHtml(html: string): SafeHtml {
    const styles = `
      <style>
        .trajectory-content h1 {
          font-size: 2.5rem;
          margin-top: 1rem;
          margin-bottom: 1rem;
          word-break: break-all;
        }
        .trajectory-content h2 {
          font-size: 2.2rem;
          margin-top: 1rem;
          margin-bottom: 1rem;
          word-break: break-all;
        }
        .trajectory-content h3 {
          margin-bottom: 1.8rem;
          margin-top: 1rem;
          font-size: 1.5rem;
          word-break: break-all;
        }
        .trajectory-content h4 {
          margin-bottom: 1.6rem;
          margin-top: 1rem;
          font-size: 1.2rem;
          word-break: break-all;
        }
        .trajectory-content ul, .trajectory-content ol {
          margin-bottom: 1rem;
          margin-top: 1rem;
          margin-left: 1.4rem;
          list-style: circle;
        }
        .trajectory-content li {
          margin-bottom: 0.5rem;
          font-size: 1.4rem;
          list-style-type: decimal;
          word-break: break-all;
        }
        .trajectory-content p {
          font-size: 1.4rem;
          word-break: break-all;
        }

        @media (max-width: 900px) {
          .trajectory-content h1 {
            font-size: 2.2rem;
          }
          .trajectory-content h2 {
            font-size: 2rem;
          }
          .trajectory-content h3 {
            font-size: 1.8rem;
          }
          .trajectory-content h4 {
            font-size: 1.5rem;
          }
          .trajectory-content p {
            font-size: 1.2rem;
          }
          .trajectory-content li {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 600px) {
          .trajectory-content h1 {
            font-size: 1.8rem;
          }
          .trajectory-content h2 {
            font-size: 1.6rem;
          }
          .trajectory-content h3 {
            font-size: 1.4rem;
          }
          .trajectory-content h4 {
            font-size: 1.2rem;
          }
          .trajectory-content p {
            font-size: 1rem;
          }
          .trajectory-content li {
            font-size: 1rem;
          }
        }

        @media (max-width: 400px) {
          .trajectory-content h1 {
            font-size: 1.3rem;
          }
          .trajectory-content h2 {
            font-size: 1.2rem;
          }
          .trajectory-content h3 {
            font-size: 1.1rem;
          }
          .trajectory-content h4 {
            font-size: 1rem;
          }
          .trajectory-content p {
            font-size: 0.8rem;
          }
          .trajectory-content li {
            font-size: 0.8rem;
          }
        }


      </style>
    `;

    return this.sanitizer.bypassSecurityTrustHtml(styles + html);
  }

}
