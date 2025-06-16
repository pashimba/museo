const db = require('../db');

class HechoService {
    // Obtener todos los hechos/obras
    static async getAllHechos() {
        try {
            const [rows] = await db.query('SELECT * FROM hechos_historicos');
            return rows;
        } catch (error) {
            throw new Error('Error al obtener las obras');
        }
    }

    // Obtener obra por ID
    static async getHechoById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM hechos_historicos WHERE id_hecho = ?', [id]);
            if (rows.length === 0) return null;
            return rows[0];
        } catch (error) {
            throw new Error('Error al obtener la obra');
        }
    }

    // Obtener obras por sección
    static async getHechosPorSeccion(id_seccion) {
        try {
            const [rows] = await db.query('SELECT * FROM hechos_historicos WHERE seccion_id = ?', [id_seccion]);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener obras por sección');
        }
    }

    // Obtener obras por etiqueta
    static async getHechosPorEtiqueta(id_etiqueta) {
        try {
            const [rows] = await db.query(`
                SELECT h.*
                FROM hechos_historicos h
                JOIN hecho_etiqueta he ON h.id_hecho = he.id_hecho
                WHERE he.id_etiqueta = ?
            `, [id_etiqueta]);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener obras por etiqueta');
        }
    }

    // Crear una nueva obra
    static async crearHecho(data) {
        try {
            const {
                titulo,
                descripcion,
                artista,
                imagen_url,
                periodo,
                categoria,
                modelo_3d_url,
                seccion_id
            } = data;

            await db.query(
                `INSERT INTO hechos_historicos 
                (titulo, descripcion, artista, imagen_url, periodo, categoria, modelo_3d_url, seccion_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [titulo, descripcion, artista, imagen_url, periodo, categoria, modelo_3d_url, seccion_id]
            );

            return { message: 'Obra registrada correctamente' };
        } catch (error) {
            throw new Error('Error al registrar la obra');
        }
    }

    // Eliminar obra
    static async eliminarHecho(id_hecho) {
        try {
            const [result] = await db.query('DELETE FROM hechos_historicos WHERE id_hecho = ?', [id_hecho]);
            if (result.affectedRows === 0) {
                throw new Error('Obra no encontrada');
            }
            return { message: 'Obra eliminada correctamente' };
        } catch (error) {
            throw new Error('Error al eliminar la obra');
        }
    }

    // (opcional) Obtener en orden por fecha si lo usas aún
    static async getHechosOrdenadosPorFecha() {
        try {
            const [rows] = await db.query('SELECT * FROM hechos_historicos ORDER BY id_hecho ASC');
            return rows;
        } catch (error) {
            throw new Error('Error al ordenar obras');
        }
    }
}

module.exports = HechoService;