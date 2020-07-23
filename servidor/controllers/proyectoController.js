const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async(req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        //crear nuevo proyecto
        const proyecto = new Proyecto(req.body);

        //Guardar el creador via JWT
        proyecto.creador = req.usuario.id;

        //Guardamos el proyecto
        proyecto.save();
        res.status(200).json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(500).send('Se tubieron errores al intentar realizar la operación')
    }
}

//obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async(req, res) => {
    try { //el sort cabiara el orden
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });
        res.json({ proyectos });
    } catch (error) {
        console.log(error);
        res.status(500).send('Se encontro un error');

    }
}

//Actualiza un proyecto
exports.actualizarProyecto = async(req, res) => {
    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    //extraer la informacion del proyecto
    const { nombre } = req.body;

    const nuevoProyecto = {}; //para reescribit el anterior

    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        //revisar el id
        let proyecto = await Proyecto.findById(req.params.id);

        //revisar si existe o no
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        //verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        //actualizar
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true });

        res.json({ proyecto });

    } catch (error) {
        console.log(error);
        res.status(400).send('Error en el servidor');
    }

}

//proyecto eliminar por su id
exports.eliminarProyecto = async(req, res) => {

    try {
        let proyecto = await Proyecto.findById(req.params.id);

        //revisar si existe o no
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        //verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        //Eliminar el proyecto
        await Proyecto.findOneAndRemove({ _id: req.params.id });
        res.status(200).json({ msg: 'Proyecto eliminado' })

    } catch (error) {
        console.log(error);
        res.status(500).send('Error al intentar eliminar el registro');
    }
}