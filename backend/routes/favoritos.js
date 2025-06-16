const express = require('express');
const router = express.Router();
const FavoritoService = require('../services/favorito.service');
const HechoDTO = require('../dto/hechos_historicos.dto');
const authenticateToken = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/favoritos:
 *   get:
 *     summary: Obtiene los hechos favoritos del usuario autenticado
 *     tags: [Favoritos]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de hechos favoritos obtenida con éxito
 *       401:
 *         description: Token inválido o no proporcionado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const favoritos = await FavoritoService.getFavoritosPorUsuario(userId);
        const hechosDTO = favoritos.map(h => new HechoDTO(h));
        res.json(hechosDTO);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/favoritos:
 *   post:
 *     summary: Agrega un hecho histórico a los favoritos del usuario autenticado
 *     tags: [Favoritos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_hecho:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Hecho agregado a favoritos
 *       400:
 *         description: Error de validación o hecho ya existente
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', authenticateToken, async (req, res) => {
    const id_usuario = req.user.id;
    const { id_hecho } = req.body;

    if (!id_hecho) {
        return res.status(400).json({ error: 'El id_hecho es obligatorio' });
    }

    try {
        const result = await FavoritoService.agregarFavorito(id_usuario, id_hecho);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/favoritos/{id_hecho}:
 *   delete:
 *     summary: Elimina un hecho histórico de los favoritos del usuario autenticado
 *     tags: [Favoritos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_hecho
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID del hecho histórico a quitar de favoritos
 *     responses:
 *       200:
 *         description: Favorito eliminado correctamente
 *       404:
 *         description: Favorito no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id_hecho', authenticateToken, async (req, res) => {
    const id_usuario = req.user.id;
    const id_hecho = parseInt(req.params.id_hecho);

    if (isNaN(id_hecho)) {
        return res.status(400).json({ error: 'ID de hecho inválido' });
    }

    try {
        const result = await FavoritoService.eliminarFavorito(id_usuario, id_hecho);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;