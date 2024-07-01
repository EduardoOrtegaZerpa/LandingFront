import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostResponse, ProjectResponse } from '../interfaces/interfaces';
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
}
