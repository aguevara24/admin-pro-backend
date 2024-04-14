const path = require( 'path' );

const fs = require( 'fs' );

const { response } = require( 'express' );

const { v4: uuidv4 } = require( 'uuid' );
const { updateImage} = require('../helpers/update-image');


const fileUpload = async ( req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios' ];

    if ( !tiposValidos.includes(tipo) ) {
        return res.json({
            ok: false,
            msg: 'No es un médico, usuario u hospital (tipo) '
        });
    }

    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ninguna archivo'
        });
    }

    // Procesar la imagen ...
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[ nombreCortado.length - 1 ];

    // validar extension
    const extensionesValidas = [ 'png', 'jpg', 'jpeg', 'gif' ];
    if ( !extensionesValidas.includes( extensionArchivo ) ) {
        return res.json({
            ok: false,
            msg: 'No es una extension permitida '
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    // Path para guardar archivo
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    // Mover la imagen
    file.mv( path, (err) => {
        if (err){
            console.log(err)
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        // Actualizar Base de datos
        updateImage( tipo, id, nombreArchivo );


        res.json( {
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        })
    });
}

const getImage = async ( req, res = response ) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }`);

    // imagen por defecto

    if ( fs.existsSync( pathImg )) {
        res.sendFile( pathImg )
    }
    else {
        const pathImg = path.join( __dirname, `../uploads/no-img.jpg`);
        res.sendFile( pathImg );
    }

}

module.exports = {
    fileUpload,
    getImage
}