const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const conectarDB = async() => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('Database conectada');
    } catch (error) {
        console.log(error);
        process.exit(1); //detiene la app si hay error en la coneccion
    }
}

module.exports = conectarDB;