import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Tracker} from './tracker';
import {TrackerListComponent} from './tracker-list.component';
import {TrackerListService} from './tracker-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Tracker list', () => {

    let trackerList: TrackerListComponent;
    let fixture: ComponentFixture<TrackerListComponent>;

    let trackerListServiceStub: {
        getTrackers: () => Observable<Tracker[]>
    };

    beforeEach(() => {
        // stub TrackerService for test purposes
        trackerListServiceStub = {
            getTrackers: () => Observable.of([
                {
                    _id:'song_id',
                    rating: 2,
                    emoji: 'sad',
                    date: 'March 26',
                    email: 'bobbyjeen@gmail.com',
                },
                {
                    _id: 'pat_id',
                    rating:3,
                    emoji:'happy',
                    date:'April 1',
                    email: 'bobbyjeen@gmail.com',
                },
                {
                    _id: 'jamie_id',
                    rating:5,
                    emoji:'angry',
                    date:'April 1',
                    email: 'bobbyjeen@gmail.com',
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [TrackerListComponent],
            // providers:    [ TrackerListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: TrackerListService, useValue: trackerListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TrackerListComponent);
            trackerList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the trackers', () => {
        expect(trackerList.trackers.length).toBe(3);
    });

    it('contains a tracker emoji \'angry\'', () => {
        expect(trackerList.trackers.some((tracker: Tracker) => tracker.emoji === 'angry')).toBe(true);
    });

    it('contain a tracker emoji \'happy\'', () => {
        expect(trackerList.trackers.some((tracker: Tracker) => tracker.emoji === 'happy')).toBe(true);
    });

    it('doesn\'t contain a tracker emoji \'gainning\'', () => {
        expect(trackerList.trackers.some((tracker: Tracker) => tracker.emoji === 'gainning')).toBe(false);
    });

    it('has one trackers that rating is 2', () => {
        expect(trackerList.trackers.filter((tracker: Tracker) => tracker.rating === 2).length).toBe(1);
    });

    it('tracker list filters by emoji', () => {
        expect(trackerList.filteredTrackers.length).toBe(3);
        trackerList.trackerEmoji= 'sad';
        trackerList.refreshTrackers().subscribe(() => {
            expect(trackerList.filteredTrackers.length).toBe(1);
        });
    });

    it('tracker list filters by intensity', () => {
        expect(trackerList.filteredTrackers.length).toBe(3);
        trackerList.trackerRating = 5;
        trackerList.refreshTrackers().subscribe(() => {
            expect(trackerList.filteredTrackers.length).toBe(1);
        });
    });



});

describe('Misbehaving Tracker List', () => {
    let trackerList: TrackerListComponent;
    let fixture: ComponentFixture<TrackerListComponent>;

    let trackerListServiceStub: {
        getTrackers: () => Observable<Tracker[]>
    };

    beforeEach(() => {
        // stub TrackerService for test purposes
        trackerListServiceStub = {
            getTrackers: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [TrackerListComponent],
            providers: [{provide: TrackerListService, useValue: trackerListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TrackerListComponent);
            trackerList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('generates an error if we don\'t set up a TrackerListService', () => {
        // Since the observer throws an error, we don't expect trackers to be defined.
        expect(trackerList.trackers).toBeUndefined();
    });
});


describe('Adding a tracker', () => {
    let trackerList: TrackerListComponent;
    let fixture: ComponentFixture<TrackerListComponent>;
    const newTracker: Tracker = {
        _id: '',
        rating: 2,
        emoji: 'normal',
        date: 'March 27',
        email: 'bobbyjeen@gmail.com',
    };
    const newId = 'yujing_id';

    let calledTracker: Tracker;

    let trackerListServiceStub: {
        getTrackers: () => Observable<Tracker[]>,
        addNewTracker: (newTracker: Tracker) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (AddTrackerComponent, any) => {
            afterClosed: () => Observable<Tracker>
        };
    };

    beforeEach(() => {
        calledTracker = null;
        // stub TrackerService for test purposes
        trackerListServiceStub = {
            getTrackers: () => Observable.of([]),
            addNewTracker: (trackerToAdd: Tracker) => {
                calledTracker = trackerToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newTracker);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [TrackerListComponent],
            providers: [
                {provide: TrackerListService, useValue: trackerListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TrackerListComponent);
            trackerList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));


});
