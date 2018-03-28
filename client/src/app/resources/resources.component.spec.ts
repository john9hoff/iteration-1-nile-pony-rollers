import {ComponentFixture, TestBed, async} from "@angular/core/testing";
import {resources} from "./resources";
import {ResourcesComponent} from "./resources.component";
import {ResourceService} from "./resources.service"
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Resources', () => {

    let resourceList: ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>;

    let ResourceServiceStub: {
        getresources: () => Observable<resources[]>
    };

    beforeEach(() => {
        // stub ResourcesService for test purposes
        ResourceServiceStub = {
            getresources: () => Observable.of([
                {
                    _id: 'food_id',
                    purpose: 'Gain some weight',
                    category: 'Food',
                    phone: '123-985-3548',
                    name: 'Eat all the cookies',
                },
                {
                    _id: 'chores_id',
                    purpose: 'Have cleaner kitchen',
                    category: 'Chores',
                    phone: '548-535-8943',
                    name: 'Take out recycling',
                },
                {
                    _id: 'family_id',
                    purpose: 'To love her',
                    category: 'Family',
                    phone: '896-132-4346',
                    name: 'Call mom',
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [ResourcesComponent],
            providers: [{provide: ResourceService, useValue: ResourceServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ResourcesComponent);
            resourceList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the resource', () => {
        expect(resourceList.resource.length).toBe(3);
    });

    it('contains a name called \'Eat all the cookies\'', () => {
        expect(resourceList.resource.some((Resource: resources) => Resource.name === 'Eat all the cookies')).toBe(true);
    });

    it('contains a name called \'Call mom\'', () => {
        expect(resourceList.resource.some((Resource: resources) => Resource.name === 'Call mom')).toBe(true);
    });

    it('contains a purpose called \'Gain some weight\'', () => {
        expect(resourceList.resource.some((Resource: resources) => Resource.purpose === 'Gain some weight')).toBe(true);
    });

    it('doesn\'t contain a name called \'Meet with Santa\'', () => {
        expect(resourceList.resource.some((Resource: resources) => Resource.name === 'Meet with Santa')).toBe(false);
    });

    it('Resource list filters by name', () => {
        expect(resourceList.filteredResources.length).toBe(3);
        resourceList.resourcesName = 'y';
        resourceList.refreshResources().subscribe(() => {
            expect(resourceList.filteredResources.length).toBe(1);
        });
    });

    it('Resource list filters by purpose', () => {
        expect(resourceList.filteredResources.length).toBe(3);
        resourceList.resourcesPurpose = '5';
        resourceList.refreshResources().subscribe(() => {
            expect(resourceList.filteredResources.length).toBe(2);
        });
    });

})

describe('Misbehaving resources List', () => {
    let resourceList: ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>;

    let resourceListServiceStub: {
        getresources: () => Observable<resources[]>
    };

    beforeEach(() => {
        // stub GoalService for test purposes
        resourceListServiceStub = {
            getresources: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [ResourcesComponent],
            providers: [{provide: ResourceService, useValue: resourceListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ResourcesComponent);
            resourceList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('generates an error if we don\'t set up a ResourcesService', () => {
        // Since the observer throws an error, we don't expect resource to be defined.
        expect(resourceList.resource).toBeUndefined();
    });
});

describe('Adding a Resource', () => {
    let resourceList: ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>;
    const newResources: resources =   {
        _id: '',
        purpose: 'To stay awake writing tests',
        category: 'Personal Health',
        phone: '453-173-5349',
        name: 'Drink coffee',
    };
    const newId = 'health_id';

    let calledResources: resources;

    let resourceListServiceStub: {
        getresources: () => Observable<resources[]>,
        addNewresource: (newResources: resources) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (ResourcesComponent, any) => {
            afterClosed: () => Observable<resources>
        };
    };

    beforeEach(() => {
        calledResources = null;
        // stub ResourcesService for test purposes
        resourceListServiceStub = {
            getresources: () => Observable.of([]),
            addNewresource: (ResourceToAdd: resources) => {
                calledResources = ResourceToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newResources);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [ResourcesComponent],
            providers: [
                {provide: ResourceService, useValue: resourceListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ResourcesComponent);
            resourceList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('calls ResourcesService.addResource', () => {
        expect(calledResources).toBeNull();
        resourceList.openDialog();
        expect(calledResources).toEqual(newResources);
    });
});
