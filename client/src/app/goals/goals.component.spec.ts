import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Goal} from './goal';
import {GoalsComponent} from './goals.component';
import {GoalsService} from './goals.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';
import {MatSnackBar} from '@angular/material';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {UserListService} from "../users/user-list.service";
import {UserListComponent} from "../users/user-list.component";

describe( 'Goals', () => {

    let goalList: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;

    let goalsServiceStub: {
        getGoals: () => Observable<Goal[]>
    };

    beforeEach(() => {
        // stub GoalsService for test purposes
        goalsServiceStub = {
            getGoals: () => Observable.of([
                {
                    _id: 'food_id',
                    purpose: 'Gain some weight',
                    category: 'Food',
                    name: 'Eat all the cookies',
                    status: false
                },
                {
                    _id: 'chores_id',
                    purpose: 'Have cleaner kitchen',
                    category: 'Chores',
                    name: 'Take out recycling',
                    status: true
                },
                {
                    _id: 'family_id',
                    purpose: 'To love her',
                    category: 'Family',
                    name: 'Call mom',
                    status: true
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [GoalsComponent],
            providers: [{provide: GoalsService, useValue: goalsServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GoalsComponent);
            goalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the goals', () => {
        expect(goalList.goals.length).toBe(3);
    });




})
