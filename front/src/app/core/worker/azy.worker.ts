/// <reference lib="webworker" />
import * as dfd from 'danfojs';
import moment from 'moment';
/* 
4 funciones que se ejecutan en el worker

	1. Calcular tipos de fechas
	2. Tratar nulos
	3. Codificar
	4. Normalizar return response
	5. postMessage(response);

// CALCULAMOS LOS TIPOS FECHAS -------------------------------------------------------------------------------------------------------
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
// TRATAMOS LOS NULOS ----------------------------------------------------------------------------------------------------------------

			let datosNulos = await this.datasetService.tratarNulos(data2, this.tratamientoDatos);
			this.progressService.changeProgress(60);
			// this.progressService.changeState('Codificando...');
			console.log(datosNulos);
			 console.log(hola);
 // ONE HOT ---------------------------------------------------------------------------------------------------------------------------
	// let [datosCodificar, datosCodificarDiccionario] = await  this.datasetService.codificar(datosNulos, this.tratamientoDatos);
			this.progressService.changeProgress(80);
			// this.progressService.changeState('Normalizando...');
// NORMALIZAMOS -----------------------------------------------------------------------------------------------------------------------

			let data3 = await this.datasetService.normalizar(datosCodificar, this.tratamientoDatos);
			this.progressService.changeProgress(90);
			console.log(data3)

*/
const columnFunctions = {
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

function getColumnValue(item: any, columnName: string) {
    if (columnFunctions.hasOwnProperty(columnName)) {
        return columnFunctions[columnName](item);
    } else {
        return null;
    }
}


function tratarNulos(data, tratamientoDatos) {
	console.log('TRATAMOS LOS NULOS Y SE NOS QUEDA ESTOS DATOS:')
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


function agruparValoresPorColumna(data: any, tratamientoDatos: any) {
	console.log('AGRUPANDO VALORES POR COLUMNA')
    let valoresPorColumnas = {};

    for (let columna in tratamientoDatos) {
        if (tratamientoDatos[columna].codificar === 'one-hot' && tratamientoDatos[columna].hide === false) {
            let nombreColumna = tratamientoDatos[columna].header;
            valoresPorColumnas[nombreColumna] = data.map(item => item[nombreColumna]);
        }
    }

    return valoresPorColumnas;
}

function* mapToIndices(sf_enc) {
	for (let element of sf_enc) {
		yield element.indexOf(1);
	}
}

async function codificar(data: any, tratamientoDatos: any) {
    console.log('Codificando')

    let valoresPorColumnas = agruparValoresPorColumna(data, tratamientoDatos);
    let datosCodificarDiccionario = {};
    let valoresPorColumnasCodificados = {};

    // Filtrar tratamientoDatos antes del bucle
    tratamientoDatos = tratamientoDatos.filter(item => item.codificar === 'one-hot' && item.hide !== true);

    // Crear DataFrame una vez fuera del bucle
    let df = new dfd.DataFrame(valoresPorColumnas);

	

    for(let i = 0; i < tratamientoDatos.length; i++) {
        let nombreColumna = tratamientoDatos[i].header;
        let encode = new dfd.OneHotEncoder();
        encode.fit(df[nombreColumna]);
        let sf_enc = encode.transform(df[nombreColumna].values);
        for (let j = 0; j < sf_enc.length; j++) {
			sf_enc[j] = sf_enc[j].indexOf(1);
		}
        // Guardar el diccionario de etiquetas
        datosCodificarDiccionario[nombreColumna] = encode.$labels;
    }

    for(let i = 0; i < data.length; i++) {
        for (let columna in valoresPorColumnasCodificados) {
            data[i][columna] = valoresPorColumnasCodificados[columna][i];
        }
    }

    // Devolver ambos arrays
    return [data, datosCodificarDiccionario];
}

function contarValoresDiferentes(arr: number[]): number {
    const conjunto = new Set(arr);
    return conjunto.size;
}

async function normalizar ( data: any, tratamientoDatos: any ){
	console.log('Normalizando')

    // Calculate unique values and steps for each column outside the map loop
    const columnData = {};
    for (let columna in tratamientoDatos) {
        if (tratamientoDatos[columna].normalizar === true && tratamientoDatos[columna].hide === false) {
            let nombreColumna = tratamientoDatos[columna].header;
            let numElementos = contarValoresDiferentes(data.map(item => item[nombreColumna]));
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

addEventListener('message', async ({ data }) => {
	
	let {tiposFechas, data1, tratamientoDatos} = data;

	const data2 = data1.map(item => {
		const newItem = { ...item };
		tiposFechas.forEach(column => {
			if (column.hide === false) {
				newItem[column.header] = getColumnValue(item, column.header);
			}
		});
		return newItem;
	});
	// this.progressService.changeState('Tratando nulos...');
	
	//quitamos los columnas de tratamientoDatos que no sean igaules que data2.header = tratamientoDatos.header
	const keysData2 = Object.keys(data2[0]);
	tratamientoDatos = tratamientoDatos.filter(item => keysData2.includes(item.header) && item.hide !== true);

	const headersTratamientoDatos = tratamientoDatos.map(item => item.header);
	const datosReady = data2.map(item => {
		let newItem = {};
		headersTratamientoDatos.forEach(header => {
			if(item.hasOwnProperty(header)) {
				newItem[header] = item[header];
			}
		});
		return newItem;
	});
	// console.log(datosReady);
	

	let datosNulos = tratarNulos(datosReady, tratamientoDatos);

	let [datosCodificar, datosCodificarDiccionario] = await codificar(datosNulos, tratamientoDatos);
	let data3 = await normalizar(datosCodificar, tratamientoDatos);

	let result = {datosCodificarDiccionario, data3}
    console.log(result)

	const response = result;

	postMessage(response);
});
