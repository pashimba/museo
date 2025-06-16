const mysql = require('mysql2'); // variable mysql
require('dotenv').config();  // invocando a .env 

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0    
}); // definir la conexion

module.exports = pool.promise(); //exportacion de la variable