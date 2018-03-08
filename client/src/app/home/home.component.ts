import {Component} from '@angular/core';
import {TrackerListService} from "../trackers/tracker-list.service";
import {Tracker} from "../trackers/tracker";
import {MatDialog} from '@angular/material';
import {ResponseComponent} from "./response.component";
import {EmergencyComponent} from "./emergency.component";

@Component({
    selector: 'app-home-list-component',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    public slideIndex = 1;
    public emojis: string[] = ["./assets/grinning.png", "./assets/slightly-smiling.png", "./assets/confused-face.png",
        "./assets/slightly-frowning-face.png", "./assets/angry-face.png", "./assets/crying-face.png"];

    public emojisString: string[] = ["grinning", "smiling", "confused", "frowning", "angry", "crying"];
    public image = this.emojis[this.slideIndex];

    constructor(public trackerListService: TrackerListService, public dialog: MatDialog) {

    }

    public addEmotion(index: number): void {

        console.log(this.emojisString[index]);
        const newTracker: Tracker = {_id: '', emoji: this.emojisString[index], date: ''};
        this.trackerListService.addNewEmoji(newTracker).subscribe(
            trackers => {
            },
            err => {
                console.log(err);
            }
        );
    }

    public plusSlides(n: number): void {
        this.slideIndex = this.slideIndex + n;
        if (this.slideIndex == -1) {
            this.slideIndex = 0;
        }
        if (this.slideIndex == this.emojis.length) {
            this.slideIndex = this.emojis.length - 1;
        }
        console.log(this.slideIndex + ' index');
        console.log(this.image);
        this.image = this.emojis[this.slideIndex];
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(ResponseComponent, {
            width: '800px',
            height: '800px'
        });

    }

    openDialogg(): void {
        const dialogRef = this.dialog.open(EmergencyComponent, {
            width: '800px',
            height: '800px'

        })
    }
}
