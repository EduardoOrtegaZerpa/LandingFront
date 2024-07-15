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
          font-size: 3rem;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        .trajectory-content h2 {
          font-size: 2.5rem;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        .trajectory-content h3 {
          margin-bottom: 2rem;
          margin-top: 1rem;
          font-size: x-large;
        }
        .trajectory-content h4 {
          margin-bottom: 1.8rem;
          margin-top: 1rem;
          font-size: large;
        }
        .trajectory-content ul {
          margin-bottom: 1rem;
          margin-top: 1rem;
          list-style: circle;
          margin-left: 1.5rem;
        }
        .trajectory-content ol {
          margin-bottom: 1rem;
          margin-top: 1rem;
          list-style-type: decimal;
        }
        .trajectory-content li {
          margin-bottom: 0.5rem;
          list-style-type: decimal;
          font-size: 1.4rem;
        }
        .trajectory-content p {
          font-size: 1.4rem;
          overflow-wrap: break-word;
        }

        
      </style>
    `;

    return this.sanitizer.bypassSecurityTrustHtml(styles + html);
  }

}
