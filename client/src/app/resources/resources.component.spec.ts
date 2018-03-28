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
                    resourceName: 'food_name',
                    resourceBody: 'Gain some weight',
                    resourcePhone: '763-599-4162',
                    resourcesUrl: 'Eat all the cookies',
                },
                {
                    resourceName: 'chores_name',
                    resourceBody: 'Have cleaner kitchen',
                    resourcePhone: '288-566-5234',
                    resourcesUrl: 'Take out recycling',
                },
                {
                    resourceName: 'family_name',
                    resourceBody: 'To love her',
                    resourcePhone: '123-456-7890',
                    resourcesUrl: 'Call mom',
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

    it('contains a body called \'Gain some weight\'', () => {
        expect(resourceList.resource.some((Resource: resources) => Resource.resourceBody === 'Gain some weight')).toBe(true);
    });

    it('contains a body called \'Have cleaner kitchen\'', () => {
        expect(resourceList.resource.some((Resource: resources) => Resource.resourceBody === 'Have cleaner kitchen')).toBe(true);
    });

    it('contains a phonenumber called \'123-456-7890\'', () => {
        expect(resourceList.resource.some((Resource: resources) => Resource.resourcePhone === '123-456-7890')).toBe(true);
    });

    it('doesn\'t contain a body called \'Meet with Santa\'', () => {
        expect(resourceList.resource.some((Resource: resources) => Resource.resourceBody === 'Meet with Santa')).toBe(false);
    });

    it('Resource list filters by body', () => {
        expect(resourceList.filteredResources.length).toBe(3);
        resourceList.resourcesBody = 'y';
        resourceList.refreshResources().subscribe(() => {
            expect(resourceList.filteredResources.length).toBe(1);
        });
    });

    it('Resource list filters by phone', () => {
        expect(resourceList.filteredResources.length).toBe(3);
        resourceList.resourcesPhone = '5';
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
        resourceName: '',
        resourceBody: 'To stay awake writing tests',
        resourcePhone: '320-355-4457',
        resourcesUrl: 'Drink coffee',
    };
    const newName = 'health_name';

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
                    '$oid': newName
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
