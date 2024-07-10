import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { PostResponse } from '../../interfaces/interfaces';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements OnInit{

  blogPosts: PostResponse[] = [];
  filteredPosts: PostResponse[] = [];
  tags: string[] = [];
  selectedTags: string[] = [];
  isHorizontalMap: { [key: number]: boolean } = {};
  contrastColorMap: { [key: number]: string } = {};
  latestPost: PostResponse | undefined;
  searchTerm: string = '';

  constructor(
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getBlogPosts();
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  stylesHtml(html: string): SafeHtml {
    const styles = `
      <style>
        h1 {
          color: red;
        }
      </style>
    `;

    return this.sanitizer.bypassSecurityTrustHtml(styles + html);
  }

  getBlogPosts() {
    this.userService.getPosts().subscribe(async (posts: PostResponse[] | undefined) => {
      if (posts) {
        this.blogPosts = posts;
        this.getTags();
        for (let post of posts) {
          this.isHorizontalMap[post.id] = await this.isHorizontal(post.imageUrl);
          this.contrastColorMap[post.id] = await this.getContrastColor(post.imageUrl);
        }
        this.blogPosts = this.orderedPostsByImageOrientation();
        this.getLatest();
        this.filteredPosts = this.blogPosts;
      }
    });
  }

  getLatest() {
    this.latestPost = this.blogPosts.find((post: PostResponse) => post.created === this.blogPosts.reduce((a, b) => a.created > b.created ? a : b).created);
    
    if (this.latestPost) {
      const index = this.blogPosts.indexOf(this.latestPost);
      
      if (index !== -1) {
        this.blogPosts.splice(index, 1);
        this.blogPosts.unshift(this.latestPost);
      }
    }
  }

  selectTag(tag: string) {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter((selectedTag: string) => selectedTag !== tag);
    } else {
      this.selectedTags.push(tag);
    }
    this.filterBlogPosts();
  }

  orderedPostsByImageOrientation(): PostResponse[] {
    const lastHorizontal = this.blogPosts.findIndex((post: PostResponse) => this.isHorizontalMap[post.id]);
    if (lastHorizontal !== -1) {
      const horizontal = this.blogPosts.splice(lastHorizontal, 1)[0];   
      this.blogPosts.push(horizontal);
    }
    return this.blogPosts;
  }

  getTags() {
    this.blogPosts.forEach((post: PostResponse) => {
      post.tags.forEach((tag: string) => {
        if (!this.tags.includes(tag)) {
          this.tags.push(tag);
        }
      });
    });
  }

  getContrastColor(imageUrl: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const data = imageData.data;
          let r, g, b, avg;
          let colorSum = 0;

          for (let x = 0, len = data.length; x < len; x += 4) {
            r = data[x];
            g = data[x + 1];
            b = data[x + 2];
            avg = Math.floor((r + g + b) / 3);
            colorSum += avg;
          }

          if (!r || !g || !b) {
            resolve('black');
          }
          console.log(r, g, b);
          const brightness = 0.2126 * (r ? r : 0) + 0.7152 * (g ? g : 0)  + 0.0722 * (b ? b : 0);
          console.log(brightness);
          resolve(brightness > 127.5 ? 'white' : 'black');
        }
      };
      img.src = imageUrl;
    });
  }

  isHorizontal(imageUrl: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(img.width > img.height);
      };
      img.src = imageUrl;
    });
  }

  filterBlogPosts() {
    //filter by tags
    const filteredByTags = this.blogPosts.filter((post: PostResponse) => {
      return this.selectedTags.length === 0 || post.tags.some((tag: string) => this.selectedTags.includes(tag));
    });

    //filter by search term
    if (!this.searchTerm) {
      this.filteredPosts = filteredByTags;
      return;
    }

    const filteredBySearch = filteredByTags.filter((post: PostResponse) => {
      return post.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || post.description.toLowerCase().includes(this.searchTerm.toLowerCase());
    });

    this.filteredPosts = filteredBySearch;
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'MMM d, y') || '';
  }

}
