const express = require('express');
const router = express.Router();
const EtiquetaService = require('../services/etiqueta.service');

/**
 * @swagger
 * tags:
 *   - name: Etiquetas
 *     description: Endpoints para obtener etiquetas del museo
 */

/**
 * @swagger
 * /api/etiquetas:
 *   get:
 *     summary: Obtiene todas las etiquetas disponibles
 *     tags: [Etiquetas]
 *     responses:
 *       200:
 *         description: Lista de etiquetas
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', async (req, res) => {
    try {
        const etiquetas = await EtiquetaService.getTodasLasEtiquetas();
        res.json(etiquetas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;