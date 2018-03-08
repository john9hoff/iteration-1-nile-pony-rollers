import {TrackerPage} from './tracker-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

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

describe('Tracker list', () => {
    let page: TrackerPage;

    beforeEach(() => {
        page = new TrackerPage();
    });

    // For examples testing modal dialog related things, see:
// https://code.tutsplus.com/tutorials/getting-started-with-end-to-end-testing-in-angular-using-protractor--cms-29318
// https://github.com/blizzerand/angular-protractor-demo/tree/final



    it('should get and highlight Trackers title attribute ', () => {
        TrackerPage.navigateTo();
        expect(page.getTrackerTitle()).toEqual('MoodTracker');
    });

    it('Should open a dropdown menu when status button is clicked', () => {
        TrackerPage.navigateTo();
        element(by.id('dropdown')).click();
        element(by.css('.mat-option[value="normal"]')).click();

        expect(page.getUniqueTracker('5aa1902a4cd5a50733f4f1f7')).toEqual('Fri Mar 01 17:28:28 CST 2018');

        element(by.id('dropdown')).click();
        element(by.css('.mat-option[value="sad"]')).click();

        expect(page.getUniqueTracker('5aa18ede4cd5a50733f4f1f3')).toEqual('Fri Feb 27 17:58:28 CST 2018');

    });

});
