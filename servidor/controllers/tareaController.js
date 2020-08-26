//requiero de los dos ya que las tareas estan ligadas a los proyectos
const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

//crea una nueva tarea
exports.crearTarea = async(req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }


    try {

        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.body;


        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        //verificar el creador del proyecto, revisa con la session de usuario si es la misma
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        //creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });


    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un  error');
    }

}

// obtiene las tareas por proyecto
exports.obtenerTareas = async(req, res) => {

    try {
        //extrer proyecto
        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;

        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        //verificar el creador del proyecto, revisa con la session de usuario si es la misma
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        //obtener las tareas por proyecto, aqui hace como si es un where
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 }); //este lo agarramos de el destructuring de proyecto
        res.status(200).json({ tareas }) //el sort para ordernar


    } catch (error) {
        console.log(error)
        res.status(500).send('Se encotro un error al querer cargar los proyectos');
    }
}

//actualiza una tarea.

exports.actualizarTareas = async(req, res) => {
    try {
        //extrer proyecto
        //Extraer el proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body;

        //revisar si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if (!tarea) {
            return res.status(404).json({ msg: 'Tarea no existe' })
        }

        const existeProyecto = await Proyecto.findById(proyecto);
        /*if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }*/

        // Revisar si el proyecto actual pertenece al usuario autenticado
        //verificar el creador del proyecto, revisa con la session de usuario si es la misma
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }



        //crear un objeto con la nueva información
        const nuevaTarea = {}

        //si viene el nombre
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //guardar la tarea
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });

        res.status(200).json({ tarea });


    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');
    }
}

//eliminar tareas
exports.eliminarTareas = async(req, res) => {
    try {
        //extrer proyecto
        //Extraer el proyecto y comprobar si existe
        //tiene quien lo creo
        const { proyecto } = req.query; //es query por que estoy pasando params

        //revisar si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if (!tarea) {
            return res.status(404).json({ msg: 'Tarea no existe' })
        }

        const existeProyecto = await Proyecto.findById(proyecto);
        /*if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }*/

        // Revisar si el proyecto actual pertenece al usuario autenticado
        //verificar el creador del proyecto, revisa con la session de usuario si es la misma
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // ELiminar
        await Tarea.findOneAndRemove({ _id: req.params.id });

        res.status(200).json({ msg: 'Tarea eliminada' });


    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');
    }
}