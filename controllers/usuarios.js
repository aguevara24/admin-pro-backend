const { response } = require('express');
const bcrypt = require( 'bcryptjs' );

const Usuario = require('../models/usuario' );

const { generateJWT } = require("../helpers/jwt");

const getUsuarios = async ( req, res ) => {

    const desde = Number(req.query.desde) || 0;

    // const usuarios = await Usuario.find({}, 'nombre email role google')
    //     .skip( desde )
    //     .limit( 5 );

    const [ usuarios, total ] = await Promise.all([
        Usuario.find({}, 'nombre email role google img')
            .skip( desde )
            .limit( 5 ),
        Usuario.countDocuments()
    ])

    res.json({
        ok: true,
        usuarios,
        total
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
        const token = await generateJWT( usuario.id );

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

        if ( usuarioDb.google ) {
            campos.email = email;
        } else if ( usuarioDb.email !== email ){
            return res.status( 400 ).json({
                ok: false,
                msg: 'Usuarios de google no pueden cambiar su corre'
            });
        }

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