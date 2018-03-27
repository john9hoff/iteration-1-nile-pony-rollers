import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {ReportChartComponent} from './report-chart.component';
import {ReportChartService} from "./report-chart.service";
import {Observable} from 'rxjs/Observable';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {Tracker} from "../trackers/tracker";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';


describe('report list', () => {

    let reportList: ReportChartComponent;
    let fixture: ComponentFixture<ReportChartComponent>;

    let reportListServiceStub: {
        getReports: () => Observable<Tracker[]>
    };

    beforeEach(() => {
        // stub UserService for test purposes
        reportListServiceStub = {
            getReports: () => Observable.of([
                {
                    _id: '5ab88ab1543afe51da42359e',
                    rating: 3,
                    emoji: 'Radiant',
                    date: 'Tue Jul 27 1971 03:15:18 GMT-0500 (CDT)',
                    email: 'opheliawinters@flexigen.com',
                },
                {
                    _id: '5ab88ab1a5b4ebf66df44c40',
                    rating: 4,
                    emoji: 'Radiant',
                    date: 'Thu Jan 30 1975 19:53:45 GMT-0600 (CST)',
                    email: 'barnesjustice@flexigen.com',

                },
                {
                    _id: '5ab88ab18c7e0cf6c7886964',
                    rating: 3,
                    emoji: 'Sad',
                    date: 'Tue Jan 14 2014 18:35:56 GMT-0600 (CST)',
                    email: 'sashawatson@flexigen.com',

                }
            ])

        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [ReportChartComponent],
            // providers:    [ UserListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: ReportChartService, useValue: reportListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ReportChartComponent);
            reportList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    //
    // it('contains all the emojis', () => {
    //     expect(reportList.reports.length).toBe(3);
    // });


})



