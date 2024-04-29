const { response } = require('express');
const { getAllConfiguraciones,
    getConfiguracionById,
    createConfiguracion,
    updateConfiguracion,
    deleteConfiguracion,} = require('../dao/configuracion');

// Obtener todas las configuraciones
const obtenerConfiguraciones = async (req, res) => {
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

        const [configuraciones, total] = await getAllConfiguraciones(data);
        
        res.status(200).json({
            msg: 'getUsuarios',
            configuraciones,
            page:{
                desde,
                registropp,
                total: total
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            msg: 'Error al listar usuariosss'
        });
    }
};

// Obtener una configuración por su ID
const obtenerConfiguracionPorId = async (req, res) => {
    const uid = req.params.id;
    try {

        const configuracion = await getConfiguracionById(uid);
        if(configuracion !== null){
            res.status(200).json({
                msg: 'getConfiguracion',
                configuracion: configuracion
            });
            return;
        }
        else{
            res.status(404).json({
                msg: 'No se ha encontrado la configuracion'
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la configuración' });
    }
};

// Crear una nueva configuración
const crearConfiguracion = async (req, res) => {
    const {...object} = req.body;
    // console.log(object);
    try {
        // Comprueba si el email ya esta en uso
        const existeCONF = await getConfiguracionById(object.CONF_Idx);
        console.log(existeCONF);
        if( existeCONF !== null ){
            res.status(400).json({
                msg: 'El email ya existe'
            });
            return;
        }


        let data = {
            CONF_Nombre: object.CONF_Data.nombre,
            CONF_Data: JSON.stringify(object.CONF_Data),
            CONF_Upd_When: new Date(),
        }
        console.log(data)

        await createConfiguracion(data);

        res.status(200).json({
            msg: 'Configuracion creada',
        });
        
    } catch (error) {
        console.error(error);
        
        res.status(500).json({
            msg: 'Error al crear la configuracion'
        });
    }
};

// Actualizar una configuración existente
const actualizarConfiguracion = async (req, res) => {
    const uid = req.params.id;

    try{

        // Comprueba que haya un usuario con ese ID.
        let config = await getConfiguracionById(uid);
        console.log('DESPUES DE BUSCAR EL USUARIO')
        if( config === null ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(400).json({
                msg: 'No existe la configuracion'
            });
            return;
        }

        // Extrae los campos que no cabe especificar a la hora de crear.
        const { ...object } = req.body;
        
        let data = {
            CONF_Idx: uid,
            CONF_Nombre: object.CONF_Data.nombre,
            CONF_Data: JSON.stringify(object.CONF_Data),
            CONF_Upd_When: new Date(),
        }

        console.log(data)
        // Se comprueba si alguno de los campos no se han enviado por el cuerpo o es nulo
        Object.keys(data).forEach(key => {
            if(data[key] === undefined || data[key] === null || data[key] === ''){
                delete data[key];
            }
        });
                
        // Se actualiza. 
        await updateConfiguracion(data);
        
        res.status( 200 ).json( {msg: 'Configuracion actualizada'} );

    } catch(error){
        console.error(error);

        res.status(500).json({
            msg: 'Error al actualizar configuracion'
        });
    }
};

// Eliminar una configuración existente
const eliminarConfiguracion = async (req, res) => {
    const uid = req.params.id;
    
    try{
        
        // Se comprueba que haya un usuario con ese ID.
        let conf = await getConfiguracionById(uid);
        if( conf === null ){
            // Si no lo hay, responde con not found sin cuerpo.
            res.status(404);
            res.send();
            return;
        }

        // Se elimina usuario.
        await deleteConfiguracion(uid);

        res.status(200).json({
            msg:'Configuracion eliminada',
        });
    } catch(error){
        console.error(error);
        res.status(500).json({
            msg: 'Error al borrar configuracion'
        });
    }
};

// Exportar las funciones del controlador
module.exports = {
    obtenerConfiguraciones,
    obtenerConfiguracionPorId,
    crearConfiguracion,
    actualizarConfiguracion,
    eliminarConfiguracion
};
