/*
    Hospitales
    ruta: '/api/hospitales'
 */


const { Router } = require( 'express' );

const { check } = require( 'express-validator' );

const { validarCampos } = require( '../middlewares/validar-campos' );

const { validarJWT } = require("../middlewares/validar-jwt");

const {
        getMedicos,
        createMedico,
        updateMedico,
        deleteMedico, getMedicoById
} = require( '../controllers/medicos' )

const router = Router();

router.get( '/', getMedicos );

router.post( '/',
    [
        validarJWT,
        check( 'nombre', 'El nombre del médico es necesario' ).not().isEmpty(),
        check( 'hospital', 'El hospital id debe de ser valido' ).isMongoId(),
        validarCampos
    ],
    createMedico );

router.put( '/:id',
    [
        validarJWT,
        check( 'nombre', 'El nombre del médico es necesario' ).not().isEmpty(),
        check( 'hospital', 'El hospital id debe de ser valido' ).isMongoId(),
        validarCampos
    ],
    updateMedico
);

router.delete( '/:id',
    validarJWT,
    deleteMedico
);

router.get( '/:id',
    validarJWT,
    getMedicoById
);

module.exports = router;