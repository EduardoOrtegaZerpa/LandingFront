import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { SliderService, SliderImage } from './slider.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MouseDetectionService } from '../mouse-detection.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-slider',
  standalone: true,
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
  imports: [CommonModule]
})

export class SliderComponent implements OnInit, OnDestroy {
  images: SliderImage[] = [];
  slideIndex: number = 0;
  autoSlide: boolean = true;
  private slideInterval: any;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private sliderService: SliderService,
    private mouseDetectionService: MouseDetectionService,
    private router: Router) { }

  ngOnInit(): void {
    this.sliderService.getImages().subscribe((images) => {
      this.images = images;
      this.startAutoSlide();
    });

    // this.subscriptions.add(this.mouseDetectionService.mouseDetected$.subscribe((hasMouse) => {
    //   this.autoSlide = !hasMouse;
    //   if (this.autoSlide) {
    //     this.startAutoSlide();
    //   } else {
    //     this.stopAutoSlide();
    //   }
    // }));
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.autoSlide = false;
    this.stopAutoSlide();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.autoSlide = true;
    this.startAutoSlide();
  }

  plusSlides(n: number) {
    this.slideIndex += n;
    if (this.slideIndex < 0) {
      this.slideIndex = this.images.length - 1;
    } else if (this.slideIndex >= this.images.length) {
      this.slideIndex = 0;
    }
  }

  goToProject(id: number) {
    this.router.navigateByUrl(`/projects/${id}`);
  }

  private startAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    this.slideInterval = setInterval(() => {
      if (this.autoSlide) {
        this.plusSlides(1);
      }
    }, 5000);
  }

  private stopAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  ngOnDestroy() {
    this.stopAutoSlide();
    this.subscriptions.unsubscribe();
  }
}
