import {Component, OnInit} from '@angular/core';
import * as Chart from 'chart.js';
import {Tracker} from "../trackers/tracker";
import {ReportChartService} from "./report-chart.service";

@Component({
    selector: 'report-chart-component',
    templateUrl: 'report-chart.component.html',
    styleUrls: ['./report-chart.component.css'],
    providers: [ReportChartService]

})

export class ReportChartComponent implements OnInit {
    // Inject the ReportChartService into this component.
    constructor(public reportChartService: ReportChartService) {

    }

    public reports: Tracker[];
    public filteredReports: Tracker[];
    canvas: any;
    ctx: any;

    ngOnInit() {
        this.reportChartService.getReports().subscribe(res => {
            this.reports = res;
            this.canvas = document.getElementById('myChart');
            document.getElementById('myChart');
            this.ctx = this.canvas.getContext('2d');
            this.buildChart();
            this.setPlugin();

        })
    }


    public setPlugin () {
        //global options
        Chart.defaults.global.defaultFontFamily = 'lato';
        Chart.defaults.global.defaultFontColor = 'black';
        Chart.defaults.global.defaultFontSize = 18;

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
                            ctx.fillText(dataString, position.x, position.y - (fontSize / 2) -padding);
                        });
                    }
                });
            }
        });
    }

    public buildChart() {
        let chart =  new Chart(this.ctx, {
            type: 'bar',

            data: {
                labels: ["Radiant", "Happy", "Meh", "Sad", "Very Sad"],

                datasets: [{
                    label: 'Total times logged',

                    data: this.getValues(),

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
        return chart;

    }

    public getValues () {
        var values = [];
        values.push(this.filterReports("Radiant").length);
        values.push(this.filterReports("Happy").length);
        values.push(this.filterReports("Meh").length);
        values.push(this.filterReports("Down").length);
        values.push(this.filterReports("Sad").length);
        return values;
    }

    //Filtering according to an emoji type
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

}

