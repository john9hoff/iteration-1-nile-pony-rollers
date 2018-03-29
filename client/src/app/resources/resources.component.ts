import {Component, OnInit} from '@angular/core';
import {ResourceService} from "./resources.service"
import {resources} from './resources';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {AddResourcesComponent} from "./add-resources.component";

import {MatSnackBar} from '@angular/material';


@Component({
    selector: 'app-resources-component',
    templateUrl: 'resources.component.html',
    styleUrls: ['./resources.component.css'],
})

export class ResourcesComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public resource: resources[];
    public filteredResources: resources[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public resourcesID: string;
    public resourcesPurpose: string;
    public resourcesCategory: string;
    public resourcesPhone: string;
    public resourcesName: string



    // The ID of the resource
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the GoalsService into this component.
    constructor(public resourceService: ResourceService, public dialog: MatDialog, public snackBar: MatSnackBar) {

    }

    isHighlighted(resource: resources): boolean {
        return resource._id['$oid'] === this.highlightedID['$oid'];
    }

    openDialog(): void {
        const newResources: resources = {_id: '', name:'', purpose:'', phone:'', category: ''};
        const dialogRef = this.dialog.open(AddResourcesComponent, {
            width: '300px',
            data: { resource : newResources }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            this.resourceService.addNewResource(result).subscribe(
                addResourcesResult => {
                    this.highlightedID = addResourcesResult;
                    this.refreshResources();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the Resource.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    deleteResources(_id: string){
        this.resourceService.deleteResource(_id).subscribe(
            resource => {
            },
            err => {
                console.log(err);
            }
        );

        this.refreshResources();
        this.loadService();
    }

    resourceSatisfied(_id: string, thePurpose: string, thePhone: string, theName: string, theCategory: string) {
        const updatedResources: resources = {_id: _id, purpose: thePurpose, phone: thePhone, name: theName, category: theCategory};
        this.resourceService.editResource(updatedResources).subscribe(
            editResourcesResult => {
                this.highlightedID = editResourcesResult;
                this.refreshResources();
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

    public filterResource(searchPurpose: string, searchPhone: string,
                       searchName: string, searchCategory: string): resources[] {

        this.filteredResources = this.resource;

        // Filter by body
        if (searchPurpose != null) {
            searchPurpose = searchPurpose.toLocaleLowerCase();

            this.filteredResources = this.filteredResources.filter(resource => {
                return !searchPurpose || resource.purpose.toLowerCase().indexOf(searchPurpose) !== -1;
            });
        }

        // Filter by phone
        if (searchCategory != null) {
            searchCategory = searchCategory.toLocaleLowerCase();

            this.filteredResources = this.filteredResources.filter(resource => {
                return !searchCategory || resource.category.toLowerCase().indexOf(searchCategory) !== -1;
            });
        }

        // Filter by url
        if (searchName != null) {
            searchName = searchName.toLocaleLowerCase();

            this.filteredResources = this.filteredResources.filter(resource => {
                return !searchName || resource.name.toLowerCase().indexOf(searchName) !== -1;
            });
        }

        if (searchPhone != null) {
            searchPhone = searchPhone.toLocaleLowerCase();

            this.filteredResources = this.filteredResources.filter(resource => {
                return !searchPhone || resource.phone.toLowerCase().indexOf(searchPhone) !== -1;
            });
        }
        return this.filteredResources;
    }

    /**
     * Starts an asynchronous operation to update the resources list
     *
     */
    refreshResources(): Observable<resources[]> {
        // Get Goals returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)
        const ResourceObservable: Observable<resources[]> = this.resourceService.getResources();
        ResourceObservable.subscribe(
            resource => {
                this.resource = resource;
                this.filterResource(this.resourcesPurpose, this.resourcesPhone, this.resourcesName, this.resourcesCategory);
            },
            err => {
                console.log(err);
            });
        return ResourceObservable;
    }


    loadService(): void {
        this.resourceService.getResources(this.resourcesCategory).subscribe(
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
        this.refreshResources();;
        this.loadService();
    }

}
