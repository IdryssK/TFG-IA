const { dbConsult } = require("../database/db");


// Función para obtener un dataset por su ID
async function datasetByIdx(idx) {
    try {
        const query = 'SELECT * FROM dataset WHERE DS_Idx = ?';
        
        const values = [idx];
        const [result] = await dbConsult(query, values);
        return result.length === 0 ? null : result[0];
    } catch (error) {
        throw error;
    }
}

// Función para obtener todos los datasets
async function getAllDatasets(data) {
    try {
        let paramsQuery = [];
        let query = `SELECT 
                        DS_Idx,
                        DS_Nombre,
                        DS_Ruta,
                        DS_Ruta_Dic,
                        DS_Upd_When 
                    FROM dataset
                    `;

        if(data.querySearch){
            query += ` WHERE DS_Nombre LIKE ?`;
            paramsQuery.push(data.querySearch);
        }

        // Se realiza una busqueda de todos los usuarios para poder hacer la paginación
        const [total] = await dbConsult(query, paramsQuery);

        query += ` LIMIT ?, ?`;

        paramsQuery.push(data.desde);
        paramsQuery.push(data.registropp);

        const [datasets] = await dbConsult(query, paramsQuery);

        return datasets.length === 0 ? [[], total.length] : [datasets, total.length];
    } catch (error) {
        throw error;
    }
}

// Función para crear un dataset
async function crearDataset(dataset) {
    try {
        const query = `INSERT INTO dataset (${Object.keys(dataset).join(',')}) VALUES (?)`;
        const values = [Object.values(dataset)];
        const [result] = await dbConsult(query, values);
        return result.insertId;
    } catch (error) {
        throw new Error('Error al crear el dataset');
    }
}


// Función para editar un dataset
async function editarDataset(dataset) {
    try {
        const query = 'UPDATE dataset SET ? WHERE DS_Idx = ?' ;
        const values = [dataset, dataset.CONF_Idx];
        await dbConsult(query, values);
    } catch (error) {
        throw new Error('Error al actualizar la dataset');
    }
}

// Función para borrar un dataset
async function borrarDataset(idx) {
    try {
        const query = 'DELETE FROM dataset WHERE DS_Idx = ?';
        const values = [idx];
        await dbConsult(query, values);
    } catch (error) {
        throw new Error('Error al eliminar la dataset');
    }
}

module.exports = {
    crearDataset,
    editarDataset,
    borrarDataset,
    datasetByIdx,
    getAllDatasets,
};