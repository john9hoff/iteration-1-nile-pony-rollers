import {browser, element, by, promise} from 'protractor';
import {Key} from 'selenium-webdriver';

export class TrackerPage {

    navigateTo(): promise.Promise<any> {
        return browser.get('/trackers');
    }

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

    clickDropdown(): promise.Promise<void> {
        this.highlightElement(by.id('dropdown'));
        return element(by.id('dropdown')).click();
    }


}
