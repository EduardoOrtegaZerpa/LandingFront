import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SliderImage {
  title: string;
  imageUrl: string;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class SliderService {

  private imagesSubject = new BehaviorSubject<SliderImage[]>([]);

  constructor() { }

  setImages(images: SliderImage[]) {
    this.imagesSubject.next(images);
  }

  getImages() {
    return this.imagesSubject.asObservable();
  }

  
}
