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
import { WorkerService } from 'app/core/worker/worker.service';
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
  error: boolean;
  mensajeRecibido: any;
  
  constructor(private cdr: ChangeDetectorRef, private workerService: WorkerService, private apiSmartUaService: ApiSmartUaService, private progressService: ProgressService, private datasetService: DatasetsService, public dialogRef: MatDialogRef<ProgressDialogComponent>,) { 
    this.form = new FormGroup({
      nombre: new FormControl('', Validators.required),
    }); 
    this.workerService.workerMessage.subscribe((mensaje) => {
      this.mensajeRecibido = mensaje;
    });
    
  }
    token: string;
    selectedValueByTag: {[tag: string]: any[]} = {};
    tiposFechas: any = [];
    tratamientoDatos: any = [];
    primerForm: any;
    count_value: number;
    idx: any; 
    nombre: string
  ngOnInit(): void {
    this.cdr.detectChanges();
    this.generating = false;
    this.success = false;
    console.log(this.generating);
    console.log(this.success);
    this.progressService.changeProgress(0)
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
      
//---------------------------------------------------------------------------------------------------
      let data = { tiposFechas: this.tiposFechas, data1, tratamientoDatos: this.tratamientoDatos };
      this.workerService.postMessage(data);
      this.progressService.changeProgress(55);
      this.workerService.workerMessage.subscribe((message) => {
          console.log('Received message from worker:', message);

          this.mensajeRecibido = message;
          const {data3, datosCodificarDiccionario} = this.mensajeRecibido

    // Comprueba si this.mensajeRecibido no es undefined
        this.success = this.mensajeRecibido !== undefined;
          this.datasetService.saveDataset(data3, datosCodificarDiccionario , this.idx, this.nombre).subscribe((response) => {
            this.progressService.changeProgress(100); // Update progress to 100%
          },(error) => {
            console.error(error);
          });
          setTimeout(() => {
            this.progressService.changeProgress(105)
          }, 4000);
          if(this.progress === 100) {
            console.log('Dataset guardado correctamente')
              	setTimeout(() => {
					this.progressService.changeProgress(0)
					this.success = true;
					this.generating = false;
              }, 1000);
          }
          console.log(this.success);
        });
      // this.progressService.changeState('Guardando...');
      
    
  }
  enviarMensaje() {
    // Envía un mensaje al Web Worker a través del servicio
    
  }
  aceptar() {
    // Aquí va el código para manejar cuando el usuario acepta
    this.error = false;
    this.dialogRef.close();
  }
  cancelar() {
    this.dialogRef.close();
  }
}