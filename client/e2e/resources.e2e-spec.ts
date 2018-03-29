import {ResourcePage} from "./resources.po";
import {browser, protractor, element, by} from 'protractor';

const origFn = browser.driver.controlFlow().execute;

browser.driver.controlFlow().execute = function () {
    let args = arguments;
    // queue 5ms wait between test
    // This delay is only put here so that you can watch the browser do its thing.
    origFn.call(browser.driver.controlFlow(), function () {
        return protractor.promise.delayed(100);
    });
    return origFn.apply(browser.driver.controlFlow(), args);
};

describe('Resource list', () => {
    let page: ResourcePage;

    beforeEach(() => {
        page = new ResourcePage();
    });

    it('Should get and highlight Resources title attribute ', () => {
        page.navigateTo();
        expect(page.getResourceManageTitle()).toEqual('Your Reources');
    });

    it('Should check that Resource with name: \'Go to bed early\' matches unique id', () => {
        page.navigateTo();
        expect(page.getUniqueResource('bob')).toContain('Go to bed early');
    });

    it('Total number of Resources should be 15', () => {
        page.navigateTo();
        expect(page.getResources()).toEqual(15);
    });

    it('Should check that Resource with resourcePhone: \'To surprise Bobby\' matches unique id', () => {
        page.navigateTo();
        expect(page.getUniqueResource('Bob')).toContain('To surprise Bobby');
    });

   /* it('Should check that Resource with status: \'Incomplete\' matches unique id', () => {
        page.navigateTo();
        expect(page.getUniqueResource('5ab53a89ea32d59c4e81d5f0')).toContain('Status: Incomplete');
    });

    it('Should check that Resource with status: \'Complete\' matches unique id', () => {
        page.navigateTo();
        expect(page.getUniqueResource('5ab53a8907d923f68d03e1a3')).toContain('Status: Complete');
    });*/

    it('Should have an add Resource button', () => {
        page.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });

    it('Should open a dialog box when add Resource button is clicked', () => {
        page.navigateTo();
        expect(element(by.className('add-Resource')).isPresent()).toBeFalsy('There should not be a modal window yet');
        element(by.className('Resource-button')).click();
        expect(element(by.className('add-Resource')).isPresent()).toBeTruthy('There should be a modal window now');
    });

    it('Should actually add the Resource with the information we put in the fields', () => {
        page.navigateTo();
        page.clickAddResourceButton();
        element(by.id('nameField')).sendKeys('Clean up computer lab');
        page.pickChoresOption();
        element(by.id('purposeField')).sendKeys('Get more people to come');
        page.actuallyAddResource();
    });

    it('Should click check button to change Resource to complete', () => {
        page.navigateTo();
        expect(page.getUniqueResource('5ab53a89ea32d59c4e81d5f0')).toContain('Status: Incomplete');
        expect(element(by.id('completeresources')).isPresent()).toBeTruthy('There should be a \'complete Resource\' green check button');
        element(by.id('completeresources')).click();
    });

});
