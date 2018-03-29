import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {HomeComponent} from './home.component';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {TrackerListService} from "../trackers/tracker-list.service";
import {MatDialog} from '@angular/material';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {Tracker} from "../trackers/tracker";

describe( 'Home', () => {

    let trackerList: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    let trackerServiceStub: {
        getTrackers: () => Observable<Tracker[]>
    };

    beforeEach(() => {
        // stub GoalsService for test purposes
        trackerServiceStub = {
            getTrackers: () => Observable.of([
                {
                    _id:'song_id',
                    rating: 2,
                    emoji: 'sad',
                    date: 'March 26',
                    email: ''
                },
                {
                    _id: 'pat_id',
                    rating:3,
                    emoji:'happy',
                    date:'April 1',
                    email: ''
                },
                {
                    _id: 'jamie_id',
                    rating:5,
                    emoji:'angry',
                    date:'April 1',
                    email: ''
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [HomeComponent],
            providers: [{provide: TrackerListService, useValue: trackerServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(HomeComponent);
            trackerList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains the list of emojis', () => {
        expect(trackerList.emojis.length).toBe(5);
    });

  
});
