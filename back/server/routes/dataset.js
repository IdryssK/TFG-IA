const { Router } = require('express'); // Router de Express
const { check } = require('express-validator'); // check de Express Validator
const {createDataset, deleteDataset, editDataset, getDataset, getDatasets} = require('../controllers/dataset');


const router = Router();


// GET all datasets
router.get('/', getDataset);

// GET dataset by ID
router.get('/:id', getDatasets);

// POST create dataset
router.post('/', [
    check('nombre', 'Name is required').not().isEmpty(),
    check('token', 'Description is required').not().isEmpty(),
], createDataset);

// PUT update dataset by ID
router.put('/:id', [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
], editDataset);

// DELETE dataset by ID
router.delete('/:id', deleteDataset);

module.exports = router; 