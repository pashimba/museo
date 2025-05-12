<template>
  <div class="registro-wrap">
    <div class="registro-html">
      <div class="registro-form">
        <div class="sign-up-htm">
          <div class="group">
            <label for="user" class="label">Nombre de usuario</label>
            <input id="user" type="text" class="input">
          </div>
          <div class="group">
            <label for="pass" class="label">Contraseña</label>
            <input id="pass" type="password" class="input" data-type="password">
          </div>
          <div class="group">
            <label for="pass-repeat" class="label">Repetir contraseña</label>
            <input id="pass-repeat" type="password" class="input" data-type="password">
          </div>
          <div class="group">
            <label for="email" class="label">Correo electrónico</label>
            <input id="email" type="email" class="input">
          </div>
          <div class="group">
            <button class="button">Registrarse</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegistroMuseoVirtual',
  methods: {
    handleRegistration() {
      // Aquí puedes agregar la lógica de registro
      // utilizando los datos del formulario
    }
  }
}
</script>

<style>
.registro-wrap {
  width: auto;
  margin: auto;
  margin-top: 50px;
  max-width: 525px;
  min-height: 520px;
  position: relative;
  box-shadow: 0 12px 15px 0 rgba(0, 0, 0, 0.24), 0 17px 50px 0 rgba(251, 252, 246, 0.19);
  background-color: #e9bd84;
  border-radius: 10px;
  padding: 40px;
}

.registro-form .group {
  margin: 20px 0;
}

.registro-form .group .label,
.registro-form .group .input,
.registro-form .group .button {
  width: 100%;
  color: #201d0b;
  display: block;
}

.registro-form .group .input,
.registro-form .group .button {
  border: none;
  padding: 15px 20px;
  border-radius: 25px;
  background: rgba(253, 225, 163, 0.1);
}

.registro-form .group .label {
  color: #110303;
  font-size: 12px;
}

.registro-form .group .button {
  background-color: #e7d1b0;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}
</style>