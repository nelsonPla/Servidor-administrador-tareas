const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//crear proyectos
//api/proyectos
router.post('/',
    auth, //con esto mando a llamar al middleware que cree para revisar si el usuario esta autenticado
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);

//obtener todos los proyectos
router.get('/',
    auth, //con esto mando a llamar al middleware que cree para revisar si el usuario esta autenticado
    proyectoController.obtenerProyectos
)

//Actualizar proyecto via ID
router.put('/:id',
    auth, [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);

//Eliminar un proyecto
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);



module.exports = router;