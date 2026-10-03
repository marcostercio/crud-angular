import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';

import { ErrorDialogComponent } from '../../../shared/components/error-dialog/error-dialog.component';
import { Course } from '../../model/course';
import { CoursesService } from '../../services/courses.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CoursePage } from '../../model/course-page';

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CoursesComponent  {
 courses$: Observable <CoursePage> | null = null ;

 @ViewChild(MatPaginator) paginator!: MatPaginator ;

pageIndex = 0;
pageSize = 10;
//  coursesService:CoursesService;

 constructor(
  private coursesService: CoursesService,
  private dialog : MatDialog,
  private router : Router,
  private route:ActivatedRoute,
  private snackBar: MatSnackBar
  ){
  //this.courses = []
  // this.coursesService = new CoursesService();
  this.refresh();


  //this.coursesService.list().subscribe(courses => this.courses = courses);

 }

  refresh(pageEvent: PageEvent = {length:0, pageIndex:0, pageSize:10}) {
    this.courses$ = this.coursesService.list(pageEvent.pageIndex, pageEvent.pageSize)
      .pipe(
        tap(()=>{
          this.pageIndex = pageEvent.pageIndex;
          this.pageSize = pageEvent.pageSize;
        }),
        catchError(() => {
          this.onError('Erro ao carregar cursos.');
          return of({ courses: [], totalElements: 0, totalPages: 0 } as CoursePage);
        })
      );
  }

  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
        data: errorMsg
      ,
    });
  }


  onAdd(){
    //console.log('onAdd');
    this.router.navigate(['new'], {relativeTo: this.route});
  }
  onEdit(course: Course){

    console.log('Curso selecionado:', course);
    this.router.navigate(['edit', course._id], {relativeTo: this.route});


  }

  onRemove(course: Course) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Tem certeza que deseja remover esse curso?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.coursesService.remove(course._id).subscribe(
          () => {
            this.refresh();
            this.snackBar.open('Curso removido com sucesso!', 'X', {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'center'
            });
          },
          () => this.onError('Erro ao tentar remover curso')
        );
      }
    });


  }

}
