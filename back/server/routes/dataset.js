const { Router } = require('express'); // Router de Express
const { check } = require('express-validator'); // check de Express Validator
const {createDataset, deleteDataset, editDataset, getDatasetByIdx, getDatasets} = require('../controllers/dataset');
const {validateFields} = require('../middleware/validate-fields')
const {validateJWT} = require('../middleware/validate-jwt')


const router = Router();


// GET all datasets
router.get('/',
validateJWT, getDatasets);

// GET dataset by ID
router.get('/:id',
validateJWT, getDatasetByIdx);

// POST create dataset
router.post('/', [
    check('DS_CONF_Idx', 'Tiene que tener un idx de la configuracion').notEmpty(),
    check('DS_Dataset', 'Tiene que tener el dataset').notEmpty()
],
validateJWT, createDataset);

// PUT update dataset by ID
router.put('/:id', [
    check('ruta', 'Tiene que tener una ruta').notEmpty()
],
validateJWT, editDataset);

// DELETE dataset by ID
router.delete('/:id',
validateJWT, deleteDataset);

module.exports = router; 