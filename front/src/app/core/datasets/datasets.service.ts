import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { Observable, map } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { ApiSmartUaService } from '../smartUa/api-smart-ua.service';
import * as dfd from 'danfojs';
import moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class DatasetsService {


/*
 Este servicio se encarga de gestionar los datasets. Pero se añadieron las diferentes funciones de la pestaña de tratamiento de datos debido a que se necesitaba pasarle la informacion al componente progressDialog.
 De esta manera las funciones, tratarnulos, codificar y normalizar se puedan utilizar en cualquier componente.
*/

  columnFunctions = {
    'epoch': (item) => moment.utc(item.time).valueOf(),
    'dia': (item) => moment.utc(item.time).date(),
    'mes': (item) => moment.utc(item.time).month() + 1,
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
  constructor(private http: HttpClient, private apiSmartUaService: ApiSmartUaService) { }

  // DATASET SERVICE
  private tokenSource = new BehaviorSubject<string>(null);
  token$ = this.tokenSource.asObservable();

  private selectedValueByTagSource = new BehaviorSubject<{ [tag: string]: any[]; }>(null);
  selectedValueByTag$ = this.selectedValueByTagSource.asObservable();

  private tiposFechasSource = new BehaviorSubject<any>(null);
  tiposFechas$ = this.tiposFechasSource.asObservable();

  private tratamientoDatosSource = new BehaviorSubject<any>(null);
  tratamientoDatos$ = this.tratamientoDatosSource.asObservable();
  
  private idxSource = new BehaviorSubject<any>(null);
  idx$ = this.idxSource.asObservable();

  private primerFormSource = new BehaviorSubject<any>(null);
  primerForm$ = this.primerFormSource.asObservable();

  setToken(token: string) {
    this.tokenSource.next(token);
  }

  setSelectedValueByTag(value: { [tag: string]: any[]; }) {
    this.selectedValueByTagSource.next(value);
  }

  setTiposFechas(fechas: any) {
    this.tiposFechasSource.next(fechas);
  }
  setTratamientoDatos(datos: any) {
    this.tratamientoDatosSource.next(datos);
  }
  setPrimerForm(form: any) {
    this.primerFormSource.next(form);
  }
  setIdx(idx: any) {
    this.idxSource.next(idx);
  }

  async obtenerDatos(token: string, count_value: number, selectedValueByTag: any, start: Date, end: Date) {
    console.log('Obteniendo datos')
    const response = await this.apiSmartUaService.getDataSmartUa(token, count_value, selectedValueByTag, start, end).toPromise();
    const data = response.result;
    const datasetCol =  data.columns.map((column: string) => {
        return { header: column, field: column, hide: false, show: true};
    });
  
    const columnas = data.columns;
    const valores = data.values;
  
    const datosProcesados = valores.map((fila: any[]) => {
        const filaProcesada: any = {};
        columnas.forEach((columna: string, indice: number) => {
            filaProcesada[columna] = fila[indice];
        });
        return filaProcesada;
    });
    return { datasetCol, datasetList: datosProcesados };
  }

  

  getColumnValue(item: any, columnName: string) {
    if (this.columnFunctions.hasOwnProperty(columnName)) {
        return this.columnFunctions[columnName](item);
    } else {
        return null;
    }
  }
  async tratarNulos(data: any, tratamientoDatos: any) {
    console.log('Tratando nulos')
    return data.map((item: any) => {
      const newItem: any = {};
      let noMete = false;
      const columns = tratamientoDatos.filter((column: any) => !column.hide);
      for (let i = 0; i < columns.length; i++) {
          const column = columns[i];
          if (item.hasOwnProperty(column.header)) {
              if (column.nulos === 'Eliminar' && item[column.header] === null) {
                  noMete = true;
                  break;
              }
              if (column.nulos === 'Sustituir' && item[column.header] === null) {
                  item[column.header] = parseInt(column.valorSustituir);
              }
              newItem[column.header] = item[column.header];
          }
      }
      return noMete ? null : newItem;
    }).filter(item => item !== null);
  }

  async codificar(data: any, tratamientoDatos: any) {
    console.log('Codificando')

    let valoresPorColumnas = {};
    let datosCodificarDiccionario = {};
    let valoresPorColumnasCodificados = {};

    for (let columna in tratamientoDatos) {
        if (tratamientoDatos[columna].codificar === 'one-hot' && tratamientoDatos[columna].hide === false) {
            let nombreColumna = tratamientoDatos[columna].header;
            valoresPorColumnas[nombreColumna] = data.map(item => item[nombreColumna]);

            let df = new dfd.DataFrame(valoresPorColumnas);
            let encode = new dfd.OneHotEncoder();
            encode.fit(df[nombreColumna]);
            let sf_enc = encode.transform(df[nombreColumna].values);
            valoresPorColumnasCodificados[nombreColumna] = sf_enc.map(element => element.indexOf(1));

            // Guardar el diccionario de etiquetas
            datosCodificarDiccionario[nombreColumna] = encode.$labels;
        }
    }

    let datosCodificar = data.map((item) => {
        const newItem = { ...item };
        for (let columna in valoresPorColumnasCodificados) {
            newItem[columna] = valoresPorColumnasCodificados[columna].shift();
        }
        return newItem;
    });

    // Devolver ambos arrays
    return [datosCodificar, datosCodificarDiccionario];
}


  contarValoresDiferentes(arr: number[]): number {
    const conjunto = new Set(arr);
    return conjunto.size;
  }
  async normalizar(data: any, tratamientoDatos: any) {
    console.log('Normalizando')

    // Calculate unique values and steps for each column outside the map loop
    const columnData = {};
    for (let columna in tratamientoDatos) {
        if (tratamientoDatos[columna].normalizar === true && tratamientoDatos[columna].hide === false) {
            let nombreColumna = tratamientoDatos[columna].header;
            let numElementos = this.contarValoresDiferentes(data.map(item => item[nombreColumna]));
            let Vini = parseInt(tratamientoDatos[columna].min)
            let Vfin = parseInt(tratamientoDatos[columna].max)
            let paso = (Vfin - Vini) / (numElementos - 1);

            columnData[nombreColumna] = { paso, Vini };
        }
    }

    return data.map((item, index) => {
        const newItem = { ...item };
        for (let columna in tratamientoDatos) {
            if (tratamientoDatos[columna].normalizar === true && tratamientoDatos[columna].hide === false) {
                let nombreColumna = tratamientoDatos[columna].header;

                // Use the precalculated step and Vini values
                let { paso, Vini } = columnData[nombreColumna];

                // Apply the new normalization formula
                newItem[nombreColumna] = Vini + (item[nombreColumna] * paso);
            }
        }
        return newItem;
    });
  }

  // LLAMADAS A LA API (BACKEND) -----------------------------------------------------------------------------------------------------

  getDatasets(params): Observable<any> {
    let data = {
      headers: this.cabeceras.headers,
      params: params
  };
    return this.http.get<any>(`${environment.apiUrl}/datasets`, data).pipe(
      map((response) => response),
    );
  }

  getDataset(idx: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/datasets/${idx}`, this.cabeceras).pipe(
      map((response) => response),
    );
  }

  saveDataset(data, diccionario, idx, nombre): Observable<any> {
    let params = {
      "DS_CONF_Idx": idx,
      "DS_Dataset": data,
      "DS_Nombre": nombre,
      "DS_Diccionario": diccionario
    };
    return this.http.post<any>(`${environment.apiUrl}/datasets`, params, this.cabeceras, ).pipe(
      map((response) => response),
    );
  }

  deleteDataset(idx): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/datasets/${idx}`, this.cabeceras).pipe(
      map((response) => response),
    );
  }

  

  get cabeceras() {
    return {
      headers: {
        'accessToken': this.token
      }};
  }
  get token(): string {
    return localStorage.getItem('accessToken') || '';
  }


}
