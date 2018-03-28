import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {ResourceService} from "./resources.service";
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {resources} from './resources';
import {environment} from '../../environments/environment';

describe('Resources list service: ', () => {
    // A small collection of test goals
    const testResources: resources[] = [
        {
            _id: 'food_id',
            purpose: 'Gain some weight',
            category: 'Chores',
            phone: '123-123-1234',
            name: 'Bob',
        },
        {
            _id: 'chores_id',
            purpose: 'Have cleaner kitchen',
            category: 'Chores',
            phone: '987-987-9876',
            name: 'Chris',
        },
        {
            _id: 'family_id',
            purpose: 'Gain some weight',
            category: 'Family',
            phone: '456-456-4567',
            name: 'Family',
        }
    ];
    const mResources: resources[] = testResources.filter(Resource =>
        Resource.category.toLowerCase().indexOf('m') !== -1
    );

    let ResourcesListService: ResourceService;
    let currentlyImpossibleToGenerateSearchResourcesUrl: string;

    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        // Set up the mock handling of the HTTP requests
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        // Construct an instance of the service with the mock
        // HTTP client.
        ResourcesListService = new ResourceService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getResources() calls api/resource', () => {

        ResourcesListService.getresources().subscribe(
            users => expect(users).toBe(testResources)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(ResourcesListService.baseUrl);
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testResources);
    });

    it('getresources(resourcesCategory) adds appropriate param string to called URL', () => {
        ResourcesListService.getresources('m').subscribe(
            users => expect(users).toEqual(mResources)
        );

        const req = httpTestingController.expectOne(ResourcesListService.baseUrl + '?category=m&');
        expect(req.request.method).toEqual('GET');
        req.flush(mResources);
    });

    it('resourcesCategory(resourcesCategory) deals appropriately with a URL that already had a category', () => {
        currentlyImpossibleToGenerateSearchResourcesUrl = ResourcesListService.baseUrl + '?category=f&something=k&';
        ResourcesListService['resourceUrl'] = currentlyImpossibleToGenerateSearchResourcesUrl;
        ResourcesListService.filterByCategory('m');
        expect(ResourcesListService['resourceUrl']).toEqual(ResourcesListService.baseUrl + '?something=k&category=m&');
    });

    it('filterByCategory(resourcesCategory) deals appropriately with a URL that already had some filtering, but no category', () => {
        currentlyImpossibleToGenerateSearchResourcesUrl = ResourcesListService.baseUrl + '?something=k&';
        ResourcesListService['resourceUrl'] = currentlyImpossibleToGenerateSearchResourcesUrl;
        ResourcesListService.filterByCategory('m');
        expect(ResourcesListService['resourceUrl']).toEqual(ResourcesListService.baseUrl + '?something=k&category=m&');
    });

    it('filterByCategory(resourcesCategory) deals appropriately with a URL has the keyword category, but nothing after the =', () => {
        currentlyImpossibleToGenerateSearchResourcesUrl = ResourcesListService.baseUrl + '?category=&';
        ResourcesListService['resourceUrl'] = currentlyImpossibleToGenerateSearchResourcesUrl;
        ResourcesListService.filterByCategory('');
        expect(ResourcesListService['resourceUrl']).toEqual(ResourcesListService.baseUrl + '');
    });

    it('getresourceByID() calls api/resource/id', () => {
        const targetReousrce: resources = testResources[1];
        const targetId: string = targetReousrce._id;
        ResourcesListService.getresourceByID(targetId).subscribe(
            user => expect(user).toBe(targetReousrce)
        );

        const expectedUrl: string = ResourcesListService.baseUrl + '/' + targetId;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(targetReousrce);
    });

    it('adding a Resource calls api/resource/new', () => {
        const chores_id = { '$oid': 'chores_id' };
        const newResources: resources = {
            _id: 'chores_id',
            purpose: 'Have cleaner bathroom',
            category: 'Chores',
            phone: '123-456-789',
            name: 'Plunge toilet',
        };

        ResourcesListService.addNewResource(newResources).subscribe(
            id => {
                expect(id).toBe(chores_id);
            }
        );

        const expectedUrl: string = ResourcesListService.baseUrl + '/new';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(chores_id);
    });

    it('editing a Resource calls api/resource/edit', () => {
        const family_id = { '$oid': 'family_id' };
        const editResources: resources = {
            _id: 'family_id',
            purpose: 'Talk about my classes',
            category: 'Family',
            phone: '456-123-7890',
            name: 'Call sister',
        };

        ResourcesListService.editResource(editResources).subscribe(
            id => {
                expect(id).toBe(family_id);
            }
        );

        const expectedUrl: string = ResourcesListService.baseUrl + '/edit';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(family_id);
    });

});
