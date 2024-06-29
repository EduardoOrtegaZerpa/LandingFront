import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post, PostResponse } from '../../interfaces/interfaces';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private http: HttpClient
  ) {}

  createPost(post: Post): Observable<PostResponse | undefined> {
    return this.http.post<PostResponse>('http://localhost:8080/blog', post).pipe(
      map((response: PostResponse) => {
        return response;
      }),
      catchError((error) => {
        console.error('Error creating post:', error);
        return of(undefined);
      })
    );
  }


}
