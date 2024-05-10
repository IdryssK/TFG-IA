import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ProgressService } from 'app/core/progressBar/progressBar.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MtxProgress, MtxProgressType } from '@ng-matero/extensions/progress';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiSmartUaService } from 'app/core/smartUa/api-smart-ua.service';
import { DatasetsService } from 'app/core/datasets/datasets.service';
@Component({
  selector: 'app-progressdialog',
  templateUrl: './progressdialog.component.html',
  standalone: true,
  imports: [MatProgressBarModule, MatDialogModule, MtxProgress, CommonModule, MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule, MatButtonModule],
})
export class ProgressDialogComponent implements OnInit {
  progress: number = 0;
  generating: boolean = false;
  progresoTexto: string = '';
  form: FormGroup;
  state: string;
  success: boolean;
  constructor(private apiSmartUaService: ApiSmartUaService, private progressService: ProgressService, private datasetService: DatasetsService, public dialogRef: MatDialogRef<ProgressDialogComponent>,) { 
    this.form = new FormGroup({
      nombre: new FormControl('asd', Validators.required),
    }); }
    token: string;
    selectedValueByTag: {[tag: string]: any[]} = {};
    tiposFechas: any = [];
    tratamientoDatos: any = [];
    primerForm: any;
    count_value: number;
    idx: any; 
    nombre: string
  ngOnInit(): void {
    this.generating = false;
    this.success = false;
    console.log(this.generating);
    console.log(this.success);
    this.progressService.currentState.subscribe(state => this.state = state);
    this.progressService.progress.subscribe(state => this.progress = state );
    
    this.datasetService.token$.subscribe(token => this.token = token);
    this.datasetService.selectedValueByTag$.subscribe(value => this.selectedValueByTag = value);
    this.datasetService.tiposFechas$.subscribe(value => this.tiposFechas = value);
    this.datasetService.tratamientoDatos$.subscribe(value => this.tratamientoDatos = value);
    this.datasetService.primerForm$.subscribe(form => this.primerForm = form);
    this.datasetService.idx$.subscribe(idx => this.idx = idx);
  }

  async generar() {
    if (this.form.invalid) {
      return;
    }
    this.progressService.changeProgress(0);
    this.generating = true;
    this.nombre = this.form.get('nombre').value;
    console.log(this.success);
    try {
      console.log(this.primerForm.start, this.primerForm.end);
      // this.progressService.changeState('Recogiendo datos...');
      await this.apiSmartUaService.getTotalDataCount(this.token, this.selectedValueByTag, this.primerForm.start, this.primerForm.end)
      .toPromise().then((response) => {
        this.progressService.changeProgress(7);
        this.count_value = response.result.values[0][1];
      });
      this.progressService.changeProgress(15);


      this.progressService.changeProgress(25);

      const { datasetCol, datasetList } =  await this.datasetService.obtenerDatos(this.token, this.count_value, this.selectedValueByTag,  this.primerForm.start, this.primerForm.end);  
      const data1 = [...datasetList];
      console.log(data1)
      this.progressService.changeProgress(35);
      // this.progressService.changeState('Tratamiento de fechas...');

      const data2 = data1.map(item => {
        const newItem = { ...item };
        this.tiposFechas.forEach(column => {
          if (column.hide === false) {
            newItem[column.header] = this.datasetService.getColumnValue(item, column.header);
          }
        });
        return newItem;
      });
      // this.progressService.changeState('Tratando nulos...');
      console.log(data2);
      this.progressService.changeProgress(50);

      let datosNulos = await this.datasetService.tratarNulos(data2, this.tratamientoDatos);
      this.progressService.changeProgress(60);
      // this.progressService.changeState('Codificando...');
      console.log(datosNulos);

      let [datosCodificar, datosCodificarDiccionario] = await  this.datasetService.codificar(datosNulos, this.tratamientoDatos);
      this.progressService.changeProgress(80);
      // this.progressService.changeState('Normalizando...');

      let data3 = await this.datasetService.normalizar(datosCodificar, this.tratamientoDatos);
      this.progressService.changeProgress(90);
      console.log(data3)
      // this.progressService.changeState('Guardando...');
      this.datasetService.saveDataset(data3, datosCodificarDiccionario , this.idx, this.nombre).subscribe((response) => {
        this.progressService.changeProgress(100); // Update progress to 100%
      }
      
      ,
      (error) => {
        console.error(error);
      });
      setTimeout(() => {
        this.progressService.changeProgress(105)
      }, 4000);
      if(this.progress === 100) {
        console.log('Dataset guardado correctamente')
          setTimeout(() => {
            this.success = true;
            this.generating = false;
          }, 1000);
      }
      console.log(this.success);
      } catch (error) {
        console.error(error);
      }
    
  }

  aceptar() {
    // Aquí va el código para manejar cuando el usuario acepta
    this.dialogRef.close();
  }
  cancelar() {
    this.dialogRef.close();
  }
}