const { response } = require('express');
const bcrypt = require( 'bcryptjs' );

const Usuario = require( '../models/usuario' );
const { generateJWT } = require("../helpers/jwt");
const {googleVerify} = require("../helpers/google-verify");
const e = require("express");
const { getMenuFrontEnd } = require("../helpers/menu-frontend");

const login = async ( req, res = response ) => {

    // Verificar email
    const { email, password } = req.body;
    try {

        const usuarioDB = await Usuario.findOne({ email });

        if ( !usuarioDB ) {
            return res.status( 404 ).json({
                ok: false,
                msg: 'Email no valido'
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ) {
            return res.status( 400 ).json({
                ok: false,
                msg: 'Contraseña invalida'
            });
        }

        // Generar el Token - JWT
        const token = await generateJWT( usuarioDB.id );

        res.json({
            ok: true,
            token,
            email,
            menu: getMenuFrontEnd( usuarioDB.role )
        })

    } catch ( error ) {

        console.log(error);
        res.status( 500 ).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }
}

const googleSignIn = async ( req, res = response ) => {

    const { email, name, picture } = await googleVerify( req.body.token );

    const usuarioDB = await Usuario.findOne({ email });
    let usuario;

    if ( !usuarioDB ) {
        usuario = new Usuario({
           nombre: name,
           email: email,
           password: '@@@',
           img: picture,
           google: true
        });
    } else {
        usuario = usuarioDB;
        usuario.google = true;
    }

    // Guarda Usuario
    await usuario.save();

    // Generar el Token - JWT
    const token = await generateJWT( usuario.id );

    try {
        res.json({
            ok: true,
            token,
            email,
            menu: getMenuFrontEnd( usuario.role )
        });

    } catch ( error ) {
        res.status(400).json({
            ok: true,
            msg: 'Token de Google no es correcto'
        });
    }
}

const renewToken = async (req, res = response ) => {

    const uid = req.uid;

    // Generar el Token - JWT
    const token = await generateJWT( uid );

    // Obtener el usuario por UID
    const user = await Usuario.findById( uid );
    const email = user.email;

    res.json({
        ok: true,
        token,
        user,
        email,
        menu: getMenuFrontEnd( user.role )
    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}