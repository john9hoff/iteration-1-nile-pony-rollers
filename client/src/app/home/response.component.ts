import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-response.component',
    templateUrl: 'response.component.html',
})
export class ResponseComponent {
    constructor(
        public dialogRef: MatDialogRef<ResponseComponent>) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
