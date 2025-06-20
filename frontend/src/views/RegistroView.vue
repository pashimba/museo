<template>
  <div class="registro-wrap">
    <div class="registro-html">
      <div class="registro-form">
        <div class="sign-up-htm">
          <h2 class="form-title">Registro Museo Virtual</h2>

          <div v-if="authError" class="error-message">
            {{ authError }}
          </div>
          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>

          <div class="group">
            <label for="displayName" class="label">Nombre completo</label>
            <input
              id="displayName"
              type="text"
              class="input"
              v-model="displayName"
              required
            />
          </div>

          <div class="group">
            <label for="email" class="label">Correo electrónico</label>
            <input
              id="email"
              type="email"
              class="input"
              v-model="email"
              required
            />
          </div>

          <div class="group">
            <label for="password" class="label"
              >Contraseña (mínimo 6 caracteres)</label
            >
            <input
              id="password"
              type="password"
              class="input"
              v-model="password"
              required
            />
          </div>

          <div class="group">
            <label for="confirmPassword" class="label"
              >Repetir Contraseña</label
            >
            <input
              id="confirmPassword"
              type="password"
              class="input"
              v-model="confirmPassword"
              required
            />
          </div>

          <div class="group">
            <button
              @click="handleRegister"
              :disabled="isLoading"
              class="button"
            >
              <span v-if="!isLoading">Registrarse</span>
              <span v-else> <i class="spinner"></i> Registrando... </span>
            </button>
          </div>

          <div class="foot-lnk">
            <router-link to="/login">¿Ya tienes cuenta?</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "RegistroView",
  data() {
    return {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
      successMessage: null,
    };
  },
  computed: {
    ...mapGetters(["isLoading", "authError"]),
  },
  methods: {
    ...mapActions(["register"]),
    async handleRegister() {
      this.successMessage = null; // Limpiar mensaje de éxito previo

      // Validaciones básicas
      if (
        !this.displayName ||
        !this.email ||
        !this.password ||
        !this.confirmPassword
      ) {
        this.$store.commit(
          "SET_ERROR",
          "Por favor, completa todos los campos."
        );
        return;
      }
      if (this.password.length < 6) {
        this.$store.commit(
          "SET_ERROR",
          "La contraseña debe tener al menos 6 caracteres."
        );
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.$store.commit("SET_ERROR", "Las contraseñas no coinciden.");
        return;
      }

      const success = await this.register({
        displayName: this.displayName,
        email: this.email,
        password: this.password,
      });

if (success) {
  this.successMessage = "¡Registro exitoso!";
  this.$router.push("/login"); // ✅ corregido aquí
}
    },
  },
  created() {
    // Limpiar errores previos al cargar la vista
    this.$store.commit("SET_ERROR", null);
  },
};
</script>

<style scoped>
/* Estilos generales del contenedor de registro */
.registro-wrap {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("@/assets/images/registro_bg.jpg"); /* Fondo de imagen */
  background-size: cover;
  background-position: center;
  position: relative;
  padding: 20px;
  box-sizing: border-box;
}

.registro-wrap::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4); /* Overlay oscuro */
  z-index: 0;
}

.registro-html {
  width: 100%;
  max-width: 450px; /* Ancho máximo para el formulario */
  height: auto; /* Altura auto para que se ajuste al contenido */
  min-height: 500px;
  position: relative;
  box-shadow: 0 12px 15px 0 rgba(0, 0, 0, 0.24),
    0 17px 50px 0 rgba(251, 252, 246, 0.19);
  background-color: #e9bd84; /* Color de la caja de registro */
  border-radius: 10px;
  padding: 40px;
  box-sizing: border-box;
  z-index: 1; /* Asegura que el formulario esté sobre el overlay */
}

.form-title {
  text-align: center;
  color: #4e342e;
  margin-bottom: 30px;
  font-size: 2rem;
}

.registro-form .group {
  margin: 20px 0;
}

.registro-form .group .label,
.registro-form .group .input,
.registro-form .group .button {
  width: 100%;
  display: block;
}

.registro-form .group .label {
  color: #110303;
  font-size: 0.95rem;
  margin-bottom: 8px;
  font-weight: bold;
}

.registro-form .group .input {
  border: 1px solid #bfae9e;
  padding: 12px 15px;
  border-radius: 5px;
  background: rgba(253, 225, 163, 0.1);
  color: #201d0b;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.registro-form .group .input:focus {
  border-color: #8c5e3c;
  outline: none;
  box-shadow: 0 0 0 3px rgba(140, 94, 60, 0.2);
}

.registro-form .group .button {
  background: #4e342e;
  color: white;
  padding: 15px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  transition: background 0.3s;
  margin-top: 15px;
}

.registro-form .group .button:hover {
  background: #6d4c41;
}

.registro-form .group .button:disabled {
  background: #a1887f;
  cursor: not-allowed;
}

.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 10px 15px;
  border-radius: 5px;
  margin: 15px 0;
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid #ef9a9a;
}

.success-message {
  color: #2e7d32;
  background-color: #e8f5e9;
  padding: 10px 15px;
  border-radius: 5px;
  margin: 15px 0;
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid #81c784;
}

.foot-lnk {
  text-align: center;
  margin-top: 20px;
}

.foot-lnk a {
  color: #4e342e;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.foot-lnk a:hover {
  color: #8c5e3c;
  text-decoration: underline;
}

/* Spinner dentro del botón */
.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #fff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .registro-html {
    padding: 30px 20px;
    max-width: 350px;
  }
  .form-title {
    font-size: 1.8rem;
  }
  .registro-form .group .input,
  .registro-form .group .button {
    padding: 10px 12px;
    font-size: 1rem;
  }
}
</style>
