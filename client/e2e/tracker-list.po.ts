import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';

export class TrackerPage {

    static navigateTo(): promise.Promise<any> {
        return browser.get('/trackers');
    }

    static typeAnEmoji(subject: string) {
        const input = element(by.id('trackerEmoji'));
        input.click();
        input.sendKeys(subject);
    }

    static backspace() {
        browser.actions().sendKeys(Key.BACK_SPACE).perform();
    }

    static getTrackers() {
        return element.all(by.className('trackers'));
    }

    // http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 200);
            return 'highlighted';
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    getTrackerTitle() {
        const title = element(by.id('tracker-list-title')).getText();
        this.highlightElement(by.id('tracker-list-title'));

        return title;
    }


    getUniqueTracker(id: string) {
        const tracker = element(by.id(id)).getText();
        this.highlightElement(by.id(id));

        return tracker;
    }
}
