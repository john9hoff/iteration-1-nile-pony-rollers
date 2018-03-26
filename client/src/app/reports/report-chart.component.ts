import {AfterViewInit, Component, OnInit, DoCheck, AfterContentInit, OnChanges} from '@angular/core';
import * as Chart from 'chart.js';
import {Tracker} from "../trackers/tracker";
import {ReportChartService} from "./report-chart.service";
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'report-chart-component',
    templateUrl: 'report-chart.component.html',
    styleUrls: ['./report-chart.component.css'],
    providers: [ReportChartService]

})

export class ReportChartComponent implements OnInit, OnChanges {
    // Inject the ReportChartService into this component.
    constructor(public reportChartService: ReportChartService) {

    }

    // These are public so that tests can reference them (.spec.ts)
    public reports: Tracker[];
    public filteredReports: Tracker[];
    public reportSubject: string;
    public reportBody: string;
    public searchEmoji: string;
    public numberOfHappy: number;
    public numberOfVeryHappy: number;
    public numberOfNormal: number;
    public numberOfSad: number;
    public numberOfVerySad: number;

    canvas: any;
    ctx: any;

    ngOnInit() {
        this.reportChartService.getReports().subscribe(res => {
            this.reports = res;
            this.numberOfVeryHappy = this.filterReports("Radiant").length;
            this.numberOfHappy = this.filterReports("Happy").length;
            this.numberOfNormal = this.filterReports("Meh").length;
            this.numberOfSad = this.filterReports("Down").length;
            this.numberOfVerySad = this.filterReports("Sad").length;
            this.canvas = document.getElementById('myChart');
            this.ctx = this.canvas.getContext('2d');

            //global options
            Chart.defaults.global.defaultFontFamily = 'lato';
            Chart.defaults.global.defaultFontColor = 'black';
            Chart.defaults.global.defaultFontSize = 18;

            let myChart = new Chart(this.ctx, {
                type: 'bar',

                data: {
                    labels: ['Radiant', 'Happy', 'Meh', 'Down', 'Sad'],

                    datasets: [{
                        label: 'Total times logged',

                        data: [this.numberOfVeryHappy, this.numberOfHappy, this.numberOfNormal, this.numberOfSad, this.numberOfVerySad],

                        backgroundColor: ['rgba(127,63,191,0.8)', 'rgba(63,191,63,0.8)',
                            'rgba(248,248,63,0.8)', 'rgba(244,135,26,0.8)', 'rgb(244,26,26,0.8)'],

                        borderWidth: 1,

                        borderColor: 'black',

                        hoverBorderWidth: 3,
                    }]
                },
                options: {
                    responsive: true,
                    display: true,
                    maintainAspectRatio: true,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                            },
                            gridLines: {
                                display: true,
                                color: 'black',
                                offsetGridLines: false,
                            }
                        }]
                    },
                    title: {
                        display: true,
                        text: 'Emotion Graph',
                        fontSize: 24,
                    },
                    legend: {
                        position: 'bottom',
                        display: false,
                    },
                    layout: {},

                    toolTips: {
                        enabled: true,
                    }
                }
            });

            // Defining a plugin to provide data labels
            Chart.plugins.register({
                afterDatasetsDraw: function (chart) {
                    let ctx = chart.ctx;

                    chart.data.datasets.forEach(function (dataset, i) {
                        let meta = chart.getDatasetMeta(i);
                        if (!meta.hidden) {
                            meta.data.forEach(function (element, index) {

                                // properties for text above each bar
                                ctx.fillStyle = 'black';
                                let fontSize = 16;
                                let fontStyle = 'normal';
                                let fontFamily = 'Helvetica Neue';
                                ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                                // Just naively convert to string for now
                                let dataString = dataset.data[index].toString();

                                // alignment properties for the numbers above each bar
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';

                                let padding = 5;
                                let position = element.tooltipPosition();
                                ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
                            });
                        }
                    });
                }
            });
        })
    }

    public filterReports(searchEmoji: string): Tracker[] {

        this.filteredReports = this.reports;
        // Filter by subject
        if (searchEmoji != null) {
            searchEmoji = searchEmoji.toLocaleLowerCase();

            this.filteredReports = this.filteredReports.filter(tracker => {
                return !searchEmoji || tracker.emoji.toLowerCase().indexOf(searchEmoji) !== -1;
            });
        }


        return this.filteredReports;
    }

    /**
     * Starts an asynchronous operation to update the journals list
     *
     */
    refreshReports(): Observable<Tracker[]> {
        // Get Journals returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        const reportListObservable: Observable<Tracker[]> = this.reportChartService.getReports();
        reportListObservable.subscribe(
            reports => {
                this.reports = reports;
                this.filterReports(this.searchEmoji);
            },
            err => {
                console.log(err);
            });
        return reportListObservable;
    }


    loadService(): void {
        this.reportChartService.getReports().subscribe(
            reports => {
                this.reports = reports;
                this.filteredReports = this.reports;
            },
            err => {
                console.log(err);
            }
        );
    }

    ngOnChanges(): void {
        this.refreshReports();
        this.loadService();
    }
}
