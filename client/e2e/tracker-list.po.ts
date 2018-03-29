import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';

export class TrackerPage {

    static navigateTo(): promise.Promise<any> {
        return browser.get('/trackers');
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

    selectDownKey() {
        browser.actions().sendKeys(Key.ARROW_DOWN).perform();
    }

    selectEnter() {
        browser.actions().sendKeys(Key.ENTER).perform();
    }

    clickAddFilterButton(): promise.Promise<void> {
        this.highlightElement(by.id('dropdown'));
        return element(by.id('dropdown')).click();
    }

    clickAddGoalButton(): promise.Promise<void> {
        this.highlightElement(by.id('dropdown'));
        return element(by.className('dropdown')).click();
    }

    getUniqueTracker(id1: string) {
        const tracker = element(by.id(id1)).getText();
        this.highlightElement(by.id(id1));
        return tracker;
    }


    pickChoresOption(){
        const input = element(by.id('dropdown'));
        input.click();
        this.selectEnter();
    }


    selectEmotionMarkDown(): promise.Promise<boolean> {
        this.highlightElement(by.id('dropdown'));
        return element(by.id('dropdown')).isPresent();
    }

    clickDropdown(): promise.Promise<void> {
        this.highlightElement(by.id('dropdown'));
        return element(by.id('dropdown')).click();
    }

    getTrackers() {
        return element.all(by.className('trackers')).count();
    }


    clickDropDownValue(): promise.Promise<void> {
        this.highlightElement(by.className('trackerEmoji'));
        return element(by.cssContainingText('value', 'happy')).click();
    }

    clickNextIndexButton(): promise.Promise<void> {
        this.highlightElement(by.id('nextIndexTracker'));
        return element(by.id('nextIndexTracker')).click();
    }

    clickPrevIndexButton(): promise.Promise<void> {
        this.highlightElement(by.id('prevIndexTracker'));
        return element(by.id('prevIndexTracker')).click();
    }

    clickFirstIndexButton(): promise.Promise<void> {
        this.highlightElement(by.id('firstIndexTracker'));
        return element(by.id('firstIndexTracker')).click();
    }

    clickLastIndexButton(): promise.Promise<void> {
        this.highlightElement(by.id('lastIndexTracker'));
        return element(by.id('lastIndexTracker')).click();
    }


}
