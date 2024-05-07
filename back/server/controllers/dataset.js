const { response } = require('express');
const {crearDataset,
    editarDataset,
    borrarDataset,
    datasetByIdx,
    getAllDatasets,} = require('../dao/dataset');
const { Parser } = require( 'json2csv');
const { writeFile } = require( 'fs');
    


// Función para obtener un dataset por su ID
const getDatasets = async (req, res) => {
    const page      = Number( req.query.page ) || 0; // En caso de que no venga nada o no sea un numero se inicializa a 0.
    const registropp = Number( req.query.per_page ) || 10; // En caso de que no venga nada o no sea un numero se inicializa a 10.

    // Calcula el índice de inicio basado en el número de página y los registros por página
    const desde = (page) * registropp;
    // Se comprueba si se pasa alguna query por parametro para buscar usuarios
    const querySearch = req.query.query;
    console.log(req.query);
    // Datos para enviar a la base de datos
    const data = {
        desde,
        registropp,
        querySearch
    };

    try {

        const [datasets, total] = await getAllDatasets(data);
        
        res.status(200).json({
            msg: 'getDatasets',
            datasets,
            page:{
                desde,
                registropp,
                total: total
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'Error al listar datasets'
        });
    }
};

// Función para obtener todos los datasets
const getDatasetByIdx = async (req, res) => {
    console.log(req.params);
    const idx = req.params.id;
    try {

        const dataset = await datasetByIdx(idx);
        if(dataset !== null){
            res.status(200).json({
                msg: 'getDatasetByIdx',
                dataset: dataset
            });
            return;
        }
        else{
            res.status(404).json({
                msg: 'No se ha encontrado el dataset'
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el datasetsss' });
    }
};

// Función para crear un dataset
const createDataset = async (req, res) => {
    const {...object} = req.body;
    try {
        let data = {
            DS_CONF_Idx: object.DS_CONF_Idx,
            DS_Ruta: "",
            DS_Ruta_Dic: "", // New field for dictionary path
            DS_Upd_When: new Date(),
        }

        // Convertir los datos a CSV y guardarlos en el servidor
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(object.DS_Dataset);
        const timestamp = data.DS_Upd_When.getTime();
        const filename = `dataset_${object.DS_CONF_Idx}_${timestamp}.csv`;
        const ruta = `../../front/src/assets/datasets/${filename}`;
        data.DS_Ruta = '/assets/datasets/' + filename;

        // Convert dictionary to JSON and save it on the server
        const diccionario = JSON.stringify(object.DS_Diccionario);
        const diccionarioFilename = `diccionario_${object.DS_CONF_Idx}_${timestamp}.json`;
        const diccionarioRuta = `../../front/src/assets/diccionarios/${diccionarioFilename}`;
        data.DS_Ruta_Dic = '/assets/diccionarios/' + diccionarioFilename;

        const resultado = await crearDataset(data);

        writeFile(ruta, csv, (error) => {
            if (error) {
                console.error('Error al escribir el archivo CSV:', error);
                res.status(500).json({ error: 'Error al guardar el dataset' });
            } else {
                console.log(`Archivo CSV guardado con éxito en ${ruta}`);
                // Save dictionary file
                writeFile(diccionarioRuta, diccionario, (error) => {
                    if (error) {
                        console.error('Error al escribir el archivo de diccionario:', error);
                        res.status(500).json({ error: 'Error al guardar el diccionario' });
                    } else {
                        console.log(`Archivo de diccionario guardado con éxito en ${diccionarioRuta}`);
                        res.status(200).json({
                            msg: 'Dataset y diccionario creados',
                            resultado
                        });
                    }
                });
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el datasetsss' });
    }
};

// Función para editar un dataset
const editDataset = async (req, res) => {
    const idx = req.params.id;

    try{

        // Comprueba que haya un usuario con ese ID.
        let dataset = await getDatasetByIdx(idx);
        if( dataset === null ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(400).json({
                msg: 'No existe el datset'
            });
            return;
        }

        // Extrae los campos que no cabe especificar a la hora de crear.
        const { ...object } = req.body;
        
        let data = {
            DS_Idx: idx,
            DS_Ruta: object.dataset_Data.nombre,
            DS_Upd_When: new Date(),
        }

        console.log(data)
        // Se comprueba si alguno de los campos no se han enviado por el cuerpo o es nulo
        Object.keys(data).forEach(key => {
            if(data[key] === undefined || data[key] === null || data[key] === ''){
                delete data[key];
            }
        });
                
        // Se actualiza. 
        await editarDataset(data);
        
        res.status( 200 ).json( {msg: 'Dataset actualizado'} );

    } catch(error){
        console.error(error);

        res.status(500).json({
            msg: 'Error al actualizar dataset'
        });
    }
};

// Función para borrar un dataset
const deleteDataset = async (req, res) => {
    const idx = req.params.id;
    
    try{
        
        // Se comprueba que haya un usuario con ese ID.
        let dataset = await datasetByIdx(idx);
        if( dataset === null ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        // Se elimina usuario.
        await borrarDataset(idx);

        res.status(200).json({
            msg:'Dataset eliminado',
        });
    } catch(error){
        console.error(error);
        res.status(500).json({
            msg: 'Error al borrar dataset'
        });
    }
};

module.exports = {
    createDataset,
    editDataset,
    deleteDataset,
    getDatasets,
    getDatasetByIdx
};
