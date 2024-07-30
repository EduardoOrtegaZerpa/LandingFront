import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostResponse, ProjectResponse, TrajectoryResponse } from '../interfaces/interfaces';
import { Observable, map, catchError, of } from 'rxjs';
import { config } from './shared/config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private API_URL = config.API_URL();

  getPosts(): Observable<PostResponse[] | undefined> {
    return this.http.get<PostResponse[]>(`${this.API_URL}/blog`).pipe(
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
    return this.http.get<PostResponse>(`${this.API_URL}/blog/${id}`).pipe(
      map((response: PostResponse) => {
        return response;
      }),
      catchError((error) => {
        console.error('Error getting post:', error);
        return of(undefined);
      })
    );
  }

  getLatestPost(): Observable<PostResponse | undefined> {
    return this.http.get<PostResponse[]>(`${this.API_URL}/blog`).pipe(
      map((response: PostResponse[]) => {
        return response.reduce((prev, current) => (prev.created > current.created) ? prev : current);
      }),
      catchError((error) => {
        console.error('Error getting posts:', error);
        return of(undefined);
      })
    );
  }

  getProject(id: string): Observable<ProjectResponse | undefined> {
    return this.http.get<ProjectResponse>(`${this.API_URL}/project/${id}`).pipe(
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
    return this.http.get<ProjectResponse[]>(`${this.API_URL}/project`).pipe(
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
    return this.http.get<TrajectoryResponse>(`${this.API_URL}/trajectory`).pipe(
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
    return this.http.post<any>(`${this.API_URL}/subscribe`, email).pipe(
      map(() => {
        return true;
      }),
      catchError((error) => {
        return of(false);
      })
    );
  }

  sendContactMail(from: string, subject: string, text: string, name: string): Observable<boolean> {
    return this.http.post<any>(`${this.API_URL}/sendMail`, { from, subject, text, name }).pipe(
      map(() => {
        return true;
      }),
      catchError((error) => {
        return of(false);
      })
    );
  }
}
