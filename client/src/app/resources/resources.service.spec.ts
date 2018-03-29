import {resources} from "./resources";
import {ResourceService} from "./resources.service"
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';



describe('Resources list service', () => {

    // A small collection of test goals
    const testResources: resources[] = [
        {
            _id: 'food_id',
            purpose: 'Gain some weight',
            category: 'Food',
            name: 'Eat all the cookies',
            phone: '320-522-6315'
        },
        {
            _id: 'chores_id',
            purpose: 'Have cleaner kitchen',
            category: 'Chores',
            name: 'Take out recycling',
            phone: '320-236-1248'
        },
        {
            _id: 'family_id',
            purpose: 'To love her',
            category: 'Family',
            name: 'Call mom',
            phone: '320-300-1000'
        }
    ];
    const mResources: resources[] = testResources.filter(Resource =>
        Resource.category.toLowerCase().indexOf('m') !== -1
    );

    let resourceListService: ResourceService;
    let currentlyImpossibleToGenerateSearchResourceUrl: string;

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
        resourceListService = new ResourceService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getResources() calls api/resource', () => {

        resourceListService.getResources().subscribe(
            resource => expect(resource).toBe(testResources)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(resourceListService.baseUrl);
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testResources);
    });

    it('getResources(resourcesCategory) adds appropriate param string to called URL', () => {
        resourceListService.getResources('m').subscribe(
            users => expect(users).toEqual(mResources)
        );

        const req = httpTestingController.expectOne(resourceListService.baseUrl + '?category=m&');
        expect(req.request.method).toEqual('GET');
        req.flush(mResources);
    });

    it('filterByCategory(resourcesCategory) deals appropriately with a URL that already had a category', () => {
        currentlyImpossibleToGenerateSearchResourceUrl = resourceListService.baseUrl + '?category=f&something=k&';
        resourceListService['resourceUrl'] = currentlyImpossibleToGenerateSearchResourceUrl;
        resourceListService.filterByCategory('m');
        expect(resourceListService['resourceUrl']).toEqual(resourceListService.baseUrl + '?something=k&category=m&');
    });

    it('filterByCategory(resourcesCategory) deals appropriately with a URL that already had some filtering, but no category', () => {
        currentlyImpossibleToGenerateSearchResourceUrl = resourceListService.baseUrl + '?something=k&';
        resourceListService['resourceUrl'] = currentlyImpossibleToGenerateSearchResourceUrl;
        resourceListService.filterByCategory('m');
        expect(resourceListService['resourceUrl']).toEqual(resourceListService.baseUrl + '?something=k&category=m&');
    });

    it('filterByCategory(resourcesCategory) deals appropriately with a URL has the keyword category, but nothing after the =', () => {
        currentlyImpossibleToGenerateSearchResourceUrl = resourceListService.baseUrl + '?category=&';
        resourceListService['resourceUrl'] = currentlyImpossibleToGenerateSearchResourceUrl;
        resourceListService.filterByCategory('');
        expect(resourceListService['resourceUrl']).toEqual(resourceListService.baseUrl + '');
    });

    it('getResourceByID() calls api/resource/id', () => {
        const targetResource: resources = testResources[1];
        const targetId: string = targetResource._id;
        resourceListService.getResourceByID(targetId).subscribe(
            user => expect(user).toBe(targetResource)
        );

        const expectedUrl: string = resourceListService.baseUrl + '/' + targetId;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(targetResource);
    });

    it('adding a Resource calls api/resource/new', () => {
        const chores_id = { '$oid': 'chores_id' };
        const newResources: resources = {
            _id: 'chores_id',
            purpose: 'Have cleaner bathroom',
            category: 'Chores',
            name: 'Plunge toilet',
            phone: '595-962-5236'
        };

        resourceListService.addNewResource(newResources).subscribe(
            id => {
                expect(id).toBe(chores_id);
            }
        );

        const expectedUrl: string = resourceListService.baseUrl + '/new';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(chores_id);
    });

    it('editing a Resource calls api/resource/edit', () => {
        const family_id = { '$oid': 'family_id' };
        const editResource: resources = {
            _id: 'family_id',
            purpose: 'Talk about my classes',
            category: 'Family',
            name: 'Call sister',
            phone: '125-854-2158'
        };

        resourceListService.editResource(editResource).subscribe(
            id => {
                expect(id).toBe(family_id);
            }
        );

        const expectedUrl: string = resourceListService.baseUrl + '/edit';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(family_id);
    });

});

