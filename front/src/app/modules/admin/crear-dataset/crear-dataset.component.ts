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
import {NativeDateAdapter} from '@angular/material/core';

@Component({
    selector     : 'crear-dataset',
    templateUrl  : './crear-dataset.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    standalone   : true,
    providers: [NativeDateAdapter],
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
    selectedValueByTag: {[tag: string]: any[]} = {};
    allValueByTag: {[tag: string]: any[]} = {};

    //tabla
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[];
    allColumns: string[]; 
    columnStates: { [key: string]: boolean } = {};


    primerForm: FormGroup = this.fb.group({
        nombre: ['Test', Validators.required],
        token: ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDYyNzI4NDV9.gCMcKrWdKzECFpHckZhBayNtyS6RBbrF1YD5Ig8afZ4', Validators.required],
        start: ['2024-03-09T23:00:00.000Z', new FormControl<Date | null>(null), Validators.required],
        end: ['2024-03-11T23:00:00.000Z', new FormControl<Date | null>(null)],
        limit: ['', Validators.required]
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
        console.log('------------------------------------');
        this.tags = environment.filters;
    }
    
    //agrandar contenedor derecha
    toggleContainers() {
        this.isHidden = !this.isHidden;
    }

    //añadir el input
    addInput() {
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
            if(this.tags.length > this.inputs.length){
                console.log('Meto en inptus = ', this.tags[this.tags.indexOf(tag)]);
                this.inputs.push(this.tags[this.tags.indexOf(tag)]);
                this.getValueTag(this.tags[this.tags.indexOf(tag)]);
                this.allValueByTag[this.tags[this.tags.indexOf(tag)]] = this.values;
            }
        }
        console.log(this.allValueByTag);
        // console.log(this.inputs);
        // console.log(this.values);
    }

    //actualizar el valor del input
    onSelectChangeTag(event, index: any) {
        
        if (event.isUserInput) {
            if (this.inputs.includes(event.source.value)) {
                console.log('Already added');
            } else {
                console.log('Adding new input and removing the previous one');
                const newInput = event.source.value;
                console.log(newInput);
                this.inputs[index] = newInput;
                this.getValueTag(this.tags[this.tags.indexOf(newInput)]);
            }
        }

    }

    //borrar el input
    deleteInput(index: any) {
        console.log('borro de inputs = ', this.inputs[index]);
        delete this.selectedValueByTag[this.inputs[index]];
        delete this.allValueByTag[this.inputs[index]];
        this.inputs.splice(index, 1);
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
        this.values = [];
        this.addFilter=false;   
        this.apiSmartUaService.getTagSmartUa(this.token, tag)
        .subscribe((response) => {
            // console.log(response.result.values.length);
            for(let i = 0; i < response.result.values.length; i++) {
                this.values.push(response.result.values[i][1]);
                //console.log(response.result.values[i][1]);
            }
        });
    }

    //recoger los datos del token con los filtros
    cargarTabla() {
        let limite = this.primerForm.get('limit')?.value
        limite = limite === '' ? 100 : limite;

        this.apiSmartUaService.getDataSmartUa(this.token, limite, this.selectedValueByTag, this.primerForm.value.start, this.primerForm.value.end)
        .subscribe((response) => {
            console.log(response); 
            const data = response.result;
            this.displayedColumns = data.columns;
            this.allColumns = this.displayedColumns.slice();
            this.allColumns.forEach(column => {
                this.columnStates[column] = true; // Todas las columnas inicialmente marcadas como mostradas
              });
            this.dataSource = new MatTableDataSource(data.values);
            this.cdr.detectChanges();
            
        },
        (error) => {
            console.log(error);
        });

        this.apiSmartUaService.getTotalDataCount(this.token, this.selectedValueByTag, this.primerForm.value.start, this.primerForm.value.end)
        .subscribe((response) => {
            console.log(response);
            this.count_value = response.result.values[0][1];
            this.cdr.detectChanges();
        });
        console.log(this.count_value);
    }

    //aplicar el filtro
    applyFilter(value: string) {
        this.filteredItems = this.values.filter(item =>
            item.toLowerCase().includes(value.toLowerCase())
        );
    }
    
    //seleccionar todos los valores del select
    seleccionarTodo(index: any) {
        if (this.allSelected) {
            this.select.options.forEach((item: MatOption) => {
                item.select();
            });
        } else {
            this.select.options.forEach((item: MatOption) => item.deselect());
        }
        this.selectedValueByTag[index] = this.selectedValues.value;
        console.log(this.selectedValueByTag);
        
    }
    //seleccionar el value del select
    seleccionarClick(index: any) {
        let newStatus = true;
        console.log(index);
        this.selectedValueByTag[index] = this.selectedValues.value;
        console.log(this.selectedValueByTag);
        this.select.options.forEach((item: MatOption) => {
            if (item.selected) {
                newStatus = false;
            }
        });
        this.allSelected = newStatus;
    }
    filtroGuardados(){
        console.log(this.selectedValueByTag);
    }

    toggleColumn(event: any, column: string) {
        console.log(this.columnStates[column]);
        if (event.target.checked) {
          // Marcar la columna como mostrada
          //que posicion tenia la columna
          const originalIndex = this.allColumns.indexOf(column);
          if (originalIndex !== -1) {
            console.log(this.displayedColumns);
            // meto la columna en la posición original en la que estaba (pos, noBorrar, nombreColumna)
            this.displayedColumns.splice(originalIndex, 0, column);
            console.log(this.displayedColumns);
          }
          this.columnStates[column] = true; // Actualizar el estado de la columna a mostrada
          console.log('marco y añado columna');
        } else {
          // Desmarcar la columna como no mostrada
          const index = this.displayedColumns.indexOf(column);
          if (index !== -1) {
            this.displayedColumns.splice(index, 1);
          }
          this.columnStates[column] = false; // Actualizar el estado de la columna a no mostrada
        }
      }

}
