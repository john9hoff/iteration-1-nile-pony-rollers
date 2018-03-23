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


export class ResourcesComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public resource: resources[];
    public filteredGoals: resources[];

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public goalPurpose: string;
    public goalCategory: string;
    public goalName: string;

    // The ID of the goal
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the ResourcesService into this component.
    constructor(public goalService: ResourcesService, public dialog: MatDialog) {

    }

    isHighlighted(goal: resources): boolean {
        return goal._id['$oid'] === this.highlightedID['$oid'];
    }

    openDialog(): void {
        const newGoal: resources = {_id: '', purpose:'', category:'', name:''};
        const dialogRef = this.dialog.open(AddResourcesComponent, {
            width: '300px',
            data: { goal : newGoal }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.goalService.addNewGoal(result).subscribe(
                addGoalResult => {
                    this.highlightedID = addGoalResult;
                    this.refreshGoals();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the goal.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    public filterGoals(searchGoal: string, searchCategory: string, searchName: string): resources[] {

        this.filteredGoals = this.resource;

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
                return !searchCategory || resource.category.toLowerCase().indexOf(searchCategory) !== -1;
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
        const goalObservable: Observable<resources[]> = this.goalService.getGoals();
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
        this.goalService.getGoals(this.goalCategory).subscribe(
            goals => {
                this.goals = goals;
                this.filteredGoals = this.goals;
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
