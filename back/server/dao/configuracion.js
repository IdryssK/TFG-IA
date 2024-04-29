const { dbConsult } = require("../database/db");

// Obtener todas las configuraciones
async function getAllConfiguraciones(data) {
    console.log(data);
    try {
        let paramsQuery = [];
        let query = `SELECT CONF_Idx, CONF_Nombre, CONF_Upd_When FROM configuracion`;

        if(data.querySearch){
            query += ` WHERE CONF_Nombre LIKE ?`;
            paramsQuery.push(data.querySearch);
        }

        // Se realiza una busqueda de todos los usuarios para poder hacer la paginación
        const [total] = await dbConsult(query, paramsQuery);

        query += ` LIMIT ?, ?`;

        paramsQuery.push(data.desde);
        paramsQuery.push(data.registropp);

        const [users] = await dbConsult(query, paramsQuery);

        return users.length === 0 ? [[], total.length] : [users, total.length];
    } catch (error) {
        throw error;
    }
}

// Obtener una configuración por su índice
const getConfiguracionById = async(id) => {
    console.log(id);
    try {
        const query = 'SELECT CONF_Idx, CONF_Nombre, CONF_Data, CONF_Upd_When CONF FROM configuracion WHERE CONF_Idx = ?';
        
        const values = [id];
        const [result] = await dbConsult(query, values);
        return result.length === 0 ? null : result[0];
    } catch (error) {
        throw error;
    }
}

// Crear una nueva configuración
async function createConfiguracion(data) {
    try {
        const query = `INSERT INTO configuracion (${Object.keys(data).join(',')}) VALUES (?)`;
        const values = [Object.values(data)];
        await dbConsult(query, values);
        
    } catch (error) {
        throw new Error('Error al crear la configuración');
    }
}

// Actualizar una configuración existente
async function updateConfiguracion(data) {
    try {
        const query = 'UPDATE configuracion SET ? WHERE CONF_Idx = ?' ;
        const values = [data, data.CONF_Idx];
        await dbConsult(query, values);
    } catch (error) {
        throw new Error('Error al actualizar la configuración');
    }
}

// Eliminar una configuración por su índice
async function deleteConfiguracion(id) {
    try {
        const query = 'DELETE FROM configuracion WHERE CONF_Idx = ?';
        const values = [id];
        await dbConsult(query, values);
    } catch (error) {
        throw new Error('Error al eliminar la configuración');
    }
}

// Exportar las funciones para su uso en otros archivos
module.exports = {
    getAllConfiguraciones,
    getConfiguracionById,
    createConfiguracion,
    updateConfiguracion,
    deleteConfiguracion,
};