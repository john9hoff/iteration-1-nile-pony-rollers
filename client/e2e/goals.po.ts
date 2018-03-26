import {browser, element, by, promise, ElementFinder} from 'protractor';
import {Key} from 'selenium-webdriver';

export class GoalPage {
    navigateTo(): promise.Promise<any> {
        return browser.get('/goals');
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

    getGoalManageTitle() {
        const title = element(by.id('goal-title')).getText();
        this.highlightElement(by.id('goal-title'));

        return title;
    }

    selectUpKey() {
        browser.actions().sendKeys(Key.ARROW_UP).perform();
    }

    backspace() {
        browser.actions().sendKeys(Key.BACK_SPACE).perform();
    }

    /*getCompany(company: string) {
        const input = element(by.id('userCompany'));
        input.click();
        input.sendKeys(company);
        const selectButton = element(by.id('submit'));
        selectButton.click();
    }

    getUserByAge() {
        const input = element(by.id('userName'));
        input.click();
        input.sendKeys(Key.TAB);
    }

    getUniqueGoal(purpose: string) {
        const user = element(by.id(email)).getText();
        this.highlightElement(by.id(email));

        return user;
    }

    getUsers() {
        return element.all(by.className('users'));
    }

    clickClearCompanySearch() {
        const input = element(by.id('companyClearSearch'));
        input.click();
    }

    buttonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('addNewUser'));
        return element(by.id('addNewUser')).isPresent();
    }

    clickAddUserButton(): promise.Promise<void> {
        this.highlightElement(by.id('addNewUser'));
        return element(by.id('addNewUser')).click();
    }*/

}
