const { response } = require('express');
const bcrypt = require( 'bcryptjs' );

const Usuario = require('../models/usuario' );

const { generateJWT } = require("../helpers/jwt");

const getUsuarios = async ( req, res ) => {

    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: true,
        usuarios,
    });
}

const createUsuario = async( req, res ) => {

    const { email, password } = req.body;

    try {

        const emailExists = await Usuario.findOne({ email });

        if ( emailExists ) {
            return res.status( 400 ).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }
        const usuario = new Usuario( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt )

        // Guardar usuario
        await usuario.save();

        // Generar el Token - JWT
        const token = await generateJWT( usuarioDB.id );

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch ( error ) {
        console.log( error );
        res.status( 500 ).json( {
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}

const putUsuario = async  ( req, res = response ) => {

    const uid = req.params.id;

    // TODO: Validar token

    try {

        const usuarioDb = await Usuario.findById( uid );

        if ( !usuarioDb ) {
            return res.status( 404 ).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        // Actualizaciones
        const { password, google, email, ...campos } = req.body;

        if ( usuarioDb.email !== email ) {

            const emailExists = await Usuario.findOne({ email });
            if ( emailExists ) {
                return res.status( 400 ).json({
                    ok: false,
                    msg: 'El correo ya esta registrado'
                });
            }

        }
        // delete campos.password;
        // delete campos.google;

        campos.email = email;

        const usuarioUpdated = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            usuario: usuarioUpdated
        })

    } catch (error) {
        console.log( error );
        res.status( 500 ).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

const deleteUsuario = async ( req, res = response ) => {
    const uid = req.params.id;

    // TODO: Validar token

    try {

        const usuarioDb = await Usuario.findById( uid );

        if ( !usuarioDb ) {
            return res.status( 404 ).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        await Usuario.findByIdAndDelete( uid );

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        })


    } catch (error) {
        console.log( error );
        res.status( 500 ).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

module.exports = {
    getUsuarios,
    createUsuario,
    putUsuario,
    deleteUsuario
}