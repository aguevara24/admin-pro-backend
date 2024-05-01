const { response } = require('express');
const Medico = require("../models/medico");
const Hospital = require("../models/hospital");

const getMedicos = async ( req, res = response ) =>{

    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img');

    res.json({
        ok: true,
        medicos
    })
}

const getMedicoById = async ( req, res = response ) =>{

    const id = req.params.id;


    try{
        const medico = await Medico.findById( id )
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img');

        if ( medico ) {

            res.json({
                ok: true,
                medico
            })
        } else {

            res.json({
                ok: false,
                msg: 'Hable con el administrador'
            })
        }


    } catch (error ) {
        res.json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

const createMedico = async( req, res = response ) =>{

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    } );

    try {

        const medicoDb = await medico.save();

        res.json({
            ok: true,
            medico: medicoDb
        });

    } catch ( error ) {
        res.status( 500 ).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const updateMedico = async ( req, res = response ) =>{

    const id = req.params.id;
    const uid = req.uid;

    console.log( req.body );

    try {

        const medico = await Medico.findById( id );

        if( !medico ) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por id '
            })
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const updatedMedico = await Medico.findByIdAndUpdate( id, cambiosMedico, {new: true});

        medico.nombre = req.body.nombre;

        res.json({
            ok: true,
            medico: updatedMedico
        });

    } catch ( error ) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

const deleteMedico = async ( req, res = response ) =>{

    const id = req.params.id;

    try {

        const medico = await Medico.findById( id );

        if( !medico ) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por id '
            })
        }

        await Medico.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Medico eliminado'
        });

    } catch ( error ) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getMedicos,
    getMedicoById,
    createMedico,
    updateMedico,
    deleteMedico
}
