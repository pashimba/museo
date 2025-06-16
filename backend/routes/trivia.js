const express = require('express');
const router = express.Router();

/**
 * Preguntas fijas basadas en hechos históricos
 * (puedes adaptar y agregar más)
 */
const preguntas = [
  {
    id: 1,
    pregunta: '¿Qué evento marcó el inicio del uso del fuego por los humanos?',
    opciones: ['Descubrimiento de América', 'Descubrimiento del fuego', 'Caída del Imperio Romano'],
    respuesta: 'Descubrimiento del fuego'
  },
  {
    id: 2,
    pregunta: '¿Cuál fue el evento que marcó el fin del Imperio Romano de Occidente?',
    opciones: ['Invención de la escritura', 'Caída del Imperio Romano de Occidente', 'Revolución Francesa'],
    respuesta: 'Caída del Imperio Romano de Occidente'
  },
  {
    id: 3,
    pregunta: '¿Qué civilización desarrolló la escritura cuneiforme?',
    opciones: ['Egipcios', 'Sumerios', 'Mayas'],
    respuesta: 'Sumerios'
  },
  {
    id: 4,
    pregunta: '¿Qué estructuras fueron construidas en la antigua civilización egipcia?',
    opciones: ['Pirámides', 'Catedrales', 'Castillos'],
    respuesta: 'Pirámides'
  },
  {
    id: 5,
    pregunta: '¿Quién llegó al continente americano en 1492?',
    opciones: ['Neil Armstrong', 'Cristóbal Colón', 'Simón Bolívar'],
    respuesta: 'Cristóbal Colón'
  },
  {
    id: 6,
    pregunta: '¿Qué evento marcó el inicio de la Edad Contemporánea en Francia?',
    opciones: ['Revolución Francesa', 'Caída del Imperio Romano', 'Independencia de EEUU'],
    respuesta: 'Revolución Francesa'
  },
  {
    id: 7,
    pregunta: '¿Quién fue el primer hombre en pisar la Luna?',
    opciones: ['Yuri Gagarin', 'Neil Armstrong', 'Buzz Aldrin'],
    respuesta: 'Neil Armstrong'
  }
];

/**
 * @swagger
 * /api/trivia:
 *   get:
 *     summary: Devuelve una lista de preguntas de trivia
 *     tags: [Trivia]
 *     responses:
 *       200:
 *         description: Lista de preguntas
 */
router.get('/', (req, res) => {
  const preguntasSinRespuesta = preguntas.map(p => ({
    id: p.id,
    pregunta: p.pregunta,
    opciones: p.opciones
  }));
  res.json(preguntasSinRespuesta);
});

/**
 * @swagger
 * /api/trivia:
 *   post:
 *     summary: Valida la respuesta de una trivia
 *     tags: [Trivia]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               respuesta:
 *                 type: string
 *                 example: "Descubrimiento del fuego"
 *     responses:
 *       200:
 *         description: Respuesta validada
 */
router.post('/', (req, res) => {
  const { id, respuesta } = req.body;
  const pregunta = preguntas.find(p => p.id === id);
  if (!pregunta) return res.status(404).json({ error: 'Pregunta no encontrada' });

  const correcta = pregunta.respuesta === respuesta;
  res.json({ correcta, correctaRespuesta: pregunta.respuesta });
});

module.exports = router;