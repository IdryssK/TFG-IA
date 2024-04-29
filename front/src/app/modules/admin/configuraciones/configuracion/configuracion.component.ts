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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FuseAlertComponent, FuseAlertService, FuseAlertType } from '@fuse/components/alert';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {NativeDateAdapter} from '@angular/material/core';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MtxMomentDatetimeModule, provideMomentDatetimeAdapter } from '@ng-matero/extensions-moment-adapter';
import { MatCardModule } from '@angular/material/card';
// import { provideNativeDatetimeAdapter } from '@ng-matero/extensions/core';
import { MtxCalendar } from '@ng-matero/extensions/datetimepicker';
import { MtxCalendarView, MtxDatetimepicker, MtxDatetimepickerInput, MtxDatetimepickerMode, MtxDatetimepickerToggle, } from '@ng-matero/extensions/datetimepicker';
import { MtxGrid, MtxGridColumn,MtxGridColumnTag } from '@ng-matero/extensions/grid';
import { DateTime } from 'luxon';
import moment from 'moment';
import { ConfiguracionesService } from 'app/core/configuraciones/configuraciones.service';
import { FuseConfirmationService } from '@fuse/services/confirmation/confirmation.service';
  
@Component({
    selector     : 'app-configuracion',
    templateUrl  : './configuracion.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls    : ['./configuracion.component.scss'],
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
export class ConfiguracionComponent implements OnInit
{

    horizontalStepperForm: UntypedFormGroup;
    verticalStepperForm: UntypedFormGroup;
    formFieldHelpers: string[] = ['fuse-mat-emphasized-affix'];
    ;
    /**
     * Constructor
     */
    constructor(private _fuseAlertService: FuseAlertService, private _fuseConfirmationService: FuseConfirmationService, private configuracionService: ConfiguracionesService,private fb: FormBuilder, private apiSmartUaService: ApiSmartUaService, private cdr: ChangeDetectorRef, private route: ActivatedRoute, private router: Router) {}

// -----------------------------------PESTAÑAS------------------------------------------------------------------

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
    selectedValues2;
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
    administrarColumnas: any[] = [];

    columns1: MtxGridColumn[] = [];
    list1 = [];
    
    // TABLA 2
    tiposFechas: any = [];
    columns2: MtxGridColumn[] = [];
    list2 = [];
    
    columns3: MtxGridColumn[] = [];
    list3 = [];
    

    private idx: string ='';
    isModified: boolean = false;

    primerForm: FormGroup = this.fb.group({
        idx: [{value: 'nuevo', disabled: true}, Validators.required],
        nombre: ['', Validators.required],
        token: ['', Validators.required],
        start: ['', new UntypedFormControl()],
        end: ['', new UntypedFormControl()],
        limit: ['', Validators.required],
        filtros :[this.selectedValueByTag], 
        Tablacaracteristicas: [[]],
        TablaList: [[]],
        Tabla1AdministrarColumnas: [[]],
        Tabla1Columns: [[]],
        Tabla1List: [[]],
        Tabla2Columns: [[]],
        Tabla2List: [[]],
        Tabla2TiposFechas: [[]],
        Tabla3Columns: [[]],
        Tabla3List: [[]],
        fechas: [[]]
        // datos: []
    });
    
    
    
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // ----------------------------------------------------------------------------------------------------




// --------------------------------------------FILTROS---------------------------------------------------------
    
    @ViewChild('select') select: MatSelect;

    allSelected=false;

    isContentOpen: boolean = true; 
    toggleContent() {
        this.isContentOpen = !this.isContentOpen;
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
            this.markAsModified();
            let tag = this.tags.find((input: any) => !this.inputs.includes(input));
            if(this.tags.length > this.inputs.length){
                this.filterForm.addControl(tag, new FormControl());
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
                this.markAsModified();
                console.log('Adding new input and removing the previous one');
                const newInput = event.source.value;
                delete this.selectedValueByTag[this.inputs[index]];
                this.inputs[index] = newInput;
                this.getValueTag(this.tags[this.tags.indexOf(newInput)]);
                this.allValueByTag[this.tags[this.tags.indexOf(newInput)]] = this.values;
                this.isModified = true;
            }
        }

    }

    //borrar el input
    deleteInput(index: any) {
        this.markAsModified();
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
    async getValueTag(tag: string) {
        try {
            this.values = [];
            this.addFilter = false;
            const response = await this.apiSmartUaService.getTagSmartUa(this.token, tag).toPromise();
            for (let i = 0; i < response.result.values.length; i++) {
                this.values.push(response.result.values[i][1]);
            }
            // console.log(this.values);
        } catch (error) {
            console.error(error);
        }
    }

    //seleccionar todos los valores del select 
    // VOLVER A HACER !!!!!!!
    seleccionarTodo(inputIndex: any) {
    // Obtén todas las opciones disponibles para este input
        const allOptions = this.allValueByTag[inputIndex];

        // Comprueba si todas las opciones ya están seleccionadas
        if (this.selectedValueByTag[inputIndex].length === allOptions.length) {
            // Si todas las opciones ya están seleccionadas, deselecciónalas
            this.selectedValueByTag[inputIndex] = [];
        } else {
            // Si no todas las opciones están seleccionadas, selecciónalas todas
            this.selectedValueByTag[inputIndex] = allOptions;
        }
    }


// -------------------------------------------------------------------------------------------------------------------------------

    async editar(idx) {
        this.configuracionService.getConfiguracion(idx).subscribe(async (response) => {
            let prueba = JSON.parse(response.configuracion.CONF_Data);
            this.setFormValues(prueba);
            await this.setFiltros(prueba);
            this.setTablas(prueba);
        });
    }

    setFormValues(prueba) {
        this.primerForm.get('nombre')?.setValue(prueba.nombre);
        this.primerForm.get('token')?.setValue(prueba.token);
        this.primerForm.get('start')?.setValue(prueba.start);
        this.primerForm.get('end')?.setValue(prueba.end);
        this.primerForm.get('limit')?.setValue(prueba.limit);
    }

    async setFiltros(prueba) {
        Object.keys(prueba.filtros).forEach(key => {
            this.inputs.push(key);
        });

        for (let i = 0; i < this.inputs.length; i++) {
            await this.getValueTag(this.tags[this.tags.indexOf(this.inputs[i])]);
            this.allValueByTag[this.tags[this.tags.indexOf(this.inputs[i])]] = this.values;
            this.selectedValueByTag[this.tags[this.tags.indexOf(this.inputs[i])]]= prueba.filtros[this.inputs[i]];
        }
    }

    setTablas(prueba) {
        this.columns = prueba.Tablacaracteristicas;
        this.list = prueba.TablaList;
        this.administrarColumnas = prueba.Tabla1AdministrarColumnas;
        this.columns1 = prueba.Tabla1Columns;
        this.list1 = prueba.Tabla1List;
        this.columns2 = prueba.Tabla2Columns;
        this.list2 = prueba.Tabla2List;
        this.tiposFechas = prueba.Tabla2TiposFechas;
    }


    /**
     * On init
     */
    ngOnInit(): void {

        console.log('------------------------------------');
        this.isModified = false;
        console.log(this.primerForm.pristine);
        console.log(this.isModified);
        this.tags = environment.filters;
        this.idx = this.route.snapshot.params['idx'];
        console.log(this.idx);
        this.primerForm.get('idx')?.setValue(this.idx);
        if(this.idx !== 'nuevo'){
            this.editar(this.idx);
            
        }
        
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
                
                console.log('Estamos en la pestaña 2');
                this.tabla2();
                break;
            case 3: 
            
                console.log('Estamos en la pestaña 3');
                this.tabla3();
                break;
            default:
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
                return { header: column, field: column, hide: false, show: true};
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
            
            // para que no tengan la misma referencia y les afecte los cambios a uno y otro
            this.administrarColumnas = JSON.parse(JSON.stringify(this.columns));
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
        this.markAsModified();
        console.log(e.target.checked, column);
        //buscar en el array de columnas la columna que se ha seleccionado
        const index = this.administrarColumnas.indexOf(column);
        console.log(index); //posicion de la columna
        if (index === -1) {
            console.log('No se ha encontrado la columna');
        } else {
            if(e.target.checked) {
                this.administrarColumnas[index].hide = false;
            }
            else {
                this.administrarColumnas[index].hide = true;
            }
        }
        console.log(this.administrarColumnas);
        console.log(this.columns);
    }

    tabla1() {

        // copiamos las columnas que no esten hide
        this.columns1 = [...this.administrarColumnas];
        
        // copiamos los datos de la tabla que no esten hide
        this.list1 = [...this.list];
        const hola = this.list1;
        this.list1 = [];
        hola.forEach(element => {
            this.list1.push(element);
        });
        console.log(this.list1)
        // mostramos la siguiente pestaña FECHAS
        this.tiposFechas =  environment.tiposFechas.map((column: string) => {
            return { header: column, field: column, hide: true, show: true};
        });
    }
   




// -------------------------------------------------------------------------------------------------------------------------------

// --------------------------------------------TABLA 2----------------------------------------------------------------------------

    addColumn(e: any, column: any) {

        // lo primero que se tiene que hacer es copiar la tabla1 a la tabla2
        // añadir la columna seleccionada a la tabla2
        // calcular los datos de la tabla2 en función de las columnas seleccionadas gracias a la la columna time
        this.markAsModified();
        //buscar en el array de columnas la columna que se ha seleccionado
        const index = this.tiposFechas.indexOf(column);
        console.log(index); //posicion de la columna
        if (index === -1) {
            console.log('No se ha encontrado la columna');
        } else {
            if(e.target.checked) {
                console.log('checkea la columna');
                this.tiposFechas[index].hide = false;
            }
            else {
                this.tiposFechas[index].hide = true;
            }
        }
        console.log(this.tiposFechas);
    }

    tabla2 (){

        const columnFunctions = {
            'epoch': (item) => moment(item.time).valueOf(),
            'dia': (item) => moment(item.time).date(),
            'mes': (item) => moment(item.time).month() + 1, // En moment.js, los meses empiezan en 0
            'año': (item) => moment(item.time).year(),
            'dia de la semana': (item) => moment(item.time).day(),
            'semana': (item) => moment(item.time).week(),
            'hora': (item) => moment(item.time).hour(),
            'minuto': (item) => moment(item.time).minute(),
            'segundo': (item) => moment(item.time).second(),
            '0-24': (item) => {
                const time = moment(item.time);
                const hours = time.hours();
                const minutes = time.minutes() / 60;
                const seconds = time.seconds() / 6000;
                return parseFloat((hours + minutes + seconds).toFixed(4));
            }
        };
        

        // Copia columns1 a columns2
        this.columns2 = [...this.columns1];

        // Añade las columnas de tiposFechas que no tienen hide = false a columns2
        this.tiposFechas.forEach(column => {
            console.log(column);
            if (column.hide === false) {
                this.columns2.push(column);
            }
        });


        
        // Copia list1 a list2 y añade la nueva columna a cada objeto
        this.list2 = this.list1.map(item => {
            //console.log('Item: ', item);
            const newItem = { ...item };
            this.tiposFechas.forEach(column => {
                //console.log('Columna: ', column, 'Item: ', item.time, 'Función: ', columnFunctions[column.header]);
               if(column.hide === false){
                   newItem[column.header] = columnFunctions[column.header](item);
               }
            
            });
            return newItem;
        });
        console.log(this.list2);

    }
// -------------------------------------------------------------------------------------------------------------------------------

// --------------------------------------------TABLA 3----------------------------------------------------------------------------


    ojito = 'option2';
    normalizar = false;

    normalizamos() {
        this.normalizar = !this.normalizar;
    }
    tabla3(){

    }



// -------------------------------------------------------------------------------------------------------------------------------


// --------------------------------------------GUARDAR----------------------------------------------------------------------------

    guardarDataSet() {
        if(!this.primerForm.invalid) {
            console.log('Guardando dataset');
    
            this.primerForm.value.Tablacaracteristicas = this.columns;
            this.primerForm.value.TablaList = this.list;
            
            this.primerForm.value.Tabla1AdministrarColumnas = this.administrarColumnas;
            this.primerForm.value.Tabla1Columns = this.columns1;
            this.primerForm.value.Tabla1List = this.list1;
            
            this.primerForm.value.Tabla2Columns = this.columns2;
            this.primerForm.value.Tabla2List = this.list2;
    
            this.primerForm.value.Tabla2TiposFechas = this.tiposFechas;
            this.primerForm.value.Tabla3Columns = this.columns3;
            this.primerForm.value.Tabla3List = this.list3;
            console.log(this.primerForm.value);
            
            if(this.idx === 'nuevo') {
                this.configuracionService.saveConfiguracion(this.primerForm.value).subscribe((response) => {
                    console.log(response);
                    this._fuseAlertService.show('success-save');
                    this.primerForm.markAsPristine();
                });
            }
            else {
                this.configuracionService.updateConfiguracion(this.idx, this.primerForm.value).subscribe((response) => {
                    console.log(response);
                    this._fuseAlertService.show('success-update');
                    this.primerForm.markAsPristine();
                    // this.router.navigate(['/configuraciones']);
                });
            }
        }
        else {
            console.log('Formulario no válido');
        }
    }


    cancelar() {
        console.log('cancelar')
        if(this.primerForm.pristine) {
          this.router.navigate(['/configuraciones']);
        } else {
          const confirmation = this._fuseConfirmationService.open({
                title  : 'Restablecer cambios',
                message: 'Estas seguro de que quieres restablecer los cambios? Se perderán los cambios no guardados.',
                actions: {
                    confirm: {
                        label: 'Resablecer',
                    },
                },
            });
            confirmation.afterClosed().subscribe((result) => {
                // If the confirm button pressed...
                if ( result === 'confirmed' ) {  
                    this.primerForm.reset();
                    this.inputs = [];
                    if(this.idx !== 'nuevo'){
                        this.editar(this.idx);
                    }
                }
            });
        }
      }

      markAsModified() {
        console.log('marcando como modificado');
        this.isModified = true;
        Object.keys(this.primerForm.controls).forEach(key => {
            this.primerForm.controls[key].markAsDirty();
        });
    }
// -------------------------------------------------------------------------------------------------------------------------------
}
