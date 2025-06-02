<template>
  <div class="registro-wrap">
    <div class="registro-html">
      <div class="registro-form">
        <div class="sign-up-htm">
          <h2 class="form-title">Registro Museo Virtual</h2>
          
          <!-- Mensaje de error -->
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          
          <!-- Formulario -->
          <div class="group">
            <label for="displayName" class="label">Nombre completo</label>
            <input 
              id="displayName" 
              type="text" 
              class="input"
              v-model="displayName"
              required
            >
          </div>
          
          <div class="group">
            <label for="email" class="label">Correo electrónico</label>
            <input 
              id="email" 
              type="email" 
              class="input"
              v-model="email"
              required
            >
          </div>
          
          <div class="group">
            <label for="password" class="label">Contraseña (mínimo 6 caracteres)</label>
            <input 
              id="password" 
              type="password" 
              class="input"
              v-model="password"
              required
            >
          </div>
          
          <div class="group">
            <label for="confirmPassword" class="label">Confirmar contraseña</label>
            <input 
              id="confirmPassword" 
              type="password" 
              class="input"
              v-model="confirmPassword"
              required
            >
          </div>
          
          <div class="group">
            <button 
              class="button"
              @click="handleRegister"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">Registrarse</span>
              <span v-else>Registrando...</span>
            </button>
          </div>
          
          <div class="login-link">
            ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";

export default {
  name: 'RegistroView',
  data() {
    return {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
      isLoading: false
    };
  },
  methods: {
    async handleRegister() {
      // Validaciones básicas
      if (!this.displayName || !this.email || !this.password) {
        this.errorMessage = 'Todos los campos son obligatorios';
        return;
      }
      
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden';
        return;
      }
      
      if (this.password.length < 6) {
        this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        return;
      }
      
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        // 1. Crear usuario en Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        
        // 2. Guardar información adicional en Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          displayName: this.displayName,
          email: this.email,
          createdAt: new Date(),
          favorites: [],
          role: 'user' // Puedes usar esto para permisos especiales
        });
        
        // 3. Redirigir al usuario
        this.$router.push('/galeria');
        
      } catch (error) {
        console.error('Error en registro:', error);
        
        // Manejo de errores específicos
        switch (error.code) {
          case 'auth/email-already-in-use':
            this.errorMessage = 'Este correo ya está registrado';
            break;
          case 'auth/invalid-email':
            this.errorMessage = 'Correo electrónico inválido';
            break;
          case 'auth/weak-password':
            this.errorMessage = 'La contraseña es demasiado débil';
            break;
          default:
            this.errorMessage = 'Ocurrió un error al registrar. Intenta nuevamente.';
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.registro-wrap {
  width: auto;
  margin: auto;
  margin-top: 50px;
  max-width: 525px;
  min-height: 520px;
  position: relative;
  box-shadow: 0 12px 15px 0 rgba(0, 0, 0, 0.24), 
              0 17px 50px 0 rgba(251, 252, 246, 0.19);
  background-color: #e9bd84;
  border-radius: 10px;
  padding: 40px;
}

.form-title {
  text-align: center;
  color: #4e342e;
  margin-bottom: 20px;
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
  margin-bottom: 5px;
}

.registro-form .group .button {
  background-color: #4e342e;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.registro-form .group .button:hover {
  background-color: #6d4c41;
}

.registro-form .group .button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 14px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #4e342e;
}

.login-link a {
  color: #1e88e5;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>