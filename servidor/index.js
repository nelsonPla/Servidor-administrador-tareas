const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//crear el servidor
const app = express();

//conectar a la base de datos
conectarDB();

//habilitar cors para poder consultar desde una url deiferente
app.use(cors());

//habilitar express.json
app.use(express.json({ extended: true }));

//asignando el puerto
const PORT = process.env.PORT || 4000;

//importar rutas 
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tarea'));


//arrancar la app
app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto ${PORT}`);
})