import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import * as dfd from 'danfojs';

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
                    MtxGrid,
                    MatSlideToggleModule
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
    
    tratamientoDatos: any = [];
    columns3: MtxGridColumn[] = [];
    list3 = [];
    

    private idx: string ='';
    isModified: boolean = false;
    isReload: boolean = false;

    primerForm: FormGroup = this.fb.group({
        idx: [{value: 'nuevo', disabled: true}, Validators.required],
        nombre: ['', Validators.required],
        token: ['', Validators.required],
        start: ['', new UntypedFormControl()],
        end: ['', new UntypedFormControl()],
        limit: ['', Validators.required],
        filtros :[this.selectedValueByTag], 
        Tabla1AdministrarColumnas: [[]],
        Tabla2TiposFechas: [[]],
        Tabla3TratamientoDatos: [[]],
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
        // this.columns = prueba.Tablacaracteristicas;
        // this.list = prueba.TablaList;
        this.administrarColumnas = prueba.Tabla1AdministrarColumnas;
        // this.columns1 = prueba.Tabla1Columns;
        // this.list1 = prueba.Tabla1List;
        // this.columns2 = prueba.Tabla2Columns;
        // this.list2 = prueba.Tabla2List;
        this.tiposFechas = prueba.Tabla2TiposFechas;
        this.tratamientoDatos = prueba.Tabla3TratamientoDatos;
    }


    /**
     * On init
     */
    ngOnInit(): void {

        console.log('------------------------------------');
        this.isModified = false;
        this.isReload = false;

        this.tags = environment.filters;
        this.idx = this.route.snapshot.params['idx'];
        console.log(this.idx);
        this.primerForm.get('idx')?.setValue(this.idx);
        if(this.idx !== 'nuevo'){
            this.editar(this.idx);
            
        }
        this.tiposFechas =  environment.tiposFechas.map((column: string) => {
            return { header: column, field: column, hide: true, show: true};
        });
        this.administrarColumnas = environment.administrarColumnas.map((column: string) => {
            return { header: column, field: column, hide: false, show: true};
        });
        this.tratamientoDatos = environment.tratamientoDatos.map((column: string) => {
            return { header: column, nulos: 'Eliminar', valorSustituir: '', codificar: 'one-hot', normalizar: false, min: '', max: '', hide: false, show: true};
        });
        
    }
    
    //agrandar contenedor derecha
    toggleContainers() {

        this.isHidden = !this.isHidden;
    }


// --------------------------------------------Gestion de tablas/ventanas---------------------------------------------------------

    async cargarTabla() {
        await this.llamadasApi();
        this.tabla1();
        this.tabla2();
        this.pestana();
        this.tabla3();
        this.isReload = false;
    }
    
// -------------------------------------------------------------------------------------------------------------------------------

// --------------------------------------------TABLA 0----------------------------------------------------------------------------

    async llamadasApi() {
        console.log('llamadasApi 1');
        
        let limite = this.primerForm.get('limit')?.value
        limite = limite === '' ? 100 : limite;

        await this.apiSmartUaService.getDataSmartUa(this.token, limite, this.selectedValueByTag, this.primerForm.value.start, this.primerForm.value.end)
        .toPromise().then((response) => {
           
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

            console.log(this.list);
            
            // para que no tengan la misma referencia y les afecte los cambios a uno y otro
            // this.administrarColumnas = JSON.parse(JSON.stringify(this.columns));
            this.cdr.detectChanges();
            
        },
        (error) => {
            console.log(error);
        });

        await this.apiSmartUaService.getTotalDataCount(this.token, this.selectedValueByTag, this.primerForm.value.start, this.primerForm.value.end)
        .toPromise().then((response) => {
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
        console.log('tabla1 ');
        // copiamos las columnas que no esten hide
        this.columns1 = [...this.administrarColumnas];
        
        // copiamos los datos de la tabla que no esten hide
        this.list1 = [...this.list];
       
        console.log(this.list1)
        // mostramos la siguiente pestaña FECHAS
        
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
        console.log('tabla2')
        const columnFunctions = {
            'epoch': (item) => moment.utc(item.time).valueOf(),
            'dia': (item) => moment.utc(item.time).date(),
            'mes': (item) => moment.utc(item.time).month() + 1, // En moment.js, los meses empiezan en 0
            'año': (item) => moment.utc(item.time).year(),
            'dia de la semana': (item) => moment.utc(item.time).day(),
            'semana': (item) => moment.utc(item.time).week(),
            'hora': (item) => moment.utc(item.time).hour(),
            'minuto': (item) => moment.utc(item.time).minute(),
            'segundo': (item) => moment.utc(item.time).second(),
            '0-24': (item) => {
                const time = moment.utc(item.time);
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
            // console.log(column);
            if (column.hide === false) {
                this.columns2.push(column);
            }
        });


        
        // Copia list1 a list2 y añade la nueva columna a cada objeto
        this.list2 = this.list1.map(item => {
            //console.log('Item: ', item);
            const newItem = { ...item };
            this.tiposFechas.forEach(column => {
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
    displayedColumns2: string[] = ['columna', 'nulos', 'codificar', 'normalizar'];
    dataJEJE = [
        {
            "epoch": 1714518000000,
            "time": "1",
            "uid": " MLU02080001",
            "value": 5.761,
            "metric": "kWh",
            "typemeter": "SmartEnergy",
            "alias": "6339609",
            "lat": 38.37997,
            "lon": -0.52714,
            "cota": 0,
            "description": "Consumo de energia en kWh por hora",
            "description_origin": "Nuevo Invernadero",
            "name": "1h",
            "organizationid": "UA UNIVERSIDAD DE ALICANTE",
            "origin": "ElectricMeters UA",
        },
        {
            "epoch": 1714521600000,
            "time": "2",
            "uid": null,
            "value": null,
            "metric": "kWh",
            "typemeter": "SmartEnergy",
            "alias": "6339609",
            "lat": 38.37997,
            "lon": -0.52714,
            "cota": 0,
            "description": "Consumo de energia en kWh por hora",
            "description_origin": "Nuevo Invernadero",
            "name": "1h",
            "organizationid": "UA UNIVERSIDAD DE ALICANTE",
            "origin": "ElectricMeters UA",
        },
        {
            "epoch": 1714521600000,
            "time": "3",
            "uid": null,
            "value": 5310.39,
            "metric": "kWh",
            "typemeter": "SmartEnergy",
            "alias": "6339609",
            "lat": 38.37997,
            "lon": -0.52714,
            "cota": 0,
            "description": "Consumo de energia en kWh por mes",
            "description_origin": "Nuevo Invernadero",
            "name": "1M",
            "organizationid": "UA UNIVERSIDAD DE ALICANTE",
            "origin": "ElectricMeters UA",
        }
    ]

    normalizamos() {
        console.log(this.dataJEJE);
    }
    tabla3(){
        console.log('tabla3');
        // console.log(this.tratamientoDatos);

        //recorremos list2 y si en alguna linea la columna "value" es igual a 5.761, la cambiamos por null

        this.list2.forEach((item) => {
            if(item.value === 5.761) {
                item.value = null;
                // console.log(true);
            }
            if(item.time === '2024-05-01T00:00:00Z') {
                item.time = null;
            }
        });
        this.list2.forEach((item) => {
            if(item.value === null) {
                // console.log(true);
            }
        });

        this.columns3 = this.tratamientoDatos.map((column: any) => {
            return { header: column.header, field: column.header, hide: column.hide, show: column.show};
        });
        var datosCodificar;
        var datosNulos;
        // --------------- TRATAR NULOS ---------------------
         datosNulos = this.list2.map((item: any) => {
            // console.log(item);
            const newItem: any = {};
            let noMete = false;
            const columns = this.tratamientoDatos.filter((column: any) => !column.hide);
            for (let i = 0; i < columns.length; i++) {
                const column = columns[i];
                // console.log('ESTAMOS EN LA COLUMNA: ', column.header, ' -----------------');
                // console.log(column);
                if (item.hasOwnProperty(column.header)) {
                    if (column.nulos === 'Eliminar' && item[column.header] === null) {
                        // console.log('Eliminando nulos de ', column.header);
                        // no se guarda en newItem y se va al siguiente
                        noMete = true;
                        break;
                    }
                    if (column.nulos === 'Sustituir' && item[column.header] === null) {
                        // console.log('Sustituyendo nulos de ', column.header);
                        // se guarda en newItem con el valor de valorSustituir
                        item[column.header] = parseInt(column.valorSustituir);
                    }

                    newItem[column.header] = item[column.header];
                    // console.log(newItem);
                }
            }
            return noMete ? null : newItem;
        }).filter(item => item !== null);
        
        console.log(datosNulos);

        // --------------- CODIFICAR ---------------------
        let valoresPorColumnas = {};

        for (let columna in this.tratamientoDatos) {
            if (this.tratamientoDatos[columna].codificar === 'one-hot' && this.tratamientoDatos[columna].hide === false) {
                let nombreColumna = this.tratamientoDatos[columna].header;
                valoresPorColumnas[nombreColumna] = datosNulos.map(item => item[nombreColumna]);
            }
        }

        let valoresPorColumnasCodificados = {};
        Object.keys(valoresPorColumnas).forEach((key) => {
            let df = new dfd.DataFrame(valoresPorColumnas)
            let encode = new dfd.OneHotEncoder()
            
            encode.fit(df[key])
            let sf_enc = encode.transform(df[key].values)
            var resultado=[];
            sf_enc.forEach(element => {
                resultado.push(element.indexOf(1))
            });
            valoresPorColumnasCodificados[key] = resultado;
        });
        console.log(valoresPorColumnasCodificados);

        // remplace los valores de las columnas codificadas en datosNulos
        datosCodificar = datosNulos.map((item) => {
            const newItem = { ...item };
            for (let columna in valoresPorColumnasCodificados) {
                newItem[columna] = valoresPorColumnasCodificados[columna].shift();
            }
            return newItem;
        });
        console.log(datosCodificar);

        // --------------- NORMALIZAR ---------------------
        let valoresPorColumnasNormalizados = {};
        for (let columna in this.tratamientoDatos) {
            if (this.tratamientoDatos[columna].normalizar === true && this.tratamientoDatos[columna].hide === false) {
                let nombreColumna = this.tratamientoDatos[columna].header;
                let valores = datosCodificar.map(item => item[nombreColumna]);
                console.log(valores);
                let min = Math.min(...valores);
                let max = Math.max(...valores);
                valoresPorColumnasNormalizados[nombreColumna] = valores.map(valor => (valor - min) / (max - min));
            }
        }
        console.log(valoresPorColumnasNormalizados);
        // reemplace los valores de las columnas normalizadas en datosCodificar
        let datosNormalizados = datosCodificar.map((item) => {
            const newItem = { ...item };
            for (let columna in valoresPorColumnasNormalizados) {
                newItem[columna] = valoresPorColumnasNormalizados[columna].shift();
            }
            return newItem;
        });
        console.log(datosNormalizados);
        this.list3 = datosNormalizados;
        
    }

    pestana() {
        
        this.tratamientoDatos.forEach((tratamientoDato) => {
            let caracteristicas = this.administrarColumnas.find((caracteristicas) => caracteristicas.header === tratamientoDato.header);
            let fechas = this.tiposFechas.find((fechas) => fechas.header === tratamientoDato.header);
            if (caracteristicas) {
                if(caracteristicas.header === 'value') {
                    tratamientoDato.codificar = '';
                }
                tratamientoDato.hide = caracteristicas.hide;
            }
            if(fechas) {
                tratamientoDato.codificar = '';
                console.log(tratamientoDato);
                tratamientoDato.hide = fechas.hide;
            }
            });
    
        console.log(this.tratamientoDatos);
        
    }

    encode() {
        let valoresPorColumnas = {};
        for (let columna in this.list3[0]) {
            valoresPorColumnas[columna] = this.list3.map(item => item[columna]);
        }
        console.log(valoresPorColumnas);

        
        // let data = {
        //     fruits: ["pear", "mango", "pawpaw", "mango", "bean"],
        //     Count: [20, 30, 89, 12, 30],
        //     Country: ["NG", "NG", "GH", "RU", "RU"]
        // }
        let diccionario = [];
        Object.keys(valoresPorColumnas).forEach((key) => {
            console.log(key);
            let df = new dfd.DataFrame(valoresPorColumnas)
            let encode = new dfd.OneHotEncoder()
            
            encode.fit(df[key])
            console.log(encode);
            
            let sf_enc = encode.transform(df[key].values)
            console.log(sf_enc)
            
            var resultado=[];

            sf_enc.forEach(element => {
                resultado.push(element.indexOf(1))
                
            });
            console.log('Resultado:',resultado)
            console.log(encode.$labels);
            diccionario.push({[key]: encode.$labels});
            
        });
        console.log('GUARDAMOS DICCIONARIO: ', diccionario);
        
        
    }
// -------------------------------------------------------------------------------------------------------------------------------


// --------------------------------------------GUARDAR----------------------------------------------------------------------------

    guardarDataSet() {
        if(!this.primerForm.invalid) {
            console.log('Guardando dataset');
    
            // this.primerForm.value.Tablacaracteristicas = this.columns;
            // this.primerForm.value.TablaList = this.list;
            
            this.primerForm.value.Tabla1AdministrarColumnas = this.administrarColumnas;
            // this.primerForm.value.Tabla1Columns = this.columns1;
            // this.primerForm.value.Tabla1List = this.list1;
            
            this.primerForm.value.Tabla2TiposFechas = this.tiposFechas;
            // this.primerForm.value.Tabla2Columns = this.columns2;
            // this.primerForm.value.Tabla2List = this.list2;
            this.primerForm.value.Tabla3TratamientoDatos = this.tratamientoDatos;
            // this.primerForm.value.Tabla3Columns = this.columns3;
            // this.primerForm.value.Tabla3List = this.list3;
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
                    this.isReload = false;
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
        this.isReload = true;
    }
// -------------------------------------------------------------------------------------------------------------------------------
}








