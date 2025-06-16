// ✅ auth.service.js
const db = require('../db');
const jwt = require('jsonwebtoken');
const User = require('../models/user.entity');

class AuthService {
    static async register(nombre, correo, contrasenia, rol = 2) {
        try {
            const [existing] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
            if (existing.length > 0) {
                throw new Error('El correo ya está registrado');
            }
            await db.query(
                'INSERT INTO usuarios(nombre, correo, contrasenia, fecha_creacion, id_rol) VALUES (?, ?, ?, NOW(), ?)',
                [nombre, correo, contrasenia, rol]
            );
            return { message: rol === 1 ? 'Administrador registrado correctamente' : 'Usuario registrado correctamente' };
        } catch (error) {
            throw new Error(error.message || 'Error al registrar el usuario');
        }
    }

    /*static async login(correo, contrasenia) {
        try {
            const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
            if (rows.length === 0) {
                throw new Error('Usuario no encontrado');
            }

            const user = new User(rows[0]);

            if (contrasenia !== user.contrasenia) {
                throw new Error('Contraseña incorrecta');
            }

            const token = jwt.sign(
                { id: user.id_usuario, correo: user.correo, rol: user.id_rol },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            return { token };
        } catch (error) {
            throw new Error(error.message);
        }
    }*/
   static async login(correo, contrasenia) {
    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (rows.length === 0) {
            throw new Error('Usuario no encontrado');
        }

        const user = new User(rows[0]);

        if (contrasenia !== user.contrasenia) {
            throw new Error('Contraseña incorrecta');
        }

        const token = jwt.sign(
            { id: user.id_usuario, correo: user.correo, rol: user.id_rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            token,
            user: {
                id_usuario: user.id_usuario,
                correo: user.correo,
                nombre: user.nombre,
                id_rol: user.id_rol,
            },
        };
    } catch (error) {
        throw new Error(error.message);
    }
}
}

module.exports = AuthService;