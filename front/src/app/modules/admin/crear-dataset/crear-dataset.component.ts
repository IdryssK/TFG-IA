import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import {CommonModule} from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { environment } from 'environments/environment';
import { ApiSmartUaService } from 'app/core/smartUa/api-smart-ua.service';
import { RouterModule } from '@angular/router';

@Component({
    selector     : 'crear-dataset',
    templateUrl  : './crear-dataset.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [MatIconModule, RouterModule, MatDividerModule, MatDatepickerModule, MatChipsModule, MatTabsModule, FormsModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, MatCheckboxModule, MatRadioModule, CommonModule],
})
export class CrearDatasetComponent implements OnInit
{

    horizontalStepperForm: UntypedFormGroup;
    verticalStepperForm: UntypedFormGroup;
    formFieldHelpers: string[] = ['fuse-mat-emphasized-affix'];
    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder, private fb: FormBuilder, private apiSmartUaService: ApiSmartUaService)
    {
    }

    primerForm: FormGroup = this.fb.group({
        nombre: ['', Validators.required],
        token: ['', Validators.required],
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
        tags: [''],
    });
    
    filterForm: FormGroup = this.fb.group({
    });

    isHidden = false;
    tags: any = [];
    keys: any = [];
    inputs: any = [];

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        
        this.tags = environment.filters;
    }
    
    //agrandar contenedor derecha
    toggleContainers() {
        this.isHidden = !this.isHidden;
    }

    //añadir el input
    addInput() {
        
        let tag = this.tags.find((input: any) => !this.inputs.includes(input));
        this.inputs.push(this.tags[this.tags.indexOf(tag)]);
        this.getValueTag(this.tags[this.tags.indexOf(tag)]);

    }

    //borrar el input
    deleteInput(index: any) {
        this.inputs.splice(index, 1);
        console.log('borro');
    }
   
    //actualizar el valor del input
    onChange(index: any, event: any) {
        console.log('estoy cambiando?');
        const newInput = event.target.value;
        console.log(newInput);
        this.inputs[index] = newInput;
    }

    //recoger token del formulario
    get token() {
        return this.primerForm.get('token')?.value;
    }

    c
    getValueTag(tag: string) {
        console.log(this.token);    
        this.apiSmartUaService.getTagSmartUa(this.token, tag)
        .subscribe((response) => {
            console.log(response);
        });
    }






}
