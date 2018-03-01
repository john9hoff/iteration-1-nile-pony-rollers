import {Component, OnInit} from '@angular/core';
import {TrackerListService} from './tracker-list.service';
import {Tracker} from './tracker';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {AddTrackerComponent} from './add-tracker.component';

@Component({
    selector: 'app-tracker-list-component',
    templateUrl: 'tracker-list.component.html',
    styleUrls: ['./tracker-list.component.css'],
})

export class TrackerListComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public trackers: Tracker[];
    public filteredTrackers: Tracker[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public trackerName: string;
    public trackerAge: number;
    public trackerCompany: string;

    // The ID of the
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the TrackerListService into this component.
    constructor(public trackerListService: TrackerListService, public dialog: MatDialog) {

    }

    isHighlighted(tracker: Tracker): boolean {
        return tracker._id['$oid'] === this.highlightedID['$oid'];
    }

    openDialog(): void {
        const newTracker: Tracker = {_id: '', emotion: '', time: 1996-12-12};
        const dialogRef = this.dialog.open(AddTrackerComponent, {
            width: '500px',
            data: { tracker: newTracker }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.trackerListService.addNewTracker(result).subscribe(
                addTrackerResult => {
                    this.highlightedID = addTrackerResult;
                    this.refreshTrackers();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the tracker.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    public filterTrackers(searchName: string, searchAge: number): Tracker[] {

        this.filteredTrackers = this.trackers;

        // Filter by name
        if (searchName != null) {
            searchName = searchName.toLocaleLowerCase();

            this.filteredTrackers = this.filteredTrackers.filter(tracker => {
                return !searchName || tracker.emotion.toLowerCase().indexOf(searchName) !== -1;
            });
        }

        /*// Filter by age
        if (searchAge != null) {
            this.filteredTrackers = this.filteredTrackers.filter(tracker => {
                return !searchAge || tracker.time == searchAge;
            });
        }*/

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
                this.filterTrackers(this.trackerName, this.trackerAge);
            },
            err => {
                console.log(err);
            });
        return trackerListObservable;
    }


    loadService(): void {
        this.trackerListService.getTrackers(this.trackerCompany).subscribe(
            trackers => {
                this.trackers = trackers;
                this.filteredTrackers = this.trackers;
            },
            err => {
                console.log(err);
            }
        );
    }


    ngOnInit(): void {
        this.refreshTrackers();
        this.loadService();
    }
}
