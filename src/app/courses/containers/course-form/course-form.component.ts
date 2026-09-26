import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { CoursesService } from '../../services/courses.service';
import { Course } from '../../model/course';
import { Lesson } from '../../model/lesson';
import { FormUtilsService } from '../../../shared/form/form-utils.service';

@Component({
  selector: 'app-course-form',
  standalone:false,
  styleUrl: '././course-form.component.scss',
  templateUrl: '././course-form.component.html',
})
export class CourseFormComponent implements OnInit {

  form !: FormGroup;

  constructor(private formBuilder: NonNullableFormBuilder,
    private service: CoursesService,

    private route: ActivatedRoute,
    public formUtils: FormUtilsService
    ) {

    }


    // form = this.form = this.formBuilder.group({
    //   _id:[''],
    //   name: ['', [Validators.required,
    //      Validators.minLength(5),
    //      Validators.maxLength(100)]],
    //   category: ['', [Validators.required]]

    // });
  ngOnInit(): void {
    const course: Course = this.route.snapshot.data['course'];
    this.form = this.formBuilder.group({
      _id: [course._id],
      name: [course.name, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]],
      category: [course.category, [Validators.required]],
      lessons:this.formBuilder.array(this.retrieveLesson(course),Validators.required)
    });


    // this.form.setValue({
    //   _id:course._id,
    //   name:course.name,
    //   category:course.category
    // });
    // console.log(course);


  }


  private retrieveLesson(course: Course){
    const lessons = [];
    if(course?.lessons){
      course.lessons.forEach(lesson => lessons.push(this.createLesson(lesson)));
    } else{
      lessons.push(this.createLesson());
    }
    return lessons;
  }

  private createLesson(lesson : Lesson = {id:'' , name:'', youtubeUrl:''}){
    return this.formBuilder.group({
      id: [lesson.id],
      name: [lesson.name, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]],
      youtubeUrl: [lesson.youtubeUrl,[
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(31)
      ]]
    });
  }


  getLessonsFormArray(){
    return (<UntypedFormArray>this.form.get('lessons'));
  }

  addNewLesson(){
    const lessons = this.form.get('lessons') as UntypedFormArray;
    lessons.push(this.createLesson());
  }

  removeLesson(index: number){
    const lessons = this.form.get('lessons') as UntypedFormArray;
    lessons.removeAt(index);
  }

  onSubmit() {
    if (this.form.valid) {
      this.service.save(this.form.value)
        .subscribe(result => this.formUtils.onSucces(), error => this.formUtils.onError());
    }
    else{
      this.formUtils.validateAllFormFields(this.form);
    }

  }




}
