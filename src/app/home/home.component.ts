import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { PostResponse } from '../../interfaces/interfaces';
import { UserService } from '../user.service';
import { DatePipe } from '@angular/common';
import { MouseDetectionService } from '../mouse-detection.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardComponent, CommonModule],
  providers: [DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  post: PostResponse | undefined;
  hasMouse: boolean = false;


  constructor(private userService: UserService, private mouseDetectionService: MouseDetectionService) { }

  ngOnInit(): void {
    this.userService.getLatestPost().subscribe((post) => {
      this.post = post;
    });

    this.mouseDetectionService.mouseDetected$.subscribe((hasMouse) => {
      console.log('Mouse detected:', hasMouse);
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
      content: 'Con más de 5 años inmerso en el fascinante mundo de la programación, he tenido el privilegio de explorar una amplia gama de entornos, desde el dinámico desarrollo web y la creación de software, hasta la intrincada ingeniería de sistemas en Linux y el desafiante lenguaje C. Mi trayectoria refleja una pasión por la excelencia tanto en los aspectos más visibles como en los más profundos de la programación.'
    },
    {
      title: 'Cualidades',
      content: 'Soy un líder colaborativo, organizado y comprometido con el éxito del equipo. Mi habilidad para comunicarme eficazmente y trabajar en armonía con otros asegura que alcancemos nuestras metas de manera efectiva y eficiente.'
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

}
