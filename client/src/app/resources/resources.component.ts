import {Component, OnInit} from '@angular/core';
import {ResourcesService} from "./resources.service";
import {resources} from './resources';

import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {AddResourcesComponent} from "./add-resources.component";

@Component({
    selector: 'resources-component',
    templateUrl: 'resources.component.html',
    styleUrls: ['./resources.component.css'],
})
export class ResourcesComponent {
    public title: string;

    constructor() {
        this.title = 'Resources';
    }
}
export class ResourceComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public resourcess: resources[];
    public filteredResources: resources[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public resourcePurpose: string;
    public resourcePhone: string;
    public resourceName: string;

    // The ID of the goal
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the GoalsService into this component.
    constructor(public resourceService: ResourcesService, public dialog: MatDialog) {

    }

    isHighlighted(resource: resources): boolean {
        return resource.resourceName['$oid'] === this.highlightedID['$oid'];
    }

    openDialog(): void {
        const newGoal: resources = {resourceName: '', resourceBody:'', resourcePhone:'', resourcesUrl:''};
        const dialogRef = this.dialog.open(AddResourcesComponent, {
            width: '300px',
            data: { goal : newGoal }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.resourceService.addNewresource(result).subscribe(
                addResourceResult => {
                    this.highlightedID = addResourceResult;
                    this.refreshGoals();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the goal.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    /**public filterresources(searchresources: string, searchCategory: string, searchName: string): resources[] {

        this.filteredGoals = this.goals;

        // Filter by goal
        if (searchGoal != null) {
            searchGoal = searchGoal.toLocaleLowerCase();

            this.filteredGoals = this.filteredGoals.filter(goal => {
                return !searchGoal || goal.purpose.toLowerCase().indexOf(searchGoal) !== -1;
            });
        }

        // Filter by category
        if (searchCategory != null) {
            searchCategory = searchCategory.toLocaleLowerCase();

            this.filteredGoals = this.filteredGoals.filter(goal => {
                return !searchCategory || goal.category.toLowerCase().indexOf(searchCategory) !== -1;
            });
        }

        // Filter by name
        if (searchName != null) {
            searchName = searchName.toLocaleLowerCase();

            this.filteredGoals = this.filteredGoals.filter(goal => {
                return !searchName || goal.name.toLowerCase().indexOf(searchName) !== -1;
            });
        }

        return this.filteredGoals;
    }


    refreshGoals(): Observable<Goal[]> {


        const goalObservable: Observable<Goal[]> = this.goalService.getGoals();
        goalObservable.subscribe(
            goals => {
                this.goals = goals;
                this.filterGoals(this.goalPurpose, this.goalCategory, this.goalName);
            },
            err => {
                console.log(err);
            });
        return goalObservable;
    } */

    /*loadService(): void {
        this.resourceService.getresources(this.resourcePhone).subscribe(
            resource => {
                this.resourcess = resource;
                this.filteredresource = this.goals;
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
}*/
