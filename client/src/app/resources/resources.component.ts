import {Component, OnInit} from '@angular/core';
import {ResourcesService} from "./resources.service";
import {resources} from './resources';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {AddResourcesComponent} from "./add-resources.component";
import {resource} from "selenium-webdriver/http";

@Component({
    selector: 'resources-component',
    templateUrl: 'resources.component.html',
    styleUrls: ['./resources.component.css'],
})


export class ResourcesComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public resources: resources[];
    public filteredResource: resources[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public resourceUrl: string;
    public resourceBody: string;
    public resourcePhone: string;

    // The ID of the goal
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the ResourcesService into this component.
    constructor(public resourceService: ResourcesService, public dialog: MatDialog) {

    }

    isHighlighted(resource: resources): boolean {
        return resource.resourceName['$oid'] === this.highlightedID['$oid'];
    }

    openDialog(): void {
        const newRESOURCES: resources = {resourceName: '', resourceBody:'', resourcePhone:'', resourcesUrl:''};
        const dialogRef = this.dialog.open(AddResourcesComponent, {
            width: '300px',
            data: { Resources : newRESOURCES }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.resourceService.addNewresource(result).subscribe(
                addresourceResult => {
                    this.highlightedID = addresourceResult;
                    this.refreshGoals();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the goal.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    public filterResources(searchBody: string, searchPhone: string, searchName: string): resources[] {

        this.filteredResource = this.resource;

        // Filter by resources
        if (searchBody != null) {
            searchBody = searchBody.toLocaleLowerCase();

            this.filteredResource = this.filteredResource.filter(goal => {
                return !searchBody || Resources.resourceBody.toLowerCase().indexOf(searchBody) !== -1;
            });
        }

        // Filter by category
        if (searchPhone != null) {
            searchPhone = searchPhone.toLocaleLowerCase();

            this.filteredResource = this.filteredResource.filter(goal => {
                return !searchPhone || Resources.category.toLowerCase().indexOf(searchPhone) !== -1;
            });
        }

        // Filter by name
        if (searchName != null) {
            searchName = searchName.toLocaleLowerCase();

            this.filteredResource = this.filteredResource.filter(goal => {
                return !searchName || goal.name.toLowerCase().indexOf(searchName) !== -1;
            });
        }

        return this.filteredResource;
    }

    /**
     * Starts an asynchronous operation to update the goals list
     *
     */
    refreshGoals(): Observable<resources[]> {
        // Get Goals returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)
        const goalObservable: Observable<resources[]> = this.goalService.getresources();
        goalObservable.subscribe(
            goals => {
                this.goals = goals;
                this.filterGoals(this.goalPurpose, this.goalCategory, this.goalName);
            },
            err => {
                console.log(err);
            });
        return goalObservable;
    }


    loadService(): void {
        this.resourceService.getresources(this.goalCategory).subscribe(
            resource => {
                this.resources = resource;
                this.filteredResource = this.resources;
            },
            err => {
                console.log(err);
            }
        );
    }


    ngOnInit(): void {
        this.refreshGoals();
        this.loadService();
    }
}
