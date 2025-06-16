const express = require('express');
const router = express.Router();
const SeccionService = require('../services/seccion.service');

/**
 * @swagger
 * tags:
 *   - name: Secciones
 *     description: Endpoints para obtener las secciones del museo
 */

/**
 * @swagger
 * /api/secciones:
 *   get:
 *     summary: Obtiene todas las secciones del museo
 *     tags: [Secciones]
 *     responses:
 *       200:
 *         description: Lista de secciones
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', async (req, res) => {
    try {
        const secciones = await SeccionService.getTodasLasSecciones();
        res.json(secciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;