import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-error-dialog',
    templateUrl: './error-dialog.component.html',
    styleUrls: ['./error-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ErrorDialogComponent {
    data = inject(MAT_DIALOG_DATA);
}
