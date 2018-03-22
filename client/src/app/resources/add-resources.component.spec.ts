import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MatDialogRef, MAT_DIALOG_DATA, MATERIAL_COMPATIBILITY_MODE} from '@angular/material';

import {AddResourcesComponent} from "./add-resources.component";

import {CustomModule} from '../custom.module';

describe('Add goal component', () => {

    let addResourceComponent: AddResourcesComponent;
    let calledClose: boolean;
    const mockMatDialogRef = {
        close() { calledClose = true; }
    };
    let fixture: ComponentFixture<AddResourcesComponent>;

    beforeEach(async( () => {
        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [AddResourcesComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: null },
                { provide: MATERIAL_COMPATIBILITY_MODE, useValue: true }]
        }).compileComponents().catch(error => {
            expect(error).toBeNull();
        });
    }));







    beforeEach(() => {
        calledClose = false;
        fixture = TestBed.createComponent(AddResourcesComponent);
        addResourceComponent = fixture.componentInstance;
    });





    it('closes properly', () => {
        addResourceComponent.onNoClick();
        expect(calledClose).toBe(true);
    });
});
