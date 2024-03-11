import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import {CommonModule} from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { environment } from 'environments/environment';
import { ApiSmartUaService } from 'app/core/smartUa/api-smart-ua.service';
import { RouterModule } from '@angular/router';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
    selector     : 'crear-dataset',
    templateUrl  : './crear-dataset.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    standalone   : true,
    imports      : [MatIconModule, MatTableModule, FuseAlertComponent, RouterModule, MatDividerModule, MatDatepickerModule, MatChipsModule, MatTabsModule, FormsModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, MatCheckboxModule, MatRadioModule, CommonModule],
})
export class CrearDatasetComponent implements OnInit
{

    horizontalStepperForm: UntypedFormGroup;
    verticalStepperForm: UntypedFormGroup;
    formFieldHelpers: string[] = ['fuse-mat-emphasized-affix'];
    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder, private fb: FormBuilder, private apiSmartUaService: ApiSmartUaService, private cdr: ChangeDetectorRef)
    {
    }

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };

    
    
    filterForm: FormGroup = this.fb.group({
    });

    count_value: number= 0;
    addFilter = false;
    showAlert: boolean = false;
    
    isHidden = false;
    tags: any = [];
    values: any = [];
    inputs: any = [];
    
    filteredItems: string[] = this.values.slice();
    selectedValues = new FormControl([]);

    //tabla
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[];

    primerForm: FormGroup = this.fb.group({
        nombre: ['', Validators.required],
        token: ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDYyNzI4NDV9.gCMcKrWdKzECFpHckZhBayNtyS6RBbrF1YD5Ig8afZ4', Validators.required],
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
        tags: [''],
        //selectedValues : this.selectedValues,
    });

    @ViewChild('select') select: MatSelect;

    allSelected=false;
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // ----------------------------------------------------------------------------------------------------

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
        
        
        console.log(this.primerForm.get('token')?.value !== '');
        if(!this.getToken()) {
            this.alert = {
                type   : 'error',
                message: 'Tienes que introducir un token válido para poder añadir filtros.',
            }
            this.showAlert = true;
        }
        else {
            this.showAlert = false;
            let tag = this.tags.find((input: any) => !this.inputs.includes(input));
            console.log(this.tags.length, this.inputs.length);
            if(this.tags.length > this.inputs.length){
                this.inputs.push(this.tags[this.tags.indexOf(tag)]);
                this.getValueTag(this.tags[this.tags.indexOf(tag)]);

            }
        }

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
    // hay algun token?
    getToken() {
        if(this.primerForm.get('token')?.value !== '') {
            this.addFilter = true;
        }
        return this.addFilter;
    }
    

    //recogemos los distintos valores de los tags del token
    getValueTag(tag: string) {
        console.log(this.token);
       this.values = [];
        this.addFilter=false;   
        this.apiSmartUaService.getTagSmartUa(this.token, tag)
        .subscribe((response) => {
            console.log(response.result.values.length);
            for(let i = 0; i < response.result.values.length; i++) {
                this.values.push(response.result.values[i][1]);
                //console.log(response.result.values[i][1]);
            }
        });
    }

    //recoger los datos del token con los filtros
    cargarTabla() {
        this.apiSmartUaService.getDataSmartUa(this.token, this.inputs, this.selectedValues.value)
        .subscribe((response) => {
            console.log(response); 
            const data = response.result;
            this.displayedColumns = data.columns;
            this.dataSource = new MatTableDataSource(data.values);
            console.log(response.result.values[0][1]); 
            this.count_value = response.result.values[0][1];
            this.cdr.detectChanges();
        },
        (error) => {
            console.log(error);
        });
    }

    //aplicar el filtro
    applyFilter(value: string) {
        this.filteredItems = this.values.filter(item =>
            item.toLowerCase().includes(value.toLowerCase())
        );
    }
    
    //seleccionar todos los valores del select
    seleccionarTodo() {
        if (this.allSelected) {
            this.select.options.forEach((item: MatOption) => item.select());
        } else {
            this.select.options.forEach((item: MatOption) => item.deselect());
        }
    }
    //seleccionar el value del select
    seleccionarClick() {
        let newStatus = true;
        this.select.options.forEach((item: MatOption) => {
            if (!item.selected) {
            newStatus = false;
            }
        });
        this.allSelected = newStatus;
    }

}
