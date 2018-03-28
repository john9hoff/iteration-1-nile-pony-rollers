import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {HomeComponent} from './home.component';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';

import {MatDialog} from '@angular/material';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {Tracker} from "../trackers/tracker";

describe( 'Home', () => {

    let goalList: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    let trackerServiceStub: {
        getTrackers: () => Observable<Tracker[]>
    };

    beforeEach(() => {
        // stub GoalsService for test purposes
        trackerServiceStub = {
            getTrackers: () => Observable.of([
                {
                    _id: '5ab88ab17205545c679992e4',
                    rating: '4',
                    emoji: 'Down',
                    date: 'Tue Jul 27 1971 03:15:18 GMT-0500 (CDT)',
                    email: 'opheliawinters@flexigen.com'
                },
                {
                    _id: '5ab88ab1543afe51da42359e',
                    rating: '4',
                    emoji: 'Down',
                    date: 'Fri Jul 11 2014 03:10:26 GMT-0500 (CDT)',
                    email: 'minniehouse@flexigen.com'
                },
                {
                    _id: '5ab88ab1a5b4ebf66df44c40',
                    rating: '4',
                    emoji: 'Radiant',
                    date: 'Thu Jan 30 1975 19:53:45 GMT-0600 (CST)',
                    email: 'barnesjustice@flexigen.com'
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

    it('contains a name called \'Eat all the cookies\'', () => {
        expect(goalList.goals.some((goal: Goal) => goal.name === 'Eat all the cookies')).toBe(true);
    });

    it('contains a name called \'Call mom\'', () => {
        expect(goalList.goals.some((goal: Goal) => goal.name === 'Call mom')).toBe(true);
    });

    it('contains a purpose called \'Gain some weight\'', () => {
        expect(goalList.goals.some((goal: Goal) => goal.purpose === 'Gain some weight')).toBe(true);
    });

    it('doesn\'t contain a name called \'Meet with Santa\'', () => {
        expect(goalList.goals.some((goal: Goal) => goal.name === 'Meet with Santa')).toBe(false);
    });

    it('has two goals that are true', () => {
        expect(goalList.goals.filter((goal: Goal) => goal.status === true).length).toBe(2);
    });

    it('goal list filters by name', () => {
        expect(goalList.filteredGoals.length).toBe(3);
        goalList.goalName = 'y';
        goalList.refreshGoals().subscribe(() => {
            expect(goalList.filteredGoals.length).toBe(1);
        });
    });

    it('goal list filters by purpose', () => {
        expect(goalList.filteredGoals.length).toBe(3);
        goalList.goalPurpose = 'i';
        goalList.refreshGoals().subscribe(() => {
            expect(goalList.filteredGoals.length).toBe(2);
        });
    });

})

describe('Misbehaving Goal List', () => {
    let goalList: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;

    let goalListServiceStub: {
        getGoals: () => Observable<Goal[]>
    };

    beforeEach(() => {
        // stub GoalService for test purposes
        goalListServiceStub = {
            getGoals: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [GoalsComponent],
            providers: [{provide: GoalsService, useValue: goalListServiceStub},
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

    it('generates an error if we don\'t set up a GoalsService', () => {
        // Since the observer throws an error, we don't expect goals to be defined.
        expect(goalList.goals).toBeUndefined();
    });
});

describe('Adding a goal', () => {
    let goalList: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;
    const newGoal: Goal =   {
        _id: '',
        purpose: 'To stay awake writing tests',
        category: 'Personal Health',
        name: 'Drink coffee',
        status: false
    };
    const newId = 'health_id';

    let calledGoal: Goal;

    let goalListServiceStub: {
        getGoals: () => Observable<Goal[]>,
        addNewGoal: (newGoal: Goal) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (GoalsComponent, any) => {
            afterClosed: () => Observable<Goal>
        };
    };

    beforeEach(() => {
        calledGoal = null;
        // stub GoalsService for test purposes
        goalListServiceStub = {
            getGoals: () => Observable.of([]),
            addNewGoal: (goalToAdd: Goal) => {
                calledGoal = goalToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newGoal);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [GoalsComponent],
            providers: [
                {provide: GoalsService, useValue: goalListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
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

    it('calls GoalsService.addGoal', () => {
        expect(calledGoal).toBeNull();
        goalList.openDialog();
        expect(calledGoal).toEqual(newGoal);
    });
});
