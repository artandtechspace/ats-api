const mongoose = require('mongoose')
const DB_URL = process.env.MONGO_URI
const loadModels = require('../app/models')

module.exports = () => {
    connect()
    mongoose.connection.on('disconnected', connect)
    loadModels()
}

function sleep(ms) {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}

async function connect(uri, callback) {
    if (process.env.NODE_ENV !== 'test') {
        // Prints initialization
        console.log('****************************')
        console.log('*    Starting Server')
        console.log(`*    Port: ${process.env.PORT || 3000}`)
        if (process.env.USE_SECURE === 'true') {
            console.log(`*    Secure Port: ${process.env.SECURE_PORT || 3443}`)
            console.log(`*    Secure LDAP: true`)
        }
        console.log(`*    NODE_ENV: ${process.env.NODE_ENV}`)
        console.log(`*    Database: MongoDB`)
    }
    try {
        await sleep(2000);
        await mongoose.connect(DB_URL, {
            keepAlive: true
        });
        console.log(`*    Conection: Success!`);
        console.log('****************************')
    } catch (err) {
        console.log(`*    Conection: Failed!`);
        console.log('****************************')
    }
}

