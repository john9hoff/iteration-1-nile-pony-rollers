import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {TestBed} from "@angular/core/testing";
import {HttpClient} from "@angular/common/http";
import {ReportChartService} from "./report-chart.service";


describe('report chart service: ', () => {

    // add code here


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

    it('getReports() calls calls api/reports', () => {
        //
        reportChartService.getReports().subscribe(
            => expect().toBe()
        );

        reportChartService.getReports().subscribe(
            => expect().toBe()
        );
    });

})
