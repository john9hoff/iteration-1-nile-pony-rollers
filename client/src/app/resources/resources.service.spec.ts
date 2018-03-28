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
            resourceName: 'Bob_name',
            resourceBody: 'My Freind',
            resourcePhone: '320-555-1234',
            resourcesUrl: 'Eat all the cookies',
        },
        {
            resourceName: 'chores_name',
            resourceBody: 'Brother',
            resourcePhone: '320-1234-4567',
            resourcesUrl: 'Take out recycling',
        },
        {
            resourceName: 'family_name',
            resourceBody: 'Home LandLIne',
            resourcePhone: '320-288-9876',
            resourcesUrl: 'Call mom',
        }
    ];
    const mResources: resources[] = testResources.filter(Resource =>
        Resource.resourcePhone.toLowerCase().indexOf('m') !== -1
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

    it('getresources() calls api/resource', () => {

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

    it('getresources(resourcesPhone) adds appropriate param string to called URL', () => {
        ResourcesListService.getresources('m').subscribe(
            users => expect(users).toEqual(mResources)
        );

        const req = httpTestingController.expectOne(ResourcesListService.baseUrl + '?resourcesPhone=m&');
        expect(req.request.method).toEqual('GET');
        req.flush(mResources);
    });

    it('filterByPhone(resourcesPhone) deals appropriately with a URL that already had a resourcesPhone', () => {
        currentlyImpossibleToGenerateSearchResourcesUrl = ResourcesListService.baseUrl + '?category=f&something=k&';
        ResourcesListService['resourceUrl'] = currentlyImpossibleToGenerateSearchResourcesUrl;
        ResourcesListService.filterByPhone('m');
        expect(ResourcesListService['resourceUrl']).toEqual(ResourcesListService.baseUrl + '?something=k&category=m&');
    });

    it('filterByPhone(resourcesPhone) deals appropriately with a URL that already had some filtering, but no category', () => {
        currentlyImpossibleToGenerateSearchResourcesUrl = ResourcesListService.baseUrl + '?something=k&';
        ResourcesListService['resourceUrl'] = currentlyImpossibleToGenerateSearchResourcesUrl;
        ResourcesListService.filterByPhone('m');
        expect(ResourcesListService['resourceUrl']).toEqual(ResourcesListService.baseUrl + '?something=k&category=m&');
    });

    it('filterByPhone(resourcesPhone) deals appropriately with a URL has the keyword category, but nothing after the =', () => {
        currentlyImpossibleToGenerateSearchResourcesUrl = ResourcesListService.baseUrl + '?category=&';
        ResourcesListService['resourceUrl'] = currentlyImpossibleToGenerateSearchResourcesUrl;
        ResourcesListService.filterByPhone('');
        expect(ResourcesListService['resourceUrl']).toEqual(ResourcesListService.baseUrl + '');
    });

    it('getresourceByName() calls api/resource/name', () => {
        const targetReousrce: resources = testResources[1];
        const targetId: string = targetReousrce.resourceName;
        ResourcesListService.getresourceByName(targetId).subscribe(
            user => expect(user).toBe(targetReousrce)
        );

        const expectedUrl: string = ResourcesListService.baseUrl + '/' + targetId;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(targetReousrce);
    });

    it('adding a Resource calls api/resource/new', () => {
        const chores_name = { '$oid': 'chores_name' };
        const newResources: resources = {
            resourceName: 'chores_name',
            resourceBody: 'older Brother',
            resourcePhone: '320-1234-5568',
            resourcesUrl: 'Plunge toilet',
        };

        ResourcesListService.addNewresource(newResources).subscribe(
            id => {
                expect(name).toBe(chores_name);
            }
        );

        const expectedUrl: string = ResourcesListService.baseUrl + '/new';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(chores_name);
    });

    it('editing a Resource calls api/resource/edit', () => {
        const family_name = { '$oid': 'family_name' };
        const editResources: resources = {
            resourceName: 'family_name',
            resourceBody: 'Talk about my classes',
            resourcePhone: '320-588-4567',
            resourcesUrl: 'Call sister',
        };

        ResourcesListService.editResources(editResources).subscribe(
            name => {
                expect(name).toBe(family_name);
            }
        );

        const expectedUrl: string = ResourcesListService.baseUrl + '/edit';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(family_name);
    });

});
