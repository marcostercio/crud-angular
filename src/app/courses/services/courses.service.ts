import { Injectable } from '@angular/core';

import { Course } from '../model/course';
import { HttpClient } from '@angular/common/http';
import { first, tap, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  // private readonly API = '/assets/courses.json';
  //private readonly API = 'http://localhost:8080/api/courses';
  private readonly API = 'api/courses';

  constructor(private httpClient:HttpClient) { }

  list() {
   // return
     // { _id: '1', name: 'Angular', category: 'front-end' }
      return this.httpClient.get<Course[]>(this.API)
      .pipe(
        first(),
       // delay(5000),
        tap(courses => console.log(courses))
      );


  }
}
