/// <reference lib="webworker" />



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

addEventListener('message', function(event) {
  const mensajeRecibido = event.data;
  console.log('Mensaje recibido en el Web Worker:', mensajeRecibido);

  // Realiza algún procesamiento...

  const respuesta = 'Mensaje procesado en el Web Worker';
  postMessage(respuesta);
});
