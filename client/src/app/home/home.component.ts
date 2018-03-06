import {Component} from '@angular/core';
import {TrackerListService} from "../trackers/tracker-list.service";
import {Tracker} from "../trackers/tracker";

@Component({
    selector: 'app-home-list-component',
    templateUrl: 'home.component.html'
})
export class HomeComponent {

    constructor(public trackerListService: TrackerListService) {

    }

    public addEmotion(newEmoji: string): void {
        const newTracker: Tracker = {_id: '', emoji: newEmoji, date: ''};
        this.trackerListService.addNewEmoji(newTracker).subscribe(
            trackers => {
            },
            err => {
                console.log(err);
            }
        );
    }
}
