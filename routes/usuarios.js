/*
    Ruta: /api/usuarios
 */

const { Router } = require( 'express' );

const { check } = require( 'express-validator' );

const { validarCampos } = require( '../middlewares/validar-campos' );

const { getUsuarios, createUsuario, putUsuario, deleteUsuario } = require( '../controllers/usuarios' );
const {validarJWT} = require("../middlewares/validar-jwt");

const router = Router();

router.get( '/', validarJWT, getUsuarios );

router.post( '/',
    [
        validarJWT,
        check( 'nombre', 'El nombre es obligatorio' ).not().isEmpty(),
        check( 'password', 'La contraseña es obligatoria' ).not().isEmpty(),
        check( 'email', 'El email es obligatorio' ).isEmail(),
        validarCampos
    ],

    createUsuario );

router.put( '/:id',
    [
        validarJWT,
        check( 'nombre', 'El nombre es obligatorio' ).not().isEmpty(),
        check( 'email', 'El email es obligatorio' ).isEmail(),
        check( 'role', 'El role es obligatorio').not().isEmpty(),
        validarCampos
    ],
    putUsuario
);

router.delete( '/:id',
    validarJWT,
    deleteUsuario
);

module.exports = router;