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
