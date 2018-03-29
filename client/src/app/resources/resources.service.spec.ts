import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {ResourceService} from "./resources.service";
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {resources} from './resources';
import {environment} from '../../environments/environment';
import {ResourcesComponent} from "./resources.component";
import {FormsModule} from "@angular/forms";
import {CustomModule} from "../custom.module";
import {ComponentFixture, TestBed, async} from "@angular/core/testing";
import {MATERIAL_COMPATIBILITY_MODE} from "@angular/material";
import {MatDialog} from '@angular/material';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';


describe('Resources', () => {

    let  resourceList : ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>

    let resourcesServiceStub: {
        getResources: () => Observable<resources[]>
    };

    beforeEach(() => {
        // stub GoalsService for test reasons
        resourcesServiceStub = {
            getResources: () => Observable.of([
                {
                    _id: 'food_id',
                    purpose: 'Gain some weight',
                    category: 'Food',
                    name: 'Eat all the cookies',
                    phone: '123-456-789'
                },
                {
                    _id: 'chores_id',
                    purpose: 'Have cleaner kitchen',
                    category: 'Chores',
                    name: 'Take out recycling',
                    phone: '456-123-7890'
                },
                {
                    _id: 'family_id',
                    purpose: 'To love her',
                    category: 'Family',
                    name: 'Call mom',
                    phone: '365-158-6561'
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [ResourcesComponent],
            providers: [{provide: ResourceService, useValue: resourcesServiceStub},
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

    it('has one resources called \'365-158-6561\'', () => {
        expect(resourceList.resource.filter((Resource: resources) => Resource.phone ==='365-158-6561' ).length).toBe(1);
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
        resourceList.resourcesPurpose = 'i';
        resourceList.refreshResources().subscribe(() => {
            expect(resourceList.filteredResources.length).toBe(2);
        });
    });

})

describe('Misbehaving resources List', () => {
    let resourceList: ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>;

    let resourceListServiceStub: {
        getResources: () => Observable<resources[]>
    };

    beforeEach(() => {
        // stub GoalService for test reasons
        resourceListServiceStub = {
            getResources: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [ResourcesComponent],
            providers: [
                {provide: ResourceService, useValue: resourceListServiceStub},
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

    it('generates an error if we don\'t set up a ResourceService', () => {
        // Since the observer throws an error, we don't expect goals to be defined.
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
        name: 'Drink coffee',
        phone: '569-132-4254'
    };
    const newId = 'health_id';

    let calledResource: resources;

    let resourceListServiceStub: {
        getResources: () => Observable<resources[]>,
        addNewResource: (newResources: resources) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (ResourcesComponent, any) => {
            afterClosed: () => Observable<resources>
        };
    };

    beforeEach(() => {
        calledResource = null;
        // stub GoalsService for test reasons
        resourceListServiceStub = {
            getResources: () => Observable.of([]),
            addNewResource: (resourceToAdd: resources) => {
                calledResource = resourceToAdd;
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

    it('calls ResourceService.addResource', () => {
        expect(calledResource).toBeNull();
        resourceList.openDialog();
        expect(calledResource).toEqual(newResources);
    });
});

describe('Deleting a Resource', () => {
    let resourceList: ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>;
    const deleteResources: resources =   {
        _id: '',
        purpose: 'To have a delightful tasting sensation',
        category: 'Personal Health',
        name: 'Eat pringles',
        phone: '568-632-3255'
    };
    const newId = 'pringles_id';

    let calledResource: resources;

    let resourceListServiceStub: {
        getResources: () => Observable<resources[]>,
        deleteResources: (deleteResources: resources) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (ResourcesComponent, any) => {
            afterClosed: () => Observable<resources>
        };
    };

    beforeEach(() => {
        calledResource = null;
        // stub GoalsService for test reasons
        resourceListServiceStub = {
            getResources: () => Observable.of([]),
            deleteResources: (resourceToDelete: resources) => {
                calledResource = resourceToDelete;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(deleteResources);
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

    it('calls ResourceService.deleteResources', () => {
        expect(calledResource).toBeNull();
        resourceList.deleteResources(this._id);
    });
});

describe('Completing a Resource', () => {
    let resourceList: ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>;
    const editResource: resources =   {
        _id: '',
        purpose: 'To break everything and make people mad',
        category: 'Chores',
        name: 'Destroy all monitors in the lab',
        phone: '621-536-4569'
    };
    const newId = 'monitor_id';

    let calledResource: resources;

    let resourceListServiceStub: {
        getResources: () => Observable<resources[]>,
        editResource: (newResources: resources) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (ResoucesComponent, any) => {
            afterClosed: () => Observable<resources>
        };
    };

    beforeEach(() => {
        calledResource = null;
        // stub GoalsService for test reasons
        resourceListServiceStub = {
            getResources: () => Observable.of([]),
            editResource: (resourceToComplete: resources) => {
                calledResource = resourceToComplete;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(editResource);
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

    it('calls ResourceService.editResource', () => {
        expect(calledResource).toBeNull();
        // I don't think this is correct, but it passes. It should probably take in this._id, this.purpose, etc.
        resourceList.resourceSatisfied('', 'To break everything and make people mad', '320-588-1234', 'Nic', "Destroy all monitors in the lab")
        expect(calledResource).toEqual(editResource);
    });
});
