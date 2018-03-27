import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {TestBed} from "@angular/core/testing";
import {HttpClient} from "@angular/common/http";
import {ReportChartService} from "./report-chart.service";
import {Tracker} from "../trackers/tracker";

describe('report chart service: ', () => {

    const testTrackers: Tracker[] = [
        {
            _id:	"5ab88ab1961fb0a8f5824696",
            email:	"opheliawinters@flexigen.com",
            rating:	2,
            emoji:	"Sad",
            date:	"Sun Dec 19 1993 15:29:48 GMT-0600 (CST)"
        },
        {
            _id:	"5ab88ab13d9659e4c8ee15d6",
            email:	"gildatorres@flexigen.com",
            rating:	1,
            emoji:	"Sad",
            date:	"Wed Jul 10 1985 04:56:21 GMT-0500 (CDT)"
        },
        {
            _id:	"5ab88ab1e0e43a1897d13e23",
            email:	"minniehouse@flexigen.com",
            rating:	3,
            emoji:	"Radiant",
            date:	"Mon Nov 19 1984 23:44:01 GMT-0600 (CST)"
        }
    ];

    let reportChartService: ReportChartService;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        // Set up the mock handling of the HTTP requests
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);

        reportChartService = new ReportChartService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getReports() calls calls api/reports', (done) => {
        //
        reportChartService.getReports().subscribe(
            reports => {
                expect(reports.length).toBe(3);
                done();

            });

        const req = httpTestingController.expectOne(reportChartService.baseUrl);
        expect(req.request.method).toEqual('GET');

        req.flush(testTrackers);

    });})
