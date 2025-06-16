// services/etiqueta.service.js
const db = require('../db');

class EtiquetaService {
    static async getTodasLasEtiquetas() {
        try {
            const [rows] = await db.query('SELECT * FROM etiquetas');
            return rows;
        } catch (error) {
            throw new Error('Error al obtener las etiquetas');
        }
    }
}

module.exports = EtiquetaService;