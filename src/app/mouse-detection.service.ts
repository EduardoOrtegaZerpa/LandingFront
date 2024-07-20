import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MouseDetectionService {
  private mouseDetectedSubject = new BehaviorSubject<boolean>(false);
  mouseDetected$ = this.mouseDetectedSubject.asObservable();

  constructor() {
    this.detectMouse();
  }

  private detectMouse(): void {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    this.mouseDetectedSubject.next(mediaQuery.matches);

    mediaQuery.addEventListener('change', (event) => {
      this.mouseDetectedSubject.next(event.matches);
    });
  }
}