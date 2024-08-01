import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { PostResponse } from '../../interfaces/interfaces';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {

  blogId: string | null = null;
  post: PostResponse | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.blogId = this.route.snapshot.paramMap.get('id');
    this.getBlogPostById();

  }

  getBlogPostById() {
    if (!this.blogId) return;

    this.userService.getPost(this.blogId).subscribe(async (post: PostResponse | undefined) => {
      if (post) {
        this.post = post;
      }else{
        this.router.navigateByUrl('/notAvailable');
      }
    });
  }

  stylesHtml(html: string): SafeHtml {
    const styles = `
      <style>
        .post-content h1 {
          font-size: 2.5rem;
          margin-top: 1rem;
          word-break: break-word;
        }
        .post-content h2 {
          font-size: 2.2rem;
          margin-top: 0.8rem;
          word-break: break-word;
        }
        .post-content h3 {
          margin-top: 0.8rem;
          font-size: 1.5rem;
          word-break: break-word;  
        }
        .post-content h4 {
          margin-top: 0.5rem;
          font-size: 1.2rem;
          word-break: break-word;
        }
        .post-content ul, .post-content ol {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-left: 1.4rem;
          list-style: circle;
          margin-top: 0.5rem;
        }
        .post-content li {
          font-size: 1.4rem;
          list-style-type: decimal;
          word-break: break-word;
        }
        .post-content p {
          margin-top: 0.5rem;
          font-size: 1.4rem;
          word-break: break-word;
        }

        @media (max-width: 900px) {
          .post-content h1 {
            font-size: 2.2rem;
          }
          .post-content h2 {
            font-size: 2rem;
          }
          .post-content h3 {
            font-size: 1.8rem;
          }
          .post-content h4 {
            font-size: 1.5rem;
          }
          .post-content p {
            font-size: 1.2rem;
          }
          .post-content li {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 600px) {
          .post-content h1 {
            font-size: 1.8rem;
          }
          .post-content h2 {
            font-size: 1.6rem;
          }
          .post-content h3 {
            font-size: 1.5rem;
          }
          .post-content h4 {
            font-size: 1.3rem;
          }
          .post-content p {
            font-size: 1.2rem;
          }
          .post-content li {
            font-size: 1.2rem;
          }
        }

      </style>
    `;

    return this.sanitizer.bypassSecurityTrustHtml(styles + html);
  }

}
