import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post, PostResponse, Project, ProjectResponse, Trajectory, TrajectoryResponse } from '../../interfaces/interfaces';
import { Observable, catchError, map, of } from 'rxjs';
import { NotificationService } from '../notification/notification.service';
import { config } from '../shared/config';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  private API_URL = config.API_URL();

  createPost(post: Post): Observable<PostResponse | undefined> {

    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('description', post.description);
    formData.append('content', post.content);
    formData.append('minutesToRead', post.minutesToRead.toString());
    if (post.image) {
      formData.append('image', post.image, post.image.name);
    }

    return this.http.post<PostResponse>(`${this.API_URL}/blog`, formData).pipe(
      map((response: PostResponse) => {
        this.notificationService.show('Post created', false);
        return response;
      }),
      catchError((error) => {
        this.notificationService.show('Error creating post', true);
        return of(undefined);
      })
    );
  }

  createProject(project: Project): Observable<ProjectResponse | undefined> {
      
      const formData = new FormData();
      formData.append('title', project.title);
      formData.append('description', project.description);
      formData.append('content', project.content);
      formData.append('githubUrl', project.githubUrl);
      if (project.image) {
        formData.append('image', project.image, project.image.name);
      } else {
        formData.append('image', '');
      }
  
      return this.http.post<ProjectResponse>(`${this.API_URL}/project`, formData).pipe(
        map((response: ProjectResponse) => {
          this.notificationService.show('Project created', false);
          return response;
        }),
        catchError((error) => {
          this.notificationService.show('Error creating project', true);
          return of(undefined);
        })
      );
    }

    editPost(post: Post, id: number): Observable<PostResponse | undefined> {
      const formData = new FormData();
      formData.append('title', post.title);
      formData.append('description', post.description);
      formData.append('content', post.content);
      formData.append('minutesToRead', post.minutesToRead.toString());
      formData.append('tags', post.tags.join(','));
      if (post.image) {
        formData.append('image', post.image, post.image.name);
      }
  
      return this.http.put<any>(`${this.API_URL}/blog/${id}`, formData).pipe(
        map((response: any) => {
          this.notificationService.show('Post edited', false);
          return response;
        }),
        catchError((error) => {
          this.notificationService.show('Error editing post', true);
          return of(undefined);
        })
      );
    }

    editProject(project: Project, id: number): Observable<ProjectResponse | undefined> {
      const formData = new FormData();
      formData.append('title', project.title);
      formData.append('description', project.description);
      formData.append('content', project.content);
      formData.append('githubUrl', project.githubUrl);
      if (project.image) {
        formData.append('image', project.image, project.image.name);
      }
  
      return this.http.put<any>(`${this.API_URL}/project/${id}`, formData).pipe(
        map((response: any) => {
          this.notificationService.show('Project edited', false);
          return response;
        }),
        catchError((error) => {
          this.notificationService.show('Error editing project', true);
          return of(undefined);
        })
      );
    }

    editTrajectory(Trajectory: Trajectory, id: number): Observable<TrajectoryResponse | undefined> {
      const formData = new FormData();
      formData.append('content', Trajectory.content);
      return this.http.put<any>(`${this.API_URL}/trajectory/${id}`, formData).pipe(
        map((response: any) => {
          this.notificationService.show('Trajectory edited', false);
          return response.trajectory as TrajectoryResponse;
        }),
        catchError((error) => {
          this.notificationService.show('Error editing trajectory', true);
          return of(undefined);
        })
      );
    }

    deletePost(id: number): Observable<boolean> {
      return this.http.delete<any>(`${this.API_URL}/blog/${id}`).pipe(
        map((response: any) => {
          this.notificationService.show('Post deleted', false);
          return true;
        }),
        catchError((error) => {
          this.notificationService.show('Error deleting post', true);
          return of(false);
        })
      );
    }

    deleteProject(id: number): Observable<boolean> {
      return this.http.delete<any>(`${this.API_URL}/project/${id}`).pipe(
        map((response: any) => {
          this.notificationService.show('Project deleted', false);
          return true;
        }),
        catchError((error) => {
          this.notificationService.show('Error deleting project', true);
          return of(false);
        })
      );
    }

}
