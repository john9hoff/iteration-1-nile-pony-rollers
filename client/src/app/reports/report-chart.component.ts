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

    canvas: any;
    ctx: any;

    ngAfterViewInit() {
        this.canvas = document.getElementById('myChart');
        this.ctx = this.canvas.getContext('2d');

        //global options

        Chart.defaults.global.defaultFontFamily = 'lato';
        Chart.defaults.global.defaultFontColor = 'black';
        //Chart.defaults.global.defaultFontSize = 18;

        let myChart = new Chart(this.ctx, {
            type: 'horizontalBar',

            data: {
                labels: ['Radiant', 'Happy', 'Meh', 'Down', 'Sad'],

                datasets: [{
                    label: 'Total Emotions Logged',

                    data: [5, 7, 2, 6, 9],

                    backgroundColor: ['blue', 'green', 'yellow', 'orange', 'red'],

                    borderWidth: 1,

                    borderColor: 'black',

                    hoverBorderWidth: 3,
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                        }
                    }]
                },
                title: {
                    display: true,
                    text: 'Emotion Graph',
                    fontSize: 30,
                },
                legend: {
                    position: 'bottom',
                    display: false,
                },
                layout: {
                    // stuff can go here
                },
                toolTips: {
                    enabled: true,
                },
                responsive: false,
                display: true
            }
        });
    }
}
