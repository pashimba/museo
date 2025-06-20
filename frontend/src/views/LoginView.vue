<template>
  <div class="login-container">
    <div class="logo-museo"></div>
    <h1>MUSEO VIRTUAL</h1>

    <div class="login-box">
      <div class="login-form">
        <h2 class="form-title">Iniciar sesión</h2>

        <div class="group">
          <label for="email">Correo electrónico</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="tu@email.com"
            @keyup.enter="handleLogin"
            required
          />
        </div>

        <div class="group">
          <label for="password">Contraseña</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="••••••"
            @keyup.enter="handleLogin"
            required
          />
        </div>

        <div class="error-message" v-if="authError">{{ authError }}</div>

        <button @click="handleLogin" :disabled="isLoading" class="login-button">
          <span v-if="!isLoading">Ingresar</span>
          <span v-else> <i class="spinner"></i> Cargando... </span>
        </button>

        <div class="additional-options">
          <router-link to="/registro" class="link"
            >¿No tienes cuenta? Regístrate</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  computed: {
    ...mapGetters(["isLoading", "authError", "isAuthenticated"]),
  },
  methods: {
    ...mapMutations(["SET_USER", "SET_ERROR", "SET_LOADING"]),
async handleLogin() {
  if (!this.email || !this.password) {
    this.SET_ERROR("Por favor, completa todos los campos.");
    return;
  }

  this.SET_LOADING(true);
  this.SET_ERROR(null);

  try {
    const res = await axios.post("http://localhost:3000/api/auth/login", {
      correo: this.email,
      contrasenia: this.password,
    });

    const { token, user } = res.data;

    // Guardar el token y el usuario en localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    console.log("🟢 Usuario guardado:", user);
    console.log("📦 Desde localStorage:", JSON.parse(localStorage.getItem("user")));

    // Guardar usuario en Vuex
    this.SET_USER(user);

    // 🔥 Notificar al componente raíz (App.vue) que hay un nuevo login
    this.$root.loginStatusFlag++;

    // Redirigir a la página principal
    this.$router.push("/");
  } catch (err) {
    const msg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Error al iniciar sesión.";
    this.SET_ERROR(msg);
  } finally {
    this.SET_LOADING(false);
  }
}
  },
  created() {
    this.SET_ERROR(null); // Limpiar errores al cargar
  },
};
</script>

<style scoped>
/* Estilos generales del contenedor de login */
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #fefcf3; /* Fondo suave */
  background-image: url("@/assets/images/login_bg.jpg"); /* Fondo de imagen */
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden; /* Para el fondo de la imagen */
  padding: 20px;
  box-sizing: border-box;
}

.login-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(
    0,
    0,
    0,
    0.4
  ); /* Overlay oscuro para que el texto sea legible */
  z-index: 0;
}

.login-container > * {
  position: relative;
  z-index: 1;
}

.logo-museo {
  width: 120px;
  height: 120px;
  background-image: url("@/assets/images/logo_museo.png"); /* Asegúrate de tener tu logo aquí */
  background-size: cover;
  background-position: center;
  margin-bottom: 20px;
}

h1 {
  color: #fff;
  font-size: 3rem;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
}

.login-box {
  background-color: rgba(0, 0, 0, 0.547); /* Color de caja de login */
  border-radius: 15px;
  border: #5c2905 solid 1px;
  padding: 40px;
  /* box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); */
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
}

.form-title {
  text-align: center;
  color: white;
  margin-bottom: 30px;
  font-size: 2rem;
}

.group {
  margin-bottom: 25px;
}

.group label {
  display: block;
  margin-bottom: 8px;
  color: white;
  font-weight: bold;
  font-size: 0.95rem;
}

.group input {
  background-color: rgba(237, 229, 229, 0.072);
  width: 100%;
  padding: 12px 15px;
  border-radius: 0px;
  border-bottom: 1px solid #dbcfc3;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.group input:focus {
  border-color: #8c5e3c;
  outline: none;
  box-shadow: 0 0 0 3px rgba(140, 94, 60, 0.2);
}

.login-button {
  width: 100%;
  padding: 12px;
  border: none;
  background: #4e342e;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background 0.3s;
  margin-top: 15px;
}

.login-button:hover {
  background: #6d4c41;
}

.login-button:disabled {
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

.additional-options {
  text-align: center;
  margin-top: 20px;
}

.additional-options .link {
  color: rgba(250, 212, 195, 0.735);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.additional-options .link:hover {
  color: white;
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
  h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }
  .login-box {
    padding: 30px 20px;
    max-width: 350px;
  }
  .form-title {
    font-size: 1.8rem;
  }
  .group input,
  .login-button {
    padding: 10px 12px;
    font-size: 1rem;
  }
}
</style>
