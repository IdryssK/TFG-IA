const { response } = require('express');
const datasetDao = require('../dao/dataset');



// Función para obtener un dataset por su ID
const getDataset = async (req, res) => {
    try {
        const datasetId = req.params.id;
        const dataset = await datasetDao.datasetByIdx(datasetId);
        console.log(dataset);
        if (dataset) {
            res.json({
                success: true,
                dataset
            });
        } else {
            res.json({
                success: false,
                message: 'Dataset no encontrado'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el dataset'
        });
    }
};

// Función para obtener todos los datasets
const getDatasets = async (req, res) => {
    try {
        const datasets = await datasetDao.datasetList();
        
        res.json({
            success: true,
            datasets
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Error al obtener los datasets'
        });
    }
};

// Función para crear un dataset
const createDataset = async (req, res) => {
    try {
        const dataset = req.body;
        const result = await datasetDao.crearDataset(dataset);

        if (result) {
            res.json({ 
                success: true, 
                message: 'Dataset creado exitosamente' 
            });
        } else {
            res.json({ 
                success: false, 
                message: 'Error al crear el dataset' 
            });
        }
    } catch (error) {
        res.json({ 
            success: false, 
            message: 'Error al crear el dataset' 
        });
    }
};

// Función para editar un dataset
const editDataset = async (req, res) => {
    try {
        const datasetId = req.params.id;
        const newData = req.body;
        const datasetExists = await datasetDao.datasetByIdx(datasetId);

        if (datasetExists) {
            const result = await datasetDao.editarDataset(datasetId, newData);

            if (result) {
                res.json({
                    success: true,
                    message: 'Dataset editado exitosamente' 
                });
            } else {
                res.json({ 
                    success: false,
                    message: 'Error al editar el dataset' 
                });
            }
        } else {
            res.json({ 
                success: false,
                message: 'Dataset no encontrado' 
            });
        }
    } catch (error) {
        res.json({ 
            success: false,
            message: 'Error al editar el dataset' 
        });
    }
};

// Función para borrar un dataset
const deleteDataset = async (req, res) => {
    try {
        const datasetId = req.params.id;
        const datasetExists = await datasetDao.datasetByIdx(datasetId);

        if (datasetExists) {
            const result = await datasetDao.borrarDataset(datasetId);

            if (result) {
                res.json({
                    success: true,
                    message: 'Dataset borrado exitosamente' 
                });
            } else {
                res.json({ 
                    success: false,
                    message: 'Error al borrar el dataset' 
                });
            }
        } else {
            res.json({ 
                success: false,
                message: 'Dataset no encontrado' 
            });
        }
    } catch (error) {
        res.json({ 
            success: false,
            message: 'Error al borrar el dataset' 
        });
    }
};

module.exports = {
    createDataset,
    editDataset,
    deleteDataset,
    getDataset,
    getDatasets
};
