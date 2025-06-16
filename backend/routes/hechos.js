const express = require('express');
const router = express.Router();
const HechosService = require('../services/hecho.service');
const HechoDTO = require('../dto/hechos_historicos.dto');
const authenticateToken = require('../middlewares/auth.middleware');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * tags:
 *   - name: Hechos
 *     description: Endpoints para gestionar obras históricas
 */

/**
 * @swagger
 * /api/hechos:
 *   get:
 *     summary: Obtiene la lista de obras históricas (público)
 *     tags: [Hechos]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de obras obtenida con éxito
 *       401:
 *         description: Acceso no autorizado
 */
router.get('/', async (req, res) => {
  try {
    const hechos = await HechosService.getAllHechos();
    const hechosDTOs = hechos.map(hecho => new HechoDTO(hecho));
    res.json(hechosDTOs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/hechos/seccion/{id_seccion}:
 *   get:
 *     summary: Obtiene las obras por sección
 *     tags: [Hechos]
 *     parameters:
 *       - in: path
 *         name: id_seccion
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de obras por sección
 *       404:
 *         description: No se encontraron obras
 */
router.get('/seccion/:id_seccion', async (req, res) => {
  try {
    const id_seccion = parseInt(req.params.id_seccion);
    const hechos = await HechosService.getHechosPorSeccion(id_seccion);
    if (hechos.length === 0) {
      return res.status(404).json({ error: 'No se encontraron obras para esta sección' });
    }
    const hechosDTO = hechos.map(h => new HechoDTO(h));
    res.json(hechosDTO);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/hechos/etiqueta/{id_etiqueta}:
 *   get:
 *     summary: Obtiene las obras asociadas a una etiqueta
 *     tags: [Hechos]
 *     parameters:
 *       - in: path
 *         name: id_etiqueta
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de obras con esa etiqueta
 *       404:
 *         description: No se encontraron obras
 */
router.get('/etiqueta/:id_etiqueta', async (req, res) => {
  try {
    const id = parseInt(req.params.id_etiqueta);
    const hechos = await HechosService.getHechosPorEtiqueta(id);
    if (hechos.length === 0) {
      return res.status(404).json({ error: 'No se encontraron obras con esa etiqueta' });
    }
    const hechosDTO = hechos.map(h => new HechoDTO(h));
    res.json(hechosDTO);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/hechos:
 *   post:
 *     summary: Crea una nueva obra histórica (solo admin)
 *     tags: [Hechos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               artista:
 *                 type: string
 *               imagen_url:
 *                 type: string
 *               periodo:
 *                 type: string
 *               categoria:
 *                 type: string
 *               modelo_3d_url:
 *                 type: string
 *               id_seccion:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Obra creada exitosamente
 *       403:
 *         description: No autorizado
 *       500:
 *         description: Error interno
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const usuario = req.user;
    if (usuario.rol !== 1) {
      return res.status(403).json({ error: 'Acceso denegado: solo administradores pueden agregar obras' });
    }

    const {
      titulo,
      descripcion,
      artista,
      imagen_url,
      periodo,
      categoria,
      modelo_3d_url,
      id_seccion
    } = req.body;

    const result = await HechosService.crearHecho({
      titulo,
      descripcion,
      artista,
      imagen_url,
      periodo,
      categoria,
      modelo_3d_url,
      id_seccion
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/hechos/{id}:
 *   delete:
 *     summary: Elimina una obra histórica (solo admin)
 *     tags: [Hechos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Obra eliminada correctamente
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Obra no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const usuario = req.user;
    if (usuario.rol !== 1) {
      return res.status(403).json({ error: 'Acceso denegado: solo administradores pueden eliminar obras' });
    }

    const id_hecho = parseInt(req.params.id);
    const result = await HechosService.eliminarHecho(id_hecho);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/hechos/{id}:
 *   get:
 *     summary: Obtiene una obra histórica por ID
 *     tags: [Hechos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Obra encontrada
 *       404:
 *         description: No encontrada
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const hecho = await HechosService.getHechoById(req.params.id);
    if (!hecho) return res.status(404).json({ error: 'Obra no encontrada' });

    const hechoDTO = new HechoDTO(hecho);
    res.json(hechoDTO);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;