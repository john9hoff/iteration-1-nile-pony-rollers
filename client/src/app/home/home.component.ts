import {Component} from '@angular/core';
import {TrackerListService} from "../trackers/tracker-list.service";
import {Tracker} from "../trackers/tracker";
import {MatDialog} from '@angular/material';
import {ResponseComponent} from "./response.component";
import {ResponseComponent2} from "./response-2.component";
import {ResponseComponent3} from "./response-3.component";
import {ResponseComponent5} from "./response-5.component";
import {ResponseComponent4} from "./response-4.component";
import {ResponseThanksComponent} from "./responseThanks.component";

@Component({
    selector: 'app-home-list-component',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {

    public emojiRating: number = 3;
    public emojiString:string = "";




    constructor(public trackerListService: TrackerListService, public dialog: MatDialog) {
    }

    public lightHappy(){
        this.emojiString = "happy";
    }

    public lightMeh(){
        this.emojiString = "normal";
    }

    public lightSad(){
        this.emojiString = "sad";
    }

    public lightAngry(){
        this.emojiString = "angry";
    }

    public lightAnxious(){
        this.emojiString = "anxious";
    }

    public addEmotion(): void {

        const newTracker: Tracker = {_id: '',
            rating:this.emojiRating,
            emoji: this.emojiString,
            date: '',
            email:''};
        this.trackerListService.addNewEmoji(newTracker).subscribe(
            trackers => {
            },
            err => {
                console.log(err);
            }
        );
    }



    openThanks():void{
        const dialogRef = this.dialog.open(ResponseThanksComponent,{
            width: '855px',
            height: '485px'
        })
    }

    openDialog(): void {

        if (this.emojiString == "happy"){
            const dialogRef = this.dialog.open(ResponseComponent,{
                width: '855px',
                height: '485px'
            });
        }
        else if(this.emojiString == "normal"){
            const dialogRef = this.dialog.open(ResponseComponent2,{
                width: '855px',
                height: '485px'
            });
        }

        else if(this.emojiString == "sad"){
            const dialogRef = this.dialog.open(ResponseComponent3,{
                width: '855px',
                height: '485px'
            });
        }

        else if(this.emojiString == "angry"){
            const dialogRef = this.dialog.open(ResponseComponent4,{
                width: '855px',
                height: '485px'
            });
        }

        else{
            const dialogRef = this.dialog.open(ResponseComponent5,{
                width: '855px',
                height: '485px'
            });
        }

    }
}
