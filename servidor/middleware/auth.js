const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    //leer el token de header
    const token = req.header('x-auth-token');

    //revisar si no hay token
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, permiso denegado' })
    }

    //validar el token
    try { //metodo para verificar el token
        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario;
        next(); //para que se vaya al siguiente middleware
    } catch (error) {
        res.status(401).json({ msg: 'Token no válido' })
    }
}