// services/seccion.service.js
const db = require('../db');

class SeccionService {
    static async getTodasLasSecciones() {
        try {
            const [rows] = await db.query('SELECT * FROM secciones');
            return rows;
        } catch (error) {
            throw new Error('Error al obtener las secciones');
        }
    }
}

module.exports = SeccionService;