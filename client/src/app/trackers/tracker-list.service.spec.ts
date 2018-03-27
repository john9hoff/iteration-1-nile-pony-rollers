import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Tracker} from './tracker';
import {TrackerListService} from './tracker-list.service';

describe('Tracker list service: ', () => {
    // A small collection of test trackers
    const testTrackers: Tracker[] = [
        {
            _id:'song_id',
            rating: 2,
            emoji: 'sad',
            date: 'March 26',
            email: ''
        },
        {
            _id: 'pat_id',
            rating:3,
            emoji:'happy',
            date:'April 1',
            email: ''
        },
        {
            _id: 'jamie_id',
            rating:5,
            emoji:'angry',
            date:'April 1',
            email: ''
        }
    ];
    const mTrackers: Tracker[] = testTrackers.filter(tracker =>
        tracker.emoji.toLowerCase().indexOf('happy') !== -1
    );

    // We will need some url information from the trackerListService to meaningfully test company filtering;
    // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
    let trackerListService: TrackerListService;
    let currentlyImpossibleToGenerateSearchTrackerUrl: string;

    // These are used to mock thrating:3,
    // have the server running and (b) we can check exactly which HTTP
    // requests were made to ensure that we're making the correct requests.
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
        trackerListService = new TrackerListService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getTrackers() calls api/trackers', () => {
        // Assert that the trackers we get from this call to getTrackers()
        // should be our set of test trackers. Because we're subscribing
        // to the result of getTrackers(), this won't actually get
        // checked until the mocked HTTP request "returns" a response.
        // This happens when we call req.flush(testTrackers) a few lines
        // down.
        trackerListService.getTrackers().subscribe(
            trackers => expect(trackers).toBe(testTrackers)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(trackerListService.baseUrl);
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testTrackers);
    });

    it('getTrackers(trackerEmoji) adds appropriate param string to called URL', () => {
        trackerListService.getTrackers('happy').subscribe(
            trackers => expect(trackers).toEqual(mTrackers)
        );

        const req = httpTestingController.expectOne(trackerListService.baseUrl + '?emoji=happy&');
        expect(req.request.method).toEqual('GET');
        req.flush(mTrackers);
    });



    it('filterByEmoji(trackerEmoji) deals appropriately with a URL has the happy emoji', () => {
        currentlyImpossibleToGenerateSearchTrackerUrl = trackerListService.baseUrl + '?emoji=happy&';
        trackerListService['trackerUrl'] = currentlyImpossibleToGenerateSearchTrackerUrl;
        trackerListService.filterByEmoji('happy');
        expect(trackerListService['trackerUrl']).toEqual(trackerListService.baseUrl + '?emoji=happy&');
    });


    it('filterByEmoji(trackerEmoji) deals appropriately with a URL has nothing in the emoji', () => {
        currentlyImpossibleToGenerateSearchTrackerUrl = trackerListService.baseUrl + '?emoji=&';
        trackerListService['trackerUrl'] = currentlyImpossibleToGenerateSearchTrackerUrl;
        trackerListService.filterByEmoji('');
        expect(trackerListService['trackerUrl']).toEqual(trackerListService.baseUrl + '');
    });


    it('adding a tracker calls api/trackers/new', () => {
        const jesse_id = { '$oid': 'jesse_id' };
        const newTracker: Tracker = {
            _id: '',
            rating: 2,
            emoji: 'sad',
            date: 'March 26',
            email: ''
        };

        trackerListService.addNewEmoji(newTracker).subscribe(
            id => {
                expect(id).toBe(jesse_id);
            }
        );

        const expectedUrl: string = trackerListService.baseUrl + '/new';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(jesse_id);
    });



});
