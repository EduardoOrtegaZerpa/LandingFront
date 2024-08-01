import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { PostResponse } from '../../interfaces/interfaces';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent, LoadingComponent],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  blogPosts: PostResponse[] = [];
  filteredPosts: PostResponse[] = [];
  tags: string[] = [];
  selectedTags: string[] = [];
  isHorizontalMap: { [key: number]: boolean } = {};
  contrastColorMap: { [key: number]: string } = {};
  latestPost: PostResponse | undefined;
  searchTerm: string = '';
  loading: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getBlogPosts();
  }

  async getBlogPosts() {
    this.loading = true;
    try {
      const posts = await this.userService.getPosts().toPromise();
      if (posts) {

        this.blogPosts = posts;
        if (this.blogPosts.length === 0) {
          this.router.navigate(['/notAvailable']);
        }

        this.getTags();
  
        const promises = posts.map(async (post) => {
          try {
            const { isHorizontal, contrastColor } = await this.processImage(post.imageUrl);
            this.isHorizontalMap[post.id] = isHorizontal;
            this.contrastColorMap[post.id] = contrastColor;
          } catch (error) {
            console.error(`Error processing image for post ${post.id}:`, error);
            this.isHorizontalMap[post.id] = false;
            this.contrastColorMap[post.id] = 'white';
          }
        });
  
        await Promise.all(promises);
  
        this.blogPosts = this.orderedPostsByImageOrientation();
        this.getLatest();
        this.filteredPosts = this.blogPosts;
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      this.loading = false;
    }
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

  async getImageData(imageUrl: string): Promise<HTMLImageElement> {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    return new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject('Error loading image');
      img.src = imageUrl;
    });
  }

  async processImage(imageUrl: string): Promise<{ isHorizontal: boolean; contrastColor: string }> {
    const img = await this.getImageData(imageUrl);
  
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Cannot get canvas context');
    }
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;
    
    let r, g, b, luminance;
    let luminanceSum = 0;
    
    for (let x = 0; x < data.length; x += 4) {
      r = data[x];
      g = data[x + 1];
      b = data[x + 2];
      luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      luminanceSum += luminance;
    }
    
    const averageLuminance = luminanceSum / (data.length / 4);
    const contrastColor = averageLuminance < 127.5 ? 'black' : 'white';
    
    const isHorizontal = img.width / img.height > 1.2;
    
    return { isHorizontal, contrastColor };
  }

  selectTag(tag: string) {
    const tagIndex = this.selectedTags.indexOf(tag);
    if (tagIndex > -1) {
      this.selectedTags.splice(tagIndex, 1);
    } else {
      this.selectedTags.push(tag);
    }
    this.filterBlogPosts();
  }

  orderedPostsByImageOrientation(): PostResponse[] {
    const horizontalPostIndex = this.blogPosts.findIndex(post => this.isHorizontalMap[post.id]);
    if (horizontalPostIndex !== -1) {
      const [horizontalPost] = this.blogPosts.splice(horizontalPostIndex, 1);
      this.blogPosts.push(horizontalPost);
    }
    return this.blogPosts;
  }

  goToPost(id: number) {
    this.router.navigate([`/blog/${id}`]);
  }

  getTags() {
    const tagsSet = new Set<string>();
    this.blogPosts.forEach(post => post.tags.forEach(tag => tagsSet.add(tag)));
    this.tags = Array.from(tagsSet);
  }

  filterBlogPosts() {
    const filteredByTags = this.blogPosts.filter(post =>
      this.selectedTags.length === 0 || post.tags.some(tag => this.selectedTags.includes(tag))
    );

    if (this.searchTerm) {
      this.filteredPosts = filteredByTags.filter(post =>
        post.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredPosts = filteredByTags;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'MMM d, y') || '';
  }
}
