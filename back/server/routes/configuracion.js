const { Router } = require('express'); // Router de Express
const { check } = require('express-validator'); // check de Express Validator

const {validateFields} = require('../middleware/validate-fields')
const {validateJWT} = require('../middleware/validate-jwt')

const { obtenerConfiguraciones,
    obtenerConfiguracionPorId,
    crearConfiguracion,
    actualizarConfiguracion,
    eliminarConfiguracion } = require('../controllers/configuracion')


const router = Router();
 
router.get('/',
    validateJWT,
    obtenerConfiguraciones);

router.get('/:id', [
    check('id', 'El identificador no es válido').isInt(),
    validateJWT
], obtenerConfiguracionPorId); 


router.post('/', [
    check('CONF_Data', 'El email debe ser válido').notEmpty(),
    validateJWT,
    validateFields,
], crearConfiguracion);    

router.put('/:id', [
    check('id', 'El identificador no es válido').isInt(),
    check('email', 'El email debe ser válido').optional().isEmail(),
    check('password', 'El campo password es obligatorio').optional().notEmpty(),
    validateJWT,
    validateFields,
], actualizarConfiguracion);    


router.delete('/:id', [
    check('id', 'El identificador no es válido').isInt(),
    validateJWT,
    validateFields
], eliminarConfiguracion); 

module.exports = router;