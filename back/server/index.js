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
app.use( express.json() );// Soporte para cuerpos codificados en JSON
app.use(bodyParser.json({ limit: '50mb' })); // Soporte para cuerpos JSON
// === Rutas

// Usuarios
app.use('/api/users', require('./routes/user'));

// Login
app.use('/api/login', require('./routes/auth'));

// Datasets
app.use('/api/datasets', require('./routes/dataset'));

// Configuraciones
app.use('/api/configuraciones', require('./routes/configuracion'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ', process.env.PORT);
});


app.get('/', (req, res) => {
    res.json({
        msg: 'API activa'
    });
});