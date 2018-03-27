import {Component, OnInit} from '@angular/core';
import {ResourcesService} from "./resources.service";
import {resources} from './resources';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {AddResourcesComponent} from "./add-resources.component";

import {MatSnackBar} from '@angular/material';


@Component({
    selector: 'resources-component',
    templateUrl: 'resources.component.html',
    styleUrls: ['./resources.component.css'],
})

export class ResourcesComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public resource: resources[];
    public filteredResources: resources[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public resourcesName: string;
    public resourcesBody: string;
    public resourcesPhone: string;
    public resourcesUrl: string;


    // The ID of the resource
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the GoalsService into this component.
    constructor(public resourceService: ResourcesService, public dialog: MatDialog, public snackBar: MatSnackBar) {

    }

    isHighlighted(resource: resources): boolean {
        return resource.resourceName['$oid'] === this.highlightedID['$oid'];
    }

    openDialog(): void {
        const newResources: resources = {resourceName: '', resourceBody:'', resourcePhone:'', resourcesUrl:''};
        const dialogRef = this.dialog.open(AddResourcesComponent, {
            width: '300px',
            data: { resource : newResources }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.resourceService.addNewresource(result).subscribe(
                addresourcesResult => {
                    this.highlightedID = addresourcesResult;
                    this.refreshResource();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the Resource.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    deleteresources(_id: string){
        this.resourceService.deleteresources(_id).subscribe(
            resource => {
            },
            err => {
                console.log(err);
            }
        );

        this.refreshResource();
        this.loadService();
    }

    resourceSatisfied(theUserName: string, theBody: string, thePhoneNumber: string, theUrl: string) {
        const updatedResources: resources = {resourceName: theUserName, resourceBody: theBody, resourcePhone: thePhoneNumber, resourcesUrl: theUrl};
        this.resourceService.editResources(updatedResources).subscribe(
            editResourcesResult => {
                this.highlightedID = editResourcesResult;
                this.refreshGoals();
            },
            err => {
                console.log('There was an error editing the resources.');
                console.log('The error was ' + JSON.stringify(err));
            });
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

    public filterResource(searchBody: string, searchPhone: string,
                       searchUrl: string): resources[] {

        this.filteredResources = this.resource;

        // Filter by body
        if (searchBody != null) {
            searchBody = searchBody.toLocaleLowerCase();

            this.filteredResources = this.filteredResources.filter(resource => {
                return !searchBody || resource.resourceBody.toLowerCase().indexOf(searchBody) !== -1;
            });
        }

        // Filter by phone
        if (searchPhone != null) {
            searchPhone = searchPhone.toLocaleLowerCase();

            this.filteredResources = this.filteredResources.filter(resource => {
                return !searchPhone || resource.resourcePhone.toLowerCase().indexOf(searchPhone) !== -1;
            });
        }

        // Filter by url
        if (searchUrl != null) {
            searchUrl = searchUrl.toLocaleLowerCase();

            this.filteredResources = this.filteredResources.filter(resource => {
                return !searchUrl || resource.resourcesUrl.toLowerCase().indexOf(searchUrl) !== -1;
            });
        }
        return this.filteredResources;
    }

    /**
     * Starts an asynchronous operation to update the resources list
     *
     */
    refreshGoals(): Observable<resources[]> {
        // Get Goals returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)
        const ResourceObservable: Observable<resources[]> = this.resourceService.getresources();
        ResourceObservable.subscribe(
            resource => {
                this.resource = resource;
                this.filterResource(this.resourcesBody, this.resourcesPhone, this.resourcesUrl);
            },
            err => {
                console.log(err);
            });
        return ResourceObservable;
    }


    loadService(): void {
        this.resourceService.getresources(this.resourcesPhone).subscribe(
            resource => {
                this.resource = resource;
                this.filteredResources = this.resource;
            },
            err => {
                console.log(err);
            }
        );
    }


    ngOnInit(): void {
        this.refreshResource();
        this.loadService();
    }

}
