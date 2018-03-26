import {Component} from '@angular/core';
import {EmergencyComponent} from "./home/emergency.component";
import {MatDialog} from '@angular/material';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Mongo-Angular-Spark lab';

    constructor(public dialog: MatDialog) {

    }

    openDialog(): void{
        const dialogRef = this.dialog.open(EmergencyComponent,{
            width: '500px',
            height: '500px'
        });
    }


}
