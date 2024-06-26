import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PortafolioComponent } from './portafolio/portafolio.component';
import { BlogComponent } from './blog/blog.component';
import { TrajectoryComponent } from './trajectory/trajectory.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'portafolio', component: PortafolioComponent},
    {path: 'blog', component: BlogComponent},
    {path: 'trajectory', component: TrajectoryComponent},
    {path: 'contact', component: ContactComponent}
];
