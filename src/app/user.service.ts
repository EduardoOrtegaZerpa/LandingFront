import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostResponse, ProjectResponse, TrajectoryResponse } from '../interfaces/interfaces';
import { Observable, map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

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

  getPost(id: string): Observable<PostResponse | undefined> {
    return this.http.get<PostResponse>(`http://localhost:8080/blog/${id}`).pipe(
      map((response: PostResponse) => {
        return response;
      }),
      catchError((error) => {
        console.error('Error getting post:', error);
        return of(undefined);
      })
    );
  }

  getProject(id: string): Observable<ProjectResponse | undefined> {
    return this.http.get<ProjectResponse>(`http://localhost:8080/project/${id}`).pipe(
      map((response: ProjectResponse) => {
        return response;
      }),
      catchError((error) => {
        console.error('Error getting project:', error);
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

  getTrajectory(): Observable<TrajectoryResponse | undefined> {
    return this.http.get<TrajectoryResponse>('http://localhost:8080/trajectory').pipe(
      map((response: TrajectoryResponse) => {
        return response;
      }),
      catchError((error) => {
        console.error('Error getting trajectory:', error);
        return of(undefined);
      })
    );
  }

  subscribeToNewsletter(email: string): Observable<boolean> {
    return this.http.post<any>('http://localhost:8080/subscribe', email).pipe(
      map(() => {
        return true;
      }),
      catchError((error) => {
        return of(false);
      })
    );
  }
}
