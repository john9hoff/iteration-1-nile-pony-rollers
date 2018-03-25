import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-responseThanks.component',
    templateUrl: 'responseThanks.component.html',
    styleUrls: ['./responseThanks.component.css'],
})
export class ResponseThanksComponent{

    public message: string = "Thank you for recording!";

    constructor(public dialogRef: MatDialogRef<ResponseThanksComponent>) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
