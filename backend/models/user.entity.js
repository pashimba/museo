// models/user.entity.js
class User {
    constructor({ id_usuario, nombre, correo, contrasenia, id_rol }) {
        this.id_usuario = id_usuario;
        this.nombre = nombre;
        this.correo = correo;
        this.contrasenia = contrasenia;
        this.id_rol = id_rol;
    }
}
module.exports = User;