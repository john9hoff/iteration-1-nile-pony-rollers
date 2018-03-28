import {Component, OnInit} from '@angular/core';
import {ResourcesService} from './resources.service';
import {Resource} from './resource';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {AddResourceComponent} from './add-resource.component';
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-resources-component',
    templateUrl: 'resources.component.html',
    styleUrls: ['./resources.component.css'],
})

export class ResourcesComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public resources: Resource[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public goalID: string;
    public goalPurpose: string;
    public goalCategory: string;
    public goalName: string;
    public goalStatus: string;

    // The ID of the goal
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the GoalsService into this component.
    constructor(public resourceService: ResourcesService, public dialog: MatDialog, public snackBar: MatSnackBar ) {

    }



    openDialog(): void {
        const newResource: Resource = {_id: '', resourceName:'', resourceBody:'', resourcePhone:'', resourcesUrl: ''};
        const dialogRef = this.dialog.open(ResourcesComponent, {
            width: '300px',
            data: { resource : newResource }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.resourceService.addNewResource(result).subscribe(
                addResourceResult => {
                    this.highlightedID = addResourceResult;
                    this.refreshResources();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the goal.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    deleteResource(_id: string){
        this.resourceService.deleteResource(_id).subscribe(
            resources => {
            },
            err => {
                console.log(err);
            }
        );

        this.refreshResources();
        this.loadService();
    }



    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }


    /**
     * Starts an asynchronous operation to update the goals list
     *
     */
    refreshResources(): Observable<Resource[]> {
        // Get Goals returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        const resourceObservable: Observable<Resource[]> = this.resourceService.getResources();
        resourceObservable.subscribe(
            resources => {

            },
            err => {
                console.log(err);
            });
        return resourceObservable;
    }


    loadService(): void {
        this.resourceService.getResources(this.goalCategory).subscribe(
            resources => {
                this.resources = resources;

            },
            err => {
                console.log(err);
            }
        );
    }


    ngOnInit(): void {
        this.refreshResources();
        this.loadService();
    }

}
