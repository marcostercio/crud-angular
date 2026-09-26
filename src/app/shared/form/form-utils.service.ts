import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class FormUtilsService {
  constructor(
    private location: Location,
    private snackBar: MatSnackBar
  ) { }


  validateAllFormFields(formGroup: UntypedFormGroup | UntypedFormArray) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof UntypedFormControl) {
        control.markAsTouched({ onlySelf: true });
      }
      else if (control instanceof UntypedFormGroup || control instanceof UntypedFormArray) {
        control.markAsTouched({ onlySelf: true });
        this.validateAllFormFields(control);
      }
    });
  }

  errorMessage(FormGroup: UntypedFormGroup, fieldName: string) {
    const field = FormGroup.get(fieldName) as UntypedFormControl;
    return this.getErrorMessageFromField(field);
  }

  getErrorMessageFromField(field: UntypedFormControl) {

    if (field?.hasError('required')) {
      return 'Campo obrigatório';
    }

    if (field?.hasError('minlength')) {
      const requiredLength = field.errors ? field.errors['minlength']['requiredLength']:5;
      return `Tamanho minimo precisa ser de ${requiredLength} caracteres.`;
    }

     if (field?.hasError('maxlength')) {
      const requiredLength = field.errors ? field.errors['maxlength']['requiredLength']:5;
      return `Tamanho máximo excedido de ${requiredLength} caracteres.`;
    }
    return 'Campo inválido';
  }

  getFormArrayFieldErrorMessage(FormGroup: UntypedFormGroup, formArrayName: string,
     fieldName: string, index: number) {
    const formArray = FormGroup.get(formArrayName) as UntypedFormArray;
    const field= formArray.controls[index].get(fieldName) as UntypedFormControl;
    return this.getErrorMessageFromField(field);
  }

  isFormArrayRequired(FormGroup: UntypedFormGroup,  formArrayName: string){
        const formArray = FormGroup.get(formArrayName) as UntypedFormArray;
        return !formArray.valid && formArray.hasError('required') && formArray.touched;
  }
  onCancel(){
    this.location.back();
   }
  onSucces(){
    this.snackBar.open('Curso salvo com sucesso!','',{duration: 5000});
    this.onCancel();
   }
  onError(){
      this.snackBar.open('Erro ao salvar curso.','',{duration: 5000});
   }


}
