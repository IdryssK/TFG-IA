/*
Importación de módulos
*/

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
// Crear una aplicación de express
const app = express();

// Nos conectamos a la base de datos
//dbConnection();

app.use(cors()); 
app.use(bodyParser.json({ limit: '1000mb' })); // Soporte para cuerpos JSON
app.use(bodyParser.urlencoded({ limit: '1000mb', extended: true }));

app.use( express.json() );// Soporte para cuerpos codificados en JSON
// === Rutas

// Usuarios
app.use('/api/users', require('./routes/user'));

// Login
app.use('/api/login', require('./routes/auth'));


// Configuraciones
app.use('/api/configuraciones', require('./routes/configuracion'));

// Datasets
app.use('/api/datasets', require('./routes/dataset'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ', process.env.PORT);
});
