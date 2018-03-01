import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Tracker} from './tracker';

@Component({
    selector: 'app-add-tracker.component',
    templateUrl: 'add-tracker.component.html',
})
export class AddTrackerComponent {
    constructor(
        public dialogRef: MatDialogRef<AddTrackerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {tracker: Tracker}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
