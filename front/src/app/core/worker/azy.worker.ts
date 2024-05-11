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

async function codificar(data: any, tratamientoDatos: any) {
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


async function normalizar ( data: any, tratamientoDatos: any ){
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

addEventListener('message', async ({ data }) => {
	
	let {tiposFechas, data1, tratamientoDatos} = data;
	console.log(tiposFechas);
	console.log(data1);
	const keysData1 = Object.keys(data1[0]);
	tratamientoDatos = tratamientoDatos.filter(item => keysData1.includes(item.header));
	console.log(tratamientoDatos);



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
	console.log(data2);

	let datosNulos = tratarNulos(data2, tratamientoDatos);
	// this.progressService.changeState('Codificando...');
	console.log(datosNulos);
	
	let [datosCodificar, datosCodificarDiccionario] = await codificar(datosNulos, tratamientoDatos);
	let data3 = await normalizar(datosCodificar, tratamientoDatos);

	let result = {datosCodificarDiccionario, data3}
    console.log(result)

	const response = result;

	postMessage(response);
});
