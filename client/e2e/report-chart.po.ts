import {browser, promise} from 'protractor';

export class ReportChartPage {

    static navigateTo(): promise.Promise<any> {
        return browser.get('/reports');
    };
}
