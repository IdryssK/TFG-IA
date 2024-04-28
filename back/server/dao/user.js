// Llamadas a la tabla de usuarios de la base de datos

const { dbConsult } = require("../database/db");

const userByUser_Email = async(User_Email) => {
    try {
        const query = `SELECT User_Idx, User_Email, User_Rol FROM ${process.env.USERTABLE} WHERE User_Email= ?`;

        const paramsQuery = [User_Email];
        const [user] = await dbConsult(query, paramsQuery);

        return user.length === 0 ? null : user[0];
    } catch (error) {
        throw error;
    }
}

const userList = async(data) => {
    console.log(data);
    try {
        let paramsQuery = [];
        let query = `SELECT User_Idx, User_Email, User_Rol FROM usuario`;

        if(data.querySearch){
            query += ` WHERE User_Email LIKE ?`;
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


const userById = async(id) => {
    try {
        const query = `SELECT User_Idx, User_Email, User_Rol FROM usuario WHERE User_Idx = ?`;

        const paramsQuery = [id];
        const [user] = await dbConsult(query, paramsQuery);

        return user.length === 0 ? null : user[0];
    } catch (error) {
        throw error;
    }
}

const userCreate = async(data) => {
    try {

        const query = `INSERT INTO ${process.env.USERTABLE} (${Object.keys(data).join(',')}) VALUES (?)`;
        const paramsQuery = [Object.values(data)]
        await dbConsult(query, paramsQuery);

    } catch (error) {
        throw error;
    }
}

const userUpdate = async(data) =>  {
    try {

        const query = `UPDATE usuario SET ? WHERE User_Idx = ?`;
        const paramsQuery = [data, data.User_Idx]
        await dbConsult(query, paramsQuery);

    } catch (error) {
        throw error;
    }
}

const userDelete = async(id) => {
    try {
        
        const query = `DELETE FROM ${process.env.USERTABLE} WHERE User_Idx= ?`;
        const paramsQuery = [id];
        await dbConsult(query, paramsQuery);

    } catch (error) {
        throw error;
    }
}

// Funcion que devuelve la contraseña hasheada para hacer comprobaciones (login, cambiar contraseña...)
const getHash = async(id) => {
    try {
        
        const query = `SELECT User_Password FROM usuario WHERE User_Idx = ? LIMIT 1`;
        const paramsQuery = [id];
        const [pass] = await dbConsult(query, paramsQuery);

        return pass.length === 0 ? null : pass[0];
    } catch (error) {
        throw error;
    }
}

module.exports = {userByUser_Email, userList, userById, userCreate, userUpdate, userDelete, getHash}