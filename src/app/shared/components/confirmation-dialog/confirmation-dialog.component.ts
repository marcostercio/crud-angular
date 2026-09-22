import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  standalone:false,
  styleUrl: './confirmation-dialog.component.scss',
  templateUrl: './confirmation-dialog.component.html',
})


export class ConfirmationDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
  readonly data = inject<string>(MAT_DIALOG_DATA);
  //readonly animal = model(this.data.animal);

  onConfirm(result : boolean): void {
    this.dialogRef.close(result);
  }
}
