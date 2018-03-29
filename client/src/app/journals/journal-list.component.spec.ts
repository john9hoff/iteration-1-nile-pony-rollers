import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Journal} from './journal';
import {JournalListComponent} from './journal-list.component';
import {JournalListService} from './journal-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe( 'Journals', () => {

    let journalList: JournalListComponent;
    let fixture: ComponentFixture<JournalListComponent>;

    let journalServiceStub: {
        getJournals: () => Observable<Journal[]>
    };

    beforeEach(() => {
        // stub JournalListService for test reasons
        journalServiceStub = {
            getJournals: () => Observable.of([
                {
                    _id: 'buying_id',
                    subject: 'Buying food',
                    body: 'I went to the ice cream store today for a sundae.',
                    date: "Sat Jan 27 13:36:47 CST 2018"
                },
                {
                    _id: 'visit_id',
                    subject: 'Visit mom',
                    body: 'I went to my Mom\'s house to talk to her.',
                    date: "Sun Feb 12 16:32:41 CST 2018"
                },
                {
                    _id: 'running_id',
                    subject: 'Go on run',
                    body: 'I went on a 25 mile run today!',
                    date: "Mon Mar 11 19:26:37 CST 2018"
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [JournalListComponent],
            providers: [{provide: JournalListService, useValue: journalServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalListComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the journals', () => {
        expect(journalList.journals.length).toBe(3);
    });

    it('contains a subject called \'Buying food\'', () => {
        expect(journalList.journals.some((journal: Journal) => journal.subject === 'Buying food')).toBe(true);
    });

    it('contains a subject called \'Visit mom\'', () => {
        expect(journalList.journals.some((journal: Journal) => journal.subject === 'Visit mom')).toBe(true);
    });

    it('contains a body called \'I went on a 25 mile run today!\'', () => {
        expect(journalList.journals.some((journal: Journal) => journal.body === 'I went on a 25 mile run today!')).toBe(true);
    });

    it('doesn\'t contain a subject called \'Meet with Santa\'', () => {
        expect(journalList.journals.some((journal: Journal) => journal.subject === 'Meet with Santa')).toBe(false);
    });

    it('has a journal dated: Sun Feb 12 16:32:41 CST 2018', () => {
        expect(journalList.journals.some((journal: Journal) => journal.date === 'Sun Feb 12 16:32:41 CST 2018')).toBe(true);
    });

    it('journal list filters by subject', () => {
        expect(journalList.filteredJournals.length).toBe(3);
        journalList.journalSubject = 'v';
        journalList.refreshJournals().subscribe(() => {
            expect(journalList.filteredJournals.length).toBe(1);
        });
    });

    it('journal list filters by body', () => {
        expect(journalList.filteredJournals.length).toBe(3);
        journalList.journalBody = 'h';
        journalList.refreshJournals().subscribe(() => {
            expect(journalList.filteredJournals.length).toBe(2);
        });
    });

})

describe('Misbehaving Journal List', () => {
    let journalList: JournalListComponent;
    let fixture: ComponentFixture<JournalListComponent>;

    let journalListServiceStub: {
        getJournals: () => Observable<Journal[]>
    };

    beforeEach(() => {
        // stub JournalListService for test reasons
        journalListServiceStub = {
            getJournals: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [JournalListComponent],
            providers: [{provide: JournalListService, useValue: journalListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalListComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('generates an error if we don\'t set up a JournalListService', () => {
        // Since the observer throws an error, we don't expect journals to be defined.
        expect(journalList.journals).toBeUndefined();
    });
});

describe('Adding a journal', () => {
    let journalList: JournalListComponent;
    let fixture: ComponentFixture<JournalListComponent>;
    const newJournal: Journal =   {
        _id: '',
        body: 'To stay awake writing tests',
        subject: 'Drink coffee',
        date: "Sun Feb 16 17:12:43 CST 2018"
    };
    const newId = 'coffee_id';

    let calledJournal: Journal;

    let journalListServiceStub: {
        getJournals: () => Observable<Journal[]>,
        addNewJournal: (newJournal: Journal) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (JournalListComponent, any) => {
            afterClosed: () => Observable<Journal>
        };
    };

    beforeEach(() => {
        calledJournal = null;
        // stub JournalListService for test reasons
        journalListServiceStub = {
            getJournals: () => Observable.of([]),
            addNewJournal: (journalToAdd: Journal) => {
                calledJournal = journalToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newJournal);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [JournalListComponent],
            providers: [
                {provide: JournalListService, useValue: journalListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalListComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('calls JournalListService.addJournal', () => {
        expect(calledJournal).toBeNull();
        journalList.openDialog();
        expect(calledJournal).toEqual(newJournal);
    });
});

describe('Editing a journal', () => {
    let journalList: JournalListComponent;
    let fixture: ComponentFixture<JournalListComponent>;
    const editJournal: Journal =   {
        _id: '',
        body: 'I fell asleep in class today',
        subject: 'Classes',
        date: "Sun Feb 16 17:12:43 CST 2018"
    };
    const newId = 'class_id';

    let calledJournal: Journal;

    let journalListServiceStub: {
        getJournals: () => Observable<Journal[]>,
        editJournal: (newJournal: Journal) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (JournalListComponent, any) => {
            afterClosed: () => Observable<Journal>
        };
    };

    beforeEach(() => {
        calledJournal = null;
        // stub JournalListService for test reasons
        journalListServiceStub = {
            getJournals: () => Observable.of([]),
            editJournal: (journalToEdit: Journal) => {
                calledJournal = journalToEdit;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(editJournal);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [JournalListComponent],
            providers: [
                {provide: JournalListService, useValue: journalListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalListComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('calls JournalListService.editJournal', () => {
        expect(calledJournal).toBeNull();
        journalList.openDialogReview(this._id, this.subject, this.body, this.date);
        expect(calledJournal).toEqual(editJournal);
    });
});
