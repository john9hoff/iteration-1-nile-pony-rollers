import {ReportChartPage} from "./report-chart.po";
import {browser, protractor} from "protractor";

const origFn = browser.driver.controlFlow().execute;

browser.driver.controlFlow().execute = function () {
    let args = arguments;

    // queue 100ms wait between test
    // This delay is only put here so that you can watch the browser do its thing.
    // If you're tired of it taking long you can remove this call
    origFn.call(browser.driver.controlFlow(), function () {
        return protractor.promise.delayed(100);
    });

    return origFn.apply(browser.driver.controlFlow(), args);
};

describe('Report Page', () => {
    let page: ReportChartPage;

    beforeEach(() => {
        page = new ReportChartPage();
    });

    // loads page
    it('should load', () => {
        ReportChartPage.navigateTo();
    });

    it('should get and highlight chart', () => {
       expect(page.getChart()).toEqual('myChart');
    });
});
