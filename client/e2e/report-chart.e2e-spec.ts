import {ReportChartPage} from "./report-chart.po";


describe('Report Page', () => {
    let page: ReportChartPage;

    beforeEach(() => {
        page = new ReportChartPage();
    });

    // loads page
    it('should load', () => {
        ReportChartPage.navigateTo();
    });


});
