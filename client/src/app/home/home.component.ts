import {Component, OnInit} from '@angular/core';
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
export class HomeComponent implements OnInit{

    public slideIndex = 0;
    public emojis: string[] = ["./assets/happy.png",  "./assets/meh.png",
        "./assets/sad.png", "./assets/angry.png","./assets/anxious.png"];

    public emojisString: string[] = ["Happy", "Normal", "Sad", "Angry", "Anxious"];
    public image = this.emojis[this.slideIndex];
    public emojiExplain = this.emojisString[this.slideIndex];
    public emojiRating: number = 3;
    showPage = false;

    constructor(public trackerListService: TrackerListService, public dialog: MatDialog) {
    }

    public addEmotion(emojiIndex: number): void {

        console.log("emojiString:"+this.emojisString[emojiIndex]);
        console.log("emojiRating: " + this.emojiRating);
        const newTracker: Tracker = {_id: '',
            rating:this.emojiRating,
            emoji: this.emojisString[emojiIndex],
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


    public plusSlides(n: number): void{
        this.slideIndex = this.slideIndex + n;
        if(this.slideIndex == -1){
            this.slideIndex = 0;
        }
        if(this.slideIndex == this.emojis.length){
            this.slideIndex = this.emojis.length - 1;
        }
        console.log(this.slideIndex + ' index');
        console.log(this.image);
        console.log(this.emojiExplain);
        this.image = this.emojis[this.slideIndex];
        this.emojiExplain = this.emojisString[this.slideIndex];
    }

    openThanks():void{
        const dialogRef = this.dialog.open(ResponseThanksComponent,{
            width: '855px',
            height: '485px'
        })
    }

    openDialog(n: number): void {
        console.log(n);
        if (n == 0){
            const dialogRef = this.dialog.open(ResponseComponent,{
                width: '855px',
                height: '485px'
            });
        }
        else if(n == 1){
            const dialogRef = this.dialog.open(ResponseComponent2,{
                width: '855px',
                height: '485px'
            });
        }

        else if(n == 2){
            const dialogRef = this.dialog.open(ResponseComponent3,{
                width: '855px',
                height: '485px'
            });
        }

        else if(n == 3){
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

    ngOnInit(){
        if(gapi == null || gapi.auth2 == null || gapi.auth2.getAuthInstance().isSignedIn.get() == true){
            this.showPage = true;
        } else{
            this.showPage = false;
        }
        console.log(this.showPage + " window.email " + window['email']);
    }
}
