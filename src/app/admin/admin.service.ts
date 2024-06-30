import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post, PostResponse, Project, ProjectResponse } from '../../interfaces/interfaces';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private http: HttpClient
  ) {}

  createPost(post: Post): Observable<PostResponse | undefined> {

    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('description', post.description);
    formData.append('content', post.content);
    formData.append('minutesToRead', post.minutesToRead.toString());
    if (post.image) {
      formData.append('image', post.image, post.image.name);
    }

    return this.http.post<PostResponse>('http://localhost:8080/blog', formData).pipe(
      map((response: PostResponse) => {
        return response;
      }),
      catchError((error) => {
        console.error('Error creating post:', error);
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
  
      return this.http.post<ProjectResponse>('http://localhost:8080/project', formData).pipe(
        map((response: ProjectResponse) => {
          return response;
        }),
        catchError((error) => {
          console.error('Error creating project:', error);
          return of(undefined);
        })
      );
    }

    getPosts(): Observable<PostResponse[] | undefined> {
      return this.http.get<PostResponse[]>('http://localhost:8080/blog').pipe(
        map((response: PostResponse[]) => {
          return response;
        }),
        catchError((error) => {
          console.error('Error getting posts:', error);
          return of(undefined);
        })
      );
    }

    getProjects(): Observable<ProjectResponse[] | undefined> {
      return this.http.get<ProjectResponse[]>('http://localhost:8080/project').pipe(
        map((response: ProjectResponse[]) => {
          return response;
        }),
        catchError((error) => {
          console.error('Error getting projects:', error);
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
  
      return this.http.put<any>(`http://localhost:8080/blog/${id}`, formData).pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error) => {
          console.error('Error editing post:', error);
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
  
      return this.http.put<any>(`http://localhost:8080/project/${id}`, formData).pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error) => {
          console.error('Error editing project:', error);
          return of(undefined);
        })
      );
    }


}
