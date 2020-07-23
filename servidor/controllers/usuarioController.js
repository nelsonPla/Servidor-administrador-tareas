const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async(req, res) => {

    //revisar si hay errores debe de ser aqui antes del destructuring
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    //extraer email y password
    const { email, password } = req.body;

    try {
        //revisar qe usuario registrado sea unico
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        //crea nuevo usuario
        usuario = new Usuario(req.body);

        //hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        //guardar usurio
        await usuario.save();

        //crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 //expirara en una hora
        }, (error, token) => { //revisa si hay un error en el token
            if (error) throw error;

            //mensaje de confirmación
            res.json({ token });
        });

    } catch (error) {
        console.log(error);
        res.status(400).send('Se encontro un error');
    }
}