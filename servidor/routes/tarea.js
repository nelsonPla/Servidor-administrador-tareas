const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//crear una tarea
//api/tareas
router.post('/',
    auth, [
        check('nombre', 'El nombre de la tarea es requerido').not().isEmpty(),
        check('proyecto', 'El Proyecto es requerido').not().isEmpty()
    ],
    tareaController.crearTarea
);

//obtener las tareas del proyecto
router.get('/',
    auth,
    tareaController.obtenerTareas
);

//actualizar tareas
router.put('/:id',
    auth,
    tareaController.actualizarTareas
);

//eliminar una tarea
router.delete('/:id',
    auth,
    tareaController.eliminarTareas
);

module.exports = router;