import {Component, OnInit} from '@angular/core';
import {TrackerListService} from './tracker-list.service';
import {Tracker} from './tracker';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-tracker-list-component',
    templateUrl: 'tracker-list.component.html',
    styleUrls: ['./tracker-list.component.css'],
})

export class TrackerListComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public trackers: Tracker[];
    public filteredTrackers: Tracker[];
    showPage = false;

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public trackerEmoji: string;
    public trackerTime: string;
    public trackerRating: number;
    public length: number;
    public index = 0;
    public progress: number;



    // The ID of the
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the TrackerListService into this component.
    constructor(public trackerListService: TrackerListService) {

    }

    isHighlighted(tracker: Tracker): boolean {
        return tracker._id['$oid'] === this.highlightedID['$oid'];
    }

    public addEmoji(newEmoji: string, newRating:number): void {
        const newTracker: Tracker = {_id: '',rating:newRating, emoji: newEmoji, date: '', email: ''};
        this.trackerListService.addNewEmoji(newTracker).subscribe(
            trackers => {
                this.refreshTrackers();
            },
            err => {
                console.log(err);
            }
        );
    }

    public filterTrackers(searchEmoji: string, searchTime: string, searchRating:number): Tracker[] {

        this.filteredTrackers = this.trackers;

        // Filter by emoji
        if (searchEmoji != null) {
            searchEmoji = searchEmoji.toLocaleLowerCase();

            this.filteredTrackers = this.filteredTrackers.filter(tracker => {
                return !searchEmoji || tracker.emoji.toLowerCase() == searchEmoji;
            });
        }

        // Filter by time
        if (searchTime != null) {
            this.filteredTrackers = this.filteredTrackers.filter(tracker => {
                return !searchTime || tracker.date == searchTime;
            });
        }

        //Filter by rating
        if (searchRating != null){
            this.filteredTrackers = this.filteredTrackers.filter(tracker => {
                return !searchRating || tracker.rating == searchRating;
            })
        }

        this.length = this.filteredTrackers.length;
        if (this.index + 10 > this.length) {
            this.index = this.length - 10;
        }
        if (this.index - 10 < 0) {
            this.index = 0;
        }

        return this.filteredTrackers;
    }

    /**
     * Starts an asynchronous operation to update the trackers list
     *
     */
    refreshTrackers(): Observable<Tracker[]> {
        // Get Trackers returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        const trackerListObservable: Observable<Tracker[]> = this.trackerListService.getTrackers();
        trackerListObservable.subscribe(
            trackers => {
                this.trackers = trackers;
                this.filterTrackers(this.trackerEmoji, this.trackerTime, this.trackerRating);
                this.length = this.trackers.length;
            },
            err => {
                console.log(err);
            });
        return trackerListObservable;
    }

    loadProgressBar(): void {

        this.progress = (this.index / this.length) * 100;
    }


    loadService(): void {
        this.trackerListService.getTrackers(this.trackerEmoji).subscribe(
            trackers => {
                this.trackers = trackers;
                this.filteredTrackers = this.trackers;
            },
            err => {
                console.log(err);
            }
        );
    }

    prevIndex(): void{
        if(this.index == this.length - 10){
            this.index = this.index - 10;
        }
        else if(this.index % 10 != 0){
            while(this.index % 10 != 0){
                this.index = this.index - 1;
            }
        }
        else{
            this.index = this.index - 10;
        }
        this.loadProgressBar();
    }

    nextIndex(): void{
        this.index = this.index + 10;
        if(this.index + 10 >= this.length){
            this.index = this.length;
        }
        this.loadProgressBar();
    }

    firstIndex(): void{
        this.index = 0;
        this.loadProgressBar();
    }

    lastIndex(): void{
        this.index = this.length;
        this.loadProgressBar();
    }


    ngOnInit(): void {
        this.refreshTrackers();
        this.loadService();
        this.loadProgressBar();
        if(gapi == null || gapi.auth2 == null || gapi.auth2.getAuthInstance().isSignedIn.get() == true){
            this.showPage = true;
        } else{
            this.showPage = false;
        }
        console.log(this.showPage + " window.email " + window['email']);
    }
}
