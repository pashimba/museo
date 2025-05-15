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
          />
        </div>
        
        <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
        
        <button 
          @click="handleLogin"
          :disabled="isLoading"
          class="login-button"
        >
          <span v-if="!isLoading">Ingresar</span>
          <span v-else>
            <i class="spinner"></i> Cargando...
          </span>
        </button>
        
        <div class="additional-options">
          <router-link to="/registro" class="register-link">
            ¿No tienes cuenta? Regístrate
          </router-link>
          <router-link to="/recuperar-contrasena" class="forgot-password">
            ¿Olvidaste tu contraseña?
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";

export default {
  name: 'LoginView',
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      isLoading: false
    };
  },
  methods: {
    async handleLogin() {
      // Validaciones básicas
      if (!this.email || !this.password) {
        this.errorMessage = "Por favor completa todos los campos";
        return;
      }
      
      if (!this.email.includes("@")) {
        this.errorMessage = "Por favor ingresa un correo válido";
        return;
      }
      
      this.isLoading = true;
      this.errorMessage = "";
      
      try {
        // Iniciar sesión con Firebase Auth
        await signInWithEmailAndPassword(auth, this.email, this.password);
        
        // Redirigir al dashboard/galería
        this.$router.push("/galeria");
        
      } catch (error) {
        console.error("Error de autenticación:", error);
        
        // Manejo de errores específicos
        switch (error.code) {
          case 'auth/user-not-found':
            this.errorMessage = "Usuario no encontrado";
            break;
          case 'auth/wrong-password':
            this.errorMessage = "Contraseña incorrecta";
            break;
          case 'auth/invalid-email':
            this.errorMessage = "Correo electrónico inválido";
            break;
          case 'auth/too-many-requests':
            this.errorMessage = "Demasiados intentos. Intenta más tarde o restablece tu contraseña";
            break;
          default:
            this.errorMessage = "Error al iniciar sesión. Intenta nuevamente.";
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  text-align: center;
  font-family: 'Georgia', serif;
  background: #f3f0e8;
  color: #3e3e3e;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo-museo {
  background-image: url('@/assets/museo-logo.png');
  background-size: contain;
  background-repeat: no-repeat;
  width: 120px;
  height: 100px;
  margin: 0 auto 20px;
}

.login-box {
  max-width: 400px;
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.form-title {
  color: #4e342e;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #5d4037;
  font-weight: 500;
}

.group input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 5px;
  border: 1px solid #bfae9e;
  font-size: 1rem;
  transition: border 0.3s;
}

.group input:focus {
  border-color: #8c5e3c;
  outline: none;
}

.login-button {
  width: 100%;
  padding: 0.8rem;
  border: none;
  background: #4e342e;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
  margin-top: 0.5rem;
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
  padding: 0.8rem;
  border-radius: 5px;
  margin: 1rem 0;
  text-align: center;
  font-size: 0.9rem;
}

.additional-options {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.register-link {
  color: #1e88e5;
  text-decoration: none;
  font-size: 0.9rem;
}

.register-link:hover {
  text-decoration: underline;
}

.forgot-password {
  color: #757575;
  text-decoration: none;
  font-size: 0.85rem;
}

.forgot-password:hover {
  text-decoration: underline;
}

/* Spinner para estado de carga */
.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>