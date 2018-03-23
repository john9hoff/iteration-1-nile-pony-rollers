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
                    data: [ReportChartComponent.getfifteen(), 7, 2, 6, 9],

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
                        //left: 100,
                        //right: 100,
                    }
                },
                toolTips: {
                    enabled: true,
                },
                responsive: true,
                display: true
            }
        });
    }
}
