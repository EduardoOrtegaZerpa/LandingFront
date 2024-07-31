import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { PostResponse, ProjectResponse } from '../../interfaces/interfaces';
import { UserService } from '../user.service';
import { DatePipe } from '@angular/common';
import { MouseDetectionService } from '../mouse-detection.service';
import { Router } from '@angular/router';
import { SliderComponent } from '../slider/slider.component';
import { SliderService, SliderImage } from '../slider/slider.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardComponent, CommonModule, SliderComponent],
  providers: [DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  post: PostResponse | undefined;
  hasMouse: boolean = false;
  projects: ProjectResponse[] = [];


  constructor(
    private userService: UserService, 
    private router: Router,
    private sliderService: SliderService,
    private mouseDetectionService: MouseDetectionService) { }

  ngOnInit(): void {
    this.userService.getLatestPost().subscribe((post) => {
      this.post = post;
    });

    this.userService.getProjects().subscribe((projects) => {
      if (projects) {
        this.projects = projects;
        const sliderImages: SliderImage[] = projects.map((project) => ({ id: project.id, title: project.title, imageUrl: project.imageUrl }));
        this.sliderService.setImages(sliderImages);
      }
    });

    this.mouseDetectionService.mouseDetected$.subscribe((hasMouse) => {
      this.hasMouse = hasMouse;
    });
  }

  personalInfos = [
    {
      title: 'University Studies',
      content: 'Graduated in Computer Science Engineering from the University of Las Palmas de Gran Canaria.'
    },
    {
      title: 'Trajectory',
      content: 'With over 5 years involved in the programming world, I have had the opportunity to explore a wide range of environments, from dynamic web development and software creation to intricate system engineering in Linux and the challenging C language. Throughout my career, I have shown a passion for excellence in both the most visible and the deeper aspects of programming.'
    },
    {
      title: 'Qualities',
      content: 'With leadership and organizational skills, as well as a commitment to team success. My ability to communicate effectively and work harmoniously with others ensures that we achieve our goals effectively and efficiently.'
    }
  ];
  

  activeIndex = 4;
  interval: any;


  setActive(index: number): void {
    this.activeIndex = index;
  }

  resetActive(): void {
    this.activeIndex = 4;
  }

  goToPost(id: number) {
    this.router.navigate([`/blog/${id}`]);
  }

  goToContact() {
    this.router.navigate(['/contact']);
  }


}
