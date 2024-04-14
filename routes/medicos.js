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
        deleteMedico
} = require( '../controllers/medicos' )
const {updateHospital, deleteHospital} = require("../controllers/hospitales");

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

    ],
    updateMedico
);

router.delete( '/:id',
    validarJWT,
    deleteMedico
);

module.exports = router;