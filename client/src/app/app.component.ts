import {Component, OnInit} from '@angular/core';
import {EmergencyComponent} from "./home/emergency.component";
import {MatDialog} from '@angular/material';
import {gapi} from 'gapi-client';
import {GoogleSignInSuccess} from 'angular-google-signin';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
    title = 'Home';
    showButton = false;

    constructor(public dialog: MatDialog) {

    }

    openDialog(): void{
        const dialogRef = this.dialog.open(EmergencyComponent,{
            width: '500px',
            height: '500px'
        });
    }

    //New function to return the name of the active user
    //window.* is not defined, or 'gettable' straight from HTML *ngIf
    //So this function will return that
    getLoginName(){
        var name = window['name'];
        return name;
    }

    ngOnInit(){
        if(gapi == null || gapi.auth2 == null || gapi.auth2.getAuthInstance().isSignedIn.get() == true){
            this.showButton = true;
        } else{
            this.showButton = false;
        }

        console.log(this.showButton);
    }

    private myClientId: string = '296237216257-59cma82ojiteqbuo0iodmpb2kenrisf3.apps.googleusercontent.com';

    onGoogleSignInSuccess(event: GoogleSignInSuccess) {
        let googleUser: gapi.auth2.GoogleUser = event.googleUser;
        let id: string = googleUser.getId();
        let profile: gapi.auth2.BasicProfile = googleUser.getBasicProfile();
        console.log('ID: ' +
            profile
                .getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
    }




}
