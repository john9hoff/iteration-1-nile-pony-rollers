import {JournalPage} from './journal-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

describe('Journal list', () => {
    let page: JournalPage;

    beforeEach(() => {
        page = new JournalPage();
    });

    it('Should get and highlight Goals title attribute ', () => {
        page.navigateTo();
        expect(page.getJournalManageTitle()).toEqual('Your Journals');
    });

    it('Should have an add journal button', () => {
        page.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });

    it('Total number of journals should be 23', () => {
        page.navigateTo();
        expect(page.getJournals()).toEqual(23);
    });

    it('Should type something in filter subject box and check that it returned correct element', () => {
        page.navigateTo();
        page.typeASubject('Wed');
        expect(page.getUniqueJournal('58af3a600343927e48e8722c')).toEqual('Wednesday');
    });

    it('Should click on a unique journal in the accordion', () => {
        page.navigateTo();
        page.clickUniqueJournal("5abab41029fb8de16b8a3a10")
    });

    it('Should open a dialog box when add journal button is clicked', () => {
        page.navigateTo();
        expect(element(by.className('add-journal')).isPresent()).toBeFalsy('There should not be a modal window yet');
        element(by.className('journal-button')).click();
        expect(element(by.className('add-journal')).isPresent()).toBeTruthy('There should be a modal window now');
    });

    it('Should actually add the journal with the information we put in the fields', () => {
        page.navigateTo();
        page.clickAddJournalButton();
        element(by.id('subjectField')).sendKeys('Sad day');
        element(by.id('bodyField')).sendKeys('Today was sad because my pet rock got hit by a car.');
        element(by.id('confirmAddJournalButton')).click();
    });

});
