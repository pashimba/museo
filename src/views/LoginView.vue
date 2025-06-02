<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="logo-museo"></div>
      <h1>MUSEO VIRTUAL</h1>

      <div class="auth-box">
        <div class="auth-form">
          <h2 class="form-title">Iniciar Sesión</h2>
          
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
            class="auth-button"
          >
            <span v-if="!isLoading">Ingresar</span>
            <span v-else>
              <i class="spinner"></i> Cargando...
            </span>
          </button>
          
          <div class="additional-options">
            <router-link to="/registro" class="auth-link">¿No tienes cuenta? Regístrate aquí</router-link>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { auth } from '@/firebase/init'; // Import Firebase auth
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginView',
  setup() {
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const isLoading = ref(false);
    const router = useRouter();

    const handleLogin = async () => {
      errorMessage.value = '';
      isLoading.value = true;

      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        router.push('/'); // Redirect to home on successful login
      } catch (error) {
        console.error("Login error:", error.code, error.message);
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage.value = 'Correo electrónico o contraseña incorrectos.';
            break;
          case 'auth/invalid-email':
            errorMessage.value = 'Formato de correo electrónico inválido.';
            break;
          case 'auth/too-many-requests':
            errorMessage.value = 'Demasiados intentos fallidos. Intenta de nuevo más tarde.';
            break;
          default:
            errorMessage.value = 'Ocurrió un error al iniciar sesión. Inténtalo de nuevo.';
        }
      } finally {
        isLoading.value = false;
      }
    };

    return {
      email,
      password,
      errorMessage,
      isLoading,
      handleLogin,
    };
  },
};
</script>

<style scoped>
.auth-page {
  background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('@/assets/auth_bg.jfif') no-repeat center center/cover; /* Themed background */
  min-height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  box-sizing: border-box;
}

.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 450px;
  background-color: rgba(255, 255, 255, 0.95); /* Slightly transparent white box */
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  padding: 40px;
  color: #4E342E; /* Dark brown text */
}

.logo-museo {
  width: 100px;
  height: 100px;
  background-image: url('@/assets/logo.png'); /* Use your museum logo */
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-bottom: 20px;
}

.auth-container h1 {
  font-family: 'Georgia', serif;
  font-size: 2.2rem;
  margin-bottom: 30px;
  color: #4E342E;
}

.auth-box {
  width: 100%;
}

.form-title {
  text-align: center;
  color: #4E342E;
  margin-bottom: 30px;
  font-size: 1.8rem;
  font-weight: bold;
}

.group {
  margin-bottom: 20px;
}

.group label {
  display: block;
  margin-bottom: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  color: #6D4C41; /* Slightly lighter brown for labels */
}

.group input {
  width: 100%;
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #BFAe9E; /* Light brown border */
  font-size: 1rem;
  background-color: #F8F8F8;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box; /* Include padding in width */
}

.group input:focus {
  border-color: #8C5E3C; /* Darker brown on focus */
  outline: none;
  box-shadow: 0 0 0 3px rgba(141, 110, 99, 0.3); /* Subtle focus ring */
}

.auth-button {
  width: 100%;
  padding: 12px;
  border: none;
  background: #4E342E; /* Dark brown button */
  color: white;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background 0.3s ease, transform 0.2s ease;
  margin-top: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.auth-button:hover {
  background: #6D4C41; /* Lighter brown on hover */
  transform: translateY(-2px);
}

.auth-button:disabled {
  background: #A1887F; /* Grayed out when disabled */
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid #fff;
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #D32F2F; /* Red error message */
  background-color: #FFEBEE; /* Light red background */
  padding: 10px;
  border-radius: 5px;
  margin: 15px 0;
  text-align: center;
  font-size: 0.95rem;
  border: 1px solid #EF9A9A;
}

.additional-options {
  text-align: center;
  margin-top: 25px;
  font-size: 0.95rem;
}

.auth-link {
  color: #6D4C41; /* Medium brown link */
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.auth-link:hover {
  color: #8C5E3C;
  text-decoration: underline;
}
</style>