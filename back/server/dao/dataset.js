const dbConsult = require('../database/db');


// Función para obtener un dataset por su ID
async function datasetByIdx(datasetId) {
    const sql = `SELECT * FROM dataset WHERE Dataset_Idx = ?`;
    const values = [datasetId];

    try {
        const result = await dbConsult(sql, values);
        return result;
    } catch (error) {
        throw error;
    }
}

// Función para obtener todos los datasets
async function datasetList() {
    const sql = `SELECT * FROM dataset`;
    console.log('paso por dateasetList');
    try {
        const result = await dbConsult(sql);
        return result;
    } catch (error) {
        throw error;
    }
}

// Función para crear un dataset
async function crearDataset(dataset) {
    const sql = `INSERT INTO dataset (Dataset_Nombre, Dataset_Token, Dataset_Desde, Dataset_Hasta, Dataset_Filtros, Dataset_Columnas, Dataset_Fechas, Dataset_Datos) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        dataset.Dataset_Nombre,
        dataset.Dataset_Token,
        dataset.Dataset_Desde,
        dataset.Dataset_Hasta,
        dataset.Dataset_Filtros,
        dataset.Dataset_Columnas,
        dataset.Dataset_Fechas,
        dataset.Dataset_Datos
    ];

    try {
        const result = await dbConsult(sql, values);
        return result;
    } catch (error) {
        throw error;
    }
}


// Función para editar un dataset
async function editarDataset(datasetId, dataset) {
    try {
        await datasetByIdx(datasetId); // Call datasetByIdx function passing the datasetId as parameter
        const sql = `UPDATE dataset 
                             SET Dataset_Nombre = ?, Dataset_Token = ?, Dataset_Desde = ?, Dataset_Hasta = ?, 
                                     Dataset_Filtros = ?, Dataset_Columnas = ?, Dataset_Fechas = ?, Dataset_Datos = ? 
                             WHERE Dataset_Idx = ?`;
        const values = [
            dataset.Dataset_Nombre,
            dataset.Dataset_Token,
            dataset.Dataset_Desde,
            dataset.Dataset_Hasta,
            dataset.Dataset_Filtros,
            dataset.Dataset_Columnas,
            dataset.Dataset_Fechas,
            dataset.Dataset_Datos,
            datasetId
        ];

        const result = await dbConsult(sql, values);
        return result;
    } catch (error) {
        throw error;
    }
}

// Función para borrar un dataset
async function borrarDataset(datasetId) {
    try {
        await datasetByIdx(datasetId); // Call datasetByIdx function passing the datasetId as parameter
        const sql = `DELETE FROM dataset WHERE Dataset_Idx = ?`;
        const values = [datasetId];

        const result = await dbConsult(sql, values);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    crearDataset,
    editarDataset,
    borrarDataset,
    datasetByIdx,
    datasetList
};