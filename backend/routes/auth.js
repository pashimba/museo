const express = require('express');
const router = express.Router();
const AuthService = require('../services/auth.service');
const { body, validationResult } = require('express-validator');
const authenticateToken = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   - name: Autenticación
 *     description: Endpoints para autenticación de usuarios
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario (rol normal, público)
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Lucia Gómez
 *               correo:
 *                 type: string
 *                 example: lucia.gomez@example.com
 *               contrasenia:
 *                 type: string
 *                 example: "Password.123"
 *     responses:
 *       200:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Error en los datos de entrada o correo duplicado
 *       500:
 *         description: Error en el servidor
 */
router.post('/register', [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('correo').isEmail().withMessage('Debe ser un correo válido'),
    body('contrasenia').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nombre, correo, contrasenia } = req.body;
    try {
        const result = await AuthService.register(nombre, correo, contrasenia); // rol 2 por defecto
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión y obtiene un token JWT
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *                 example: lucia.gomez@example.com
 *               contrasenia:
 *                 type: string
 *                 example: "Password.123"
 *     responses:
 *       200:
 *         description: Devuelve el token JWT
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error en el servidor
 */

router.post('/login', async (req, res) => {
    console.log(req.body); 
    const { correo, contrasenia } = req.body;
    try {
        const result = await AuthService.login(correo, contrasenia);
        res.json(result);
    } catch (error) {
        /*res.status(401).json({ error: error.message });*/
        res.status(401).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/auth/register-admin:
 *   post:
 *     summary: Registra un nuevo usuario con rol administrador (requiere token de admin)
 *     tags: [Autenticación]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Ana Pérez
 *               correo:
 *                 type: string
 *                 example: ana.perez@example.com
 *               contrasenia:
 *                 type: string
 *                 example: "Password.456"
 *     responses:
 *       200:
 *         description: Administrador registrado correctamente
 *       400:
 *         description: Datos inválidos o correo duplicado
 *       403:
 *         description: No autorizado (requiere rol admin)
 *       500:
 *         description: Error interno
 */
router.post('/register-admin',
    authenticateToken,
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('correo').isEmail().withMessage('Correo no válido'),
    body('contrasenia').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        if (req.user.rol !== 1) {
            return res.status(403).json({ error: 'Solo los administradores pueden crear nuevos admins' });
        }

        const { nombre, correo, contrasenia } = req.body;
        try {
            const result = await AuthService.register(nombre, correo, contrasenia, 1); // rol 1 explícito
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

module.exports = router;