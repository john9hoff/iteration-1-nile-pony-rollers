import {browser, element, by, promise} from 'protractor';

export class ReportChartPage {

    static navigateTo(): promise.Promise<any> {
        return browser.get('/reports');
    }

};
