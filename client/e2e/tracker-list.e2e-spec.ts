import {TrackerPage} from './tracker-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

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
        expect(page.getTrackerTitle()).toEqual('Trackers');
    });

    it('should type something in filter emoji box and check that it returned correct element', () => {
        TrackerPage.navigateTo();
        TrackerPage.typeAnEmoji('h');
        expect(page.getUniqueTracker('58af3a600343927e48e8720f')).toEqual('March 1');
        TrackerPage.backspace();
        TrackerPage.typeAnEmoji("t");
        //expect(page.getUniqueTracker('58af3a600343927e48e87215')).toEqual('March 2');
    });

});
