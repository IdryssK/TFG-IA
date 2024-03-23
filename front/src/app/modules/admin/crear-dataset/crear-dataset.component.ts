import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MtxMomentDatetimeModule, provideMomentDatetimeAdapter } from '@ng-matero/extensions-moment-adapter';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDatetimeAdapter } from '@ng-matero/extensions/core';
import { MtxCalendar } from '@ng-matero/extensions/datetimepicker';
import { MtxCalendarView, MtxDatetimepicker, MtxDatetimepickerInput, MtxDatetimepickerMode, MtxDatetimepickerToggle, MtxDatetimepickerType} from '@ng-matero/extensions/datetimepicker';
import { MtxGrid, MtxGridColumn } from '@ng-matero/extensions/grid';
import { DateTime } from 'luxon';
  
@Component({
    selector     : 'crear-dataset',
    templateUrl  : './crear-dataset.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls    : ['./crear-dataset.component.scss'],
    animations   : fuseAnimations,
    standalone   : true,
    providers: [provideMomentDatetimeAdapter({
                                                parse: {
                                                dateInput: 'YYYY-MM-DD',
                                                monthInput: 'MMMM',
                                                yearInput: 'YYYY',
                                                timeInput: 'HH:mm',
                                                datetimeInput: 'YYYY-MM-DD HH:mm',
                                                },
                                                display: {
                                                dateInput: 'YYYY-MM-DD',
                                                monthInput: 'MMMM',
                                                yearInput: 'YYYY',
                                                timeInput: 'HH:mm',
                                                datetimeInput: 'YYYY-MM-DD HH:mm',
                                                monthYearLabel: 'YYYY MMMM',
                                                dateA11yLabel: 'LL',
                                                monthYearA11yLabel: 'MMMM YYYY',
                                                popupHeaderDateLabel: 'MMM DD, ddd',
                                                },
                                                }),
                ],
    imports      : [MatIconModule, 
                    MatTableModule, 
                    FuseAlertComponent, 
                    RouterModule, 
                    MatDividerModule, 
                    MatDatepickerModule, 
                    MatChipsModule, 
                    MatTabsModule,
                    FormsModule,
                    ReactiveFormsModule,
                    MatStepperModule,
                    MatFormFieldModule,
                    MatInputModule,
                    MatSelectModule,
                    MatOptionModule,
                    MatButtonModule,
                    MatCheckboxModule,
                    MatRadioModule,
                    CommonModule,
                    NgxMatTimepickerModule,
                    NgxMaterialTimepickerModule,
                    MtxMomentDatetimeModule,
                    MatCardModule,
                    MtxCalendar,
                    MtxDatetimepicker,
                    MtxDatetimepickerInput,
                    MtxDatetimepickerToggle,
                    MtxGrid
                 ],
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

    // PESTAÑAS-----------------------------------------------------------------------------------------------------
    selectedTabIndex = 0; // Índice de la pestaña seleccionada

    // Método para cambiar el índice de la pestaña seleccionada
    changeTab(index: number) {
        this.selectedTabIndex = index;
    }

    // -----------------------------------------------------------------------------------------------------
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };

    
    selectedTime: Date | null = null;
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
    filteredValues: string[] = [];

    //tabla
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[];
    allColumns: string[]; 
    columnStates: { [key: string]: boolean } = {};

    // tabla FILTROS
    @ViewChild('grid') grid!: MtxGrid;
    columns: MtxGridColumn[] = [];
    list = [];
    
    columns1: MtxGridColumn[] = [];
    list1 = [];
    
    columns2: MtxGridColumn[] = [];
    list2 = [];
    
    columns3: MtxGridColumn[] = [];
    list3 = [];
    

    


    primerForm: FormGroup = this.fb.group({
        nombre: ['Test', Validators.required],
        token: ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDYyNzI4NDV9.gCMcKrWdKzECFpHckZhBayNtyS6RBbrF1YD5Ig8afZ4', Validators.required],
        start: ['2024-03-04T17:40:00.000Z', new UntypedFormControl()],
        end: ['2024-03-05T17:40:00.000Z', new UntypedFormControl()],
        limit: ['', Validators.required],

    });
    
    
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // ----------------------------------------------------------------------------------------------------




// --------------------------------------------FILTROS---------------------------------------------------------

    @ViewChild('select') select: MatSelect;

    allSelected=false;
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

    //seleccionar todos los valores del select 
    // VOLVER A HACER !!!!!!!
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

        this.selectedValueByTag[index] = this.selectedValues.value;
        console.log(this.selectedValueByTag);
        this.select.options.forEach((item: MatOption) => {
            if (item.selected) {
                newStatus = false;
            }
        });
        this.allSelected = newStatus;
    }

// -------------------------------------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        console.log('------------------------------------');
        this.tags = environment.filters;
    }
    
    //agrandar contenedor derecha
    toggleContainers() {

        this.isHidden = !this.isHidden;
    }


// --------------------------------------------Gestion de tablas/ventanas---------------------------------------------------------

    cargarTabla() {

        //switch para ver en que pestaña estamos
        switch (this.selectedTabIndex) {
            case 0:
                this.llamadasApi(); // creación de la tabla 0
                break;
            case 1:
                console.log('Estamos en la pestaña 1')
                
                this.tabla1();
                
                
                break;
            case 2:
                // Code for tab 2
                break;
            // Add more cases for additional tabs if needed
            default:
                // Default code if no tab is selected
                break;
        }        
        
    }
    
// -------------------------------------------------------------------------------------------------------------------------------

// --------------------------------------------TABLA 0----------------------------------------------------------------------------

    llamadasApi() {

        let limite = this.primerForm.get('limit')?.value
        limite = limite === '' ? 100 : limite;

        this.apiSmartUaService.getDataSmartUa(this.token, limite, this.selectedValueByTag, this.primerForm.value.start, this.primerForm.value.end)
        .subscribe((response) => {
           
            // console.log(response); 
            const data = response.result;
            this.columns =  data.columns.map((column: string) => {
                return { header: column, field: column };
            });

            const columnas = data.columns;
            const valores = data.values;

            // Procesar los valores y combinarlos con las columnas
            const datosProcesados = valores.map((fila: any[]) => {
                const filaProcesada: any = {};
                columnas.forEach((columna: string, indice: number) => {
                    filaProcesada[columna] = fila[indice];
                });
                    return filaProcesada;
                });
            this.list = datosProcesados;

            console.log(this.columns);
           
            
            this.cdr.detectChanges();
            
        },
        (error) => {
            console.log(error);
        });

        this.apiSmartUaService.getTotalDataCount(this.token, this.selectedValueByTag, this.primerForm.value.start, this.primerForm.value.end)
        .subscribe((response) => {
            // console.log(response);
            this.count_value = response.result.values[0][1];
            this.cdr.detectChanges();
        });
    }
// -------------------------------------------------------------------------------------------------------------------------------

    
// --------------------------------------------TABLA 1----------------------------------------------------------------------------
    
    // Ocultar columna 
    showColumn(e: any, column: any) {
        console.log(e.target.checked, column);
        //buscar en el array de columnas la columna que se ha seleccionado
        const index = this.columns.indexOf(column);
        console.log(index); //posicion de la columna
        if (index === -1) {
            console.log('No se ha encontrado la columna');
        } else {
            if(e.target.checked) {
                this.columns[index].hide = false;
            }
            else {
                this.columns[index].hide = true;
            }
        }
        console.log(this.columns);
    }

    tabla1() {

        // copiamos las columnas que no esten hide
        this.columns1 = this.columns.filter(column => !column.hide);

        // copiamos los datos de la tabla que no esten hide
        this.list1 = this.list.map(item => {
            const newItem: any = {};
            this.columns1.forEach(column => {
                if (item.hasOwnProperty(column.field)) {
                    newItem[column.field] = item[column.field];
                }
            });
            return newItem;
        });
    }
   




// -------------------------------------------------------------------------------------------------------------------------------



}
