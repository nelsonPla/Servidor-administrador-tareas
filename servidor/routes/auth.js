//Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

//Iniciar session
//api/auth
router.post('/',
    /*[
           check('email', 'Agrega un email valido').isEmail(),
           check('password', 'El password debe ser minimo 6 caracteres').isLength({ min: 6 })
       ],*/
    authController.autenticarUsuario
);
//obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
);
module.exports = router;