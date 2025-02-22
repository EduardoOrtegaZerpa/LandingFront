import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PortafolioComponent } from './portafolio/portafolio.component';
import { BlogComponent } from './blog/blog.component';
import { TrajectoryComponent } from './trajectory/trajectory.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { NotAvailablePageComponent } from './not-available-page/not-available-page.component';
import { AdminComponent } from './admin/admin.component';
import { adminGuard } from './admin.guard';
import { CreatePostComponent } from './admin/create-post/create-post.component';
import { EditPostComponent } from './admin/edit-post/edit-post.component';
import { CreateProjectComponent } from './admin/create-project/create-project.component';
import { EditProjectComponent } from './admin/edit-project/edit-project.component';
import { PostComponent } from './post/post.component';
import { ProjectComponent } from './project/project.component';
import { EditTrajectoryComponent } from './admin/edit-trajectory/edit-trajectory.component';
import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'projects', component: PortafolioComponent},
    {path: 'projects/:id', component: ProjectComponent},
    {path: 'blog', component: BlogComponent},
    {path: 'blog/:id', component: PostComponent},
    {path: 'trajectory', component: TrajectoryComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'unsubscribe', component: UnsubscribeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'notAvailable', component: NotAvailablePageComponent},
    {path: 'admin', component: AdminComponent, canActivate: [adminGuard], children: [
        {path: 'create-post', component: CreatePostComponent},
        {path: 'edit-post', component: EditPostComponent},
        {path: 'create-repository', component: CreateProjectComponent},
        {path: 'edit-repository', component: EditProjectComponent},
        {path: 'edit-trajectory', component: EditTrajectoryComponent},
        {path: '', redirectTo: 'create-post', pathMatch: 'full'}
    ]},
    {path: '**', redirectTo: '/notAvailable'}
];
