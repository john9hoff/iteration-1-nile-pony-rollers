import {browser, promise, by, element} from 'protractor';

export class ReportChartPage {

    static navigateTo(): promise.Promise<any> {
        return browser.get('/reports');
    };

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
    };

    static getChart() {
        const chart = element(by.id('myChart'));
        //this.highlightElement(by.id('myChart'));
        return chart;
    }

}
