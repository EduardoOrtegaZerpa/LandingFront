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
      title: 'Estudios Universitarios',
      content: 'Graduado en Ingeniería Informática en la Universidad de Las Palmas de Gran Canaria.'
    },
    {
      title: 'Recorrido',
      content: 'Con más de 5 años involucrado en el mundo de la programación, he tenido la capacidad de explorar una amplia gama de entornos, desde el dinámico desarrollo web y la creación de software, hasta la intrincada ingeniería de sistemas en Linux y el desafiante lenguaje C. A lo largo de mi trayectoria he mostrado una pasión por la excelencia tanto en los aspectos más visibles como en los más profundos de la programación.'
    },
    {
      title: 'Cualidades',
      content: 'Con capacidad de liderazgo y organización, además de ser comprometido con el éxito del equipo. Mi habilidad para comunicarme eficazmente y trabajar en armonía con otros asegura que alcancemos nuestras metas de manera efectiva y eficiente.'
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
