
const express = require('express');

require( 'dotenv' ).config();
var cors = require( 'cors' );

const { dbConnection } = require( './database/config' )

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use( cors() );

// Carpeta pública
app.use( express.static('public'));

// Lectura y parseo del body
app.use( express.json() );

// Base de datos
dbConnection();

// pwd: nuOMkK5f24T55vrR
// user: mean_user
// Rutas
app.use( '/api/usuarios', require( './routes/usuarios' ) );
app.use( '/api/hospitales', require( './routes/hospitales' ) );
app.use( '/api/medicos', require( './routes/medicos' ) );
app.use( '/api/todo', require( './routes/busquedas' ) );
app.use( '/api/login', require( './routes/auth' ) );
app.use( '/api/upload', require( './routes/uploads' ) );


app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT );
});