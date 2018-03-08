import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-emergency.component',
    templateUrl: 'emergency.component.html',
})
export class EmergencyComponent {
    constructor(
        public dialogRef: MatDialogRef<EmergencyComponent>) {
    }

    onNooClick(): void {
        this.dialogRef.close();
    }
}
