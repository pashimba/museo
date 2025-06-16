// services/favorito.service.js
const db = require('../db');
const HechosHistoricos = require('../models/hechos.entity');

class FavoritoService {
    static async getFavoritosPorUsuario(id_usuario) {
        try {
            const [rows] = await db.query(
                `SELECT h.*
                 FROM favoritos f
                 JOIN hechos_historicos h ON f.id_hecho = h.id_hecho
                 WHERE f.id_usuario = ?`,
                [id_usuario]
            );
            return rows;
        } catch (error) {
            throw new Error('Error al obtener favoritos');
        }
    }

    static async agregarFavorito(id_usuario, id_hecho) {
    try {
        await db.query(
            'INSERT INTO favoritos (id_usuario, id_hecho) VALUES (?, ?)',
            [id_usuario, id_hecho]
        );
        return { message: 'Hecho agregado a favoritos' };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Este hecho ya está en favoritos');
        }
        throw new Error('Error al agregar a favoritos');
    }
}

static async eliminarFavorito(id_usuario, id_hecho) {
    try {
        const [result] = await db.query(
            'DELETE FROM favoritos WHERE id_usuario = ? AND id_hecho = ?',
            [id_usuario, id_hecho]
        );

        if (result.affectedRows === 0) {
            throw new Error('El favorito no existe');
        }

        return { message: 'Favorito eliminado correctamente' };
    } catch (error) {
        throw new Error('Error al eliminar el favorito');
    }
}
}

module.exports = FavoritoService;