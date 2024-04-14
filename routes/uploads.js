/*
    Uploads
    ruta: '/api/upload/:busqueda'
 */

const {Router} = require("express");
const expressFileUpload = require('express-fileupload');
const {validarJWT} = require("../middlewares/validar-jwt");
const { fileUpload, getImage } = require('../controllers/uploads');

const router = Router();

// default options
router.use( expressFileUpload() );

router.put( '/:tipo/:id', validarJWT, fileUpload );

router.get( '/:tipo/:foto', getImage );

module.exports = router;