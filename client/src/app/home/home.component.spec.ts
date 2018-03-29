import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Tracker} from "../trackers/tracker";
import {TrackerListComponent} from "../trackers/tracker-list.component";
import {HomeComponent} from './home.component';
import {TrackerListService} from '../trackers/tracker-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';

import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';


describe( 'Home', () => {

    let tracker: TrackerListComponent;
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    const newTracker: Tracker = {
        _id: '',
        rating: 3,
        emoji: 'happy',
        date: '',
        email: '',
    }
    const newId = 'roch_id';

    let calledTracker: Tracker;

    let homeServiceStub: {
        addNewEmoji: (newTracker: Tracker) => Observable<{'$oid': string}>
    };

    let mockMatDialog: {
        open: (ResponseComponent, any) => {
            afterClosed: () => void
        };
    };

    let mockMatDialog2: {
        open: (ResponseComponent2, any) => {
            afterClosed: () => void
        };
    };

    let mockMatDialog3: {
        open: (ResponseComponent3, any) => {
            afterClosed: () => void
        };
    };

    let mockMatDialog4: {
        open: (ResponseComponent4, any) => {
            afterClosed: () => void
        };
    };

    let mockMatDialog5: {
        open: (ResponseComponent2, any) => {
            afterClosed: () => void
        };
    };

    beforeEach(() => {
        calledTracker = null;

        homeServiceStub = {
            addNewEmoji: (trackerToAdd: Tracker) => {
                calledTracker = trackerToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };

        mockMatDialog = {
            open: () => {
                return {afterClosed: () => {return}  };
            }
        };

        mockMatDialog2 = {
            open: () => {
                return {afterClosed: () => {return}  };
            }
        };

        mockMatDialog3 = {
            open: () => {
                return {afterClosed: () => {return}  };
            }
        };

        mockMatDialog4 = {
            open: () => {
                return {afterClosed: () => {return}  };
            }
        };

        mockMatDialog5 = {
            open: () => {
                return {afterClosed: () => {return}  };
            }
        };





        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [HomeComponent], // declare the test component
            providers: [
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: TrackerListService, useValue: homeServiceStub}]
        });

    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(HomeComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));


    it('Tests emotion functions in homecomponent', () => {

        component.lightAngry();
        expect(component.emojiString).toEqual('angry');
        component.lightMeh();
        expect(component.emojiString).toEqual('normal');
        component.lightSad();
        expect(component.emojiString).toEqual('sad');
        component.lightHappy()
        expect(component.emojiString).toEqual('happy');
        component.lightAnxious()
        expect(component.emojiString).toEqual('anxious');
    });



});
