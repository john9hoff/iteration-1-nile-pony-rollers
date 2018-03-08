import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-response-5.component',
    templateUrl: 'response-5.component.html',
})
export class ResponseComponent5{
    public responseEmojis: string[] = ["Keep it up! Grinning", "Keep that smile! Smiling", "Need help with anything? Confused",
        "Why are you sad? Frowining", "Need something to relax you? Crying", "Here is some videos to watch. Mad"];
    public message: string = this.responseEmojis[0];


    constructor(public dialogRef: MatDialogRef<ResponseComponent5>) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
