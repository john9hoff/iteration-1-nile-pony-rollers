import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Goal} from './goal';
import {GoalsComponent} from './goals.component';
import {GoalsService} from './goals.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

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
