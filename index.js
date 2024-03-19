
const express = require('express');

require( 'dotenv' ).config();
var cors = require( 'cors' );

const { dbConnection } = require( './database/config' )

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use( cors() );

// Base de datos
dbConnection();

// pwd: nuOMkK5f24T55vrR
// user: mean_user
// Rutas
app.get( '/', ( req, res ) => {

    res.json({
        ok: true,
        msg: 'Hola mundo'
    })
});

app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT );
});