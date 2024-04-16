const { response } = require('express');

const Hospital = require( '../models/hospital' );

const getHospitales = async ( req, res = response ) =>{

    const hospitales = await Hospital.find()
        .populate('usuario', 'nombre img');

    res.json({
        ok: true,
        hospitales
    })
}

const createHospital = async( req, res = response ) =>{

    const uid = req.uid;
    const hospital = new Hospital({
      usuario: uid,
        ...req.body
    } );


    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        });

    } catch ( error ) {
        res.status( 500 ).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const updateHospital = async ( req, res = response ) =>{

    const id = req.params.id;
    const uid = req.uid;

    try {

        const hospital = await Hospital.findById( id );

        if( !hospital ) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id '
            })
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const updatedHospital = await Hospital.findByIdAndUpdate( id, cambiosHospital, {new: true});

        hospital.nombre = req.body.nombre;

        res.json({
            ok: true,
            hospital: updatedHospital
        });

    } catch ( error ) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

const deleteHospital = async ( req, res = response ) =>{

    const id = req.params.id;

    try {

        const hospital = await Hospital.findById( id );

        if( !hospital ) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id '
            })
        }

        await Hospital.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Hospital eliminado'
        });

    } catch ( error ) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getHospitales,
    createHospital,
    updateHospital,
    deleteHospital
}
