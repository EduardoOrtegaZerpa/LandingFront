import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginService } from './login/login.service';
import { Observable } from 'rxjs';
import { LoadingService } from './loading/loading.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { NotificationComponent } from './notification/notification.component';
import { NotificationService } from './notification/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    TranslateModule, 
    HeaderComponent,
    CommonModule,
    RouterModule, 
    RouterLink, 
    RouterLinkActive,
    LoadingComponent,
    NotificationComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit{
  title = 'eduortza';
  isLoaderVisible: boolean = false;
  isLoading: Observable<boolean> = new Observable<boolean>();

  constructor(
    private translate: TranslateService, 
    private loginService: LoginService,
    public loadingService: LoadingService,
    public notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    this.translate.setDefaultLang('es');
    this.translate.use('es');
  }

  ngOnInit() {
    this.isLoading = this.loadingService.isLoading$();
    this.loginService.checkValidToken().subscribe();

    this.isLoading.subscribe(() => {
      this.cdr.detectChanges();
    }); 
  }

  ngAfterViewInit() {
    this.loadingService.isLoading$().subscribe((isLoading: boolean) => {
      this.isLoaderVisible = isLoading;
    });
  }


  
}
