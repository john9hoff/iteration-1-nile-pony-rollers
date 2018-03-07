import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MATERIAL_COMPATIBILITY_MODE } from '@angular/material';

import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';

import {UserListComponent} from './users/user-list.component';
import {UserListService} from './users/user-list.service';

import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';

import {CustomModule} from './custom.module';
import {AddUserComponent} from './users/add-user.component';

import {TrackerListComponent} from './trackers/tracker-list.component';
import {TrackerListService} from './trackers/tracker-list.service';

import {JournalListComponent} from "./journals/journal-list.component";
import {JournalListService} from "./journals/journal-list.service";
import {AddJournalComponent} from './journals/add-journal.component';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        Routing,
        CustomModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        UserListComponent,
        AddUserComponent,
        AddJournalComponent,
        TrackerListComponent,
        JournalListComponent
    ],
    providers: [
        UserListService,
        TrackerListService,
        JournalListService,
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}
    ],
    entryComponents: [
        AddUserComponent,
        AddJournalComponent
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
