import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-response.component',
    templateUrl: 'response.component.html',
})
export class ResponseComponent{
    public responseEmojis: string[] = ["Keep it up! Grinning", "Keep that smile! Smiling", "Need help with anything? Confused",
        "Why are you sad? Frowining", "Need something to relax you? Crying", "Here is some videos to watch. Mad"];
    public message: string = this.responseEmojis[0];


    constructor(public dialogRef: MatDialogRef<ResponseComponent>) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
