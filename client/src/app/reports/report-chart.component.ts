import {AfterViewInit, Component} from '@angular/core';
/* import {Chart} from 'chart.js'; */
import * as Chart from 'chart.js';

@Component({
    selector: 'report-chart-component',
    templateUrl: 'report-chart.component.html',
    styleUrls: ['./report-chart.component.css'],
})
export class ReportChartComponent implements AfterViewInit {
    constructor() {
    }

    // dummy function for figuring out how to reflect functions return values
    // for each bar/emotion
    public static getfifteen(){
        return 15;
    }

    canvas: any;
    ctx: any;

    ngAfterViewInit() {
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

                    // dummy data, this should be where our actual data should be
                    data: [ReportChartComponent.getfifteen(), 7, 12, 6, 9],

                    backgroundColor: ['#6600cc', '#33cc00', '#ffff00', '#ff8000', '#cc0000'],

                    borderWidth: 1,

                    borderColor: 'black',

                    hoverBorderWidth: 3,
                }]
            },
            options: {
                maintainAspectRatio: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        },
                        gridLines: {
                            display: true,
                            color: 'black',
                        },

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
                layout: {
                    padding: {
                        // commented out because it doesn't scale well
                        //top: 100,
                       // left: 400,
                       // right: 400,
                    }
                },
                toolTips: {
                    enabled: true,
                },
                responsive: true,
                display: true
            }
        });

        // Defining a plugin to provide data labels
        Chart.plugins.register({
            afterDatasetsDraw: function(chart) {
                let ctx = chart.ctx;

                chart.data.datasets.forEach(function (dataset, i) {
                    let meta = chart.getDatasetMeta(i);
                    if (!meta.hidden) {
                        meta.data.forEach(function(element, index) {

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

    }
}
