

import {TrackerPage} from './tracker-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';
import {Tracker} from "../src/app/trackers/tracker";

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




    it('should gt and highlight Trackers title attribute ', () => {
        TrackerPage.navigateTo();
        page.clickDropdown();
        element(by.css('.mat-option[value="happy"]')).click();
    });

    it('It should select the dropdown and click on normal', () => {
        TrackerPage.navigateTo();
        page.clickDropdown();
        element(by.css('.mat-option[value="normal"]')).click();
    });

    it('It should select the dropdown and click on anxious', () => {
        TrackerPage.navigateTo();
        page.clickDropdown();
        element(by.css('.mat-option[value="anxious"]')).click();
    });

    it('It should select the dropdown and click on sad', () => {
        TrackerPage.navigateTo();
        page.clickDropdown();
        element(by.css('.mat-option[value="sad"]')).click();
    });

    it('It should select the dropdown and click on angry', () => {
        TrackerPage.navigateTo();
        page.clickDropdown();
        element(by.css('.mat-option[value="angry"]')).click();
    });

    it('It should select the dropdown and click on a blank entry', () => {
        TrackerPage.navigateTo();
        page.clickDropdown();
        element(by.css('.mat-option[value=""]')).click();
    });

    // it('Should actually click the navigation buttons and still have 10 journals on page everytime', () => {
    //     TrackerPage.navigateTo();
    //     page.clickFirstIndexButton();
    //     expect(page.getTrackers()).toEqual(10);
    //     page.clickLastIndexButton();
    //     expect(page.getTrackers()).toEqual(10);
    //     page.clickPrevIndexButton();
    //     page.clickPrevIndexButton();
    //     expect(page.getTrackers()).toEqual(10);
    //     page.clickNextIndexButton();
    //     page.clickNextIndexButton();
    //     expect(page.getTrackers()).toEqual(10);
    // });





});

