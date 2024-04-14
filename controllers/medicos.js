const { response } = require('express');
const Medico = require("../models/medico");

const getMedicos = async ( req, res = response ) =>{

    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img');

    res.json({
        ok: true,
        medicos
    })
}

const createMedico = async( req, res = response ) =>{

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        hospital: '661191beb03fcb1ae5a2a3ce',
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

const updateMedico = ( req, res = response ) =>{

    res.json({
        ok: true,
        msg: 'updateMedico'
    })
}

const deleteMedico = ( req, res = response ) =>{

    res.json({
        ok: true,
        msg: 'deleteMedico'
    })
}

module.exports = {
    getMedicos,
    createMedico,
    updateMedico,
    deleteMedico
}
