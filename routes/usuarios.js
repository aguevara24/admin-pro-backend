/*
    Ruta: /api/usuarios
 */

const { Router } = require( 'express' );

const { check } = require( 'express-validator' );

const { validarCampos } = require( '../middlewares/validar-campos' );

const { getUsuarios, createUsuario, putUsuario, deleteUsuario } = require( '../controllers/usuarios' );
const { validarJWT, validarAdminRole, validarAdminRoleOrSameUser} = require("../middlewares/validar-jwt");

const router = Router();

router.get( '/', [ validarJWT, validarAdminRole ], getUsuarios );

router.post( '/',
    [
        check( 'nombre', 'El nombre es obligatorio' ).not().isEmpty(),
        check( 'password', 'La contraseña es obligatoria' ).not().isEmpty(),
        check( 'email', 'El email es obligatorio' ).isEmail(),
        validarCampos
    ],

    createUsuario );

router.put( '/:id',
    [
        validarJWT,
        validarAdminRoleOrSameUser,
        check( 'nombre', 'El nombre es obligatorio' ).not().isEmpty(),
        check( 'email', 'El email es obligatorio' ).isEmail(),
        check( 'role', 'El role es obligatorio').not().isEmpty(),
        validarCampos
    ],
    putUsuario
);

router.delete( '/:id',
    [ validarJWT, validarAdminRole ],
    deleteUsuario
);

module.exports = router;