<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="logo-museo"></div>
      <h1>MUSEO VIRTUAL</h1>

      <div class="auth-box">
        <div class="auth-form">
          <h2 class="form-title">Registro de Usuario</h2>
          
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          
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
            <label for="confirmPassword" class="label">Confirmar Contraseña</label>
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
              type="submit" 
              class="auth-button" 
              @click="handleRegister"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">Registrarse</span>
              <span v-else><i class="spinner"></i> Registrando...</span>
            </button>
          </div>
          
          <div class="additional-options">
            <router-link to="/login" class="auth-link">¿Ya tienes cuenta? Inicia Sesión</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { auth, db } from '@/firebase/init'; // Import Firebase auth and db
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // For Firestore
import { useRouter } from 'vue-router';

export default {
  name: 'RegistroView',
  setup() {
    const displayName = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const errorMessage = ref('');
    const isLoading = ref(false);
    const router = useRouter();

    const handleRegister = async () => {
      errorMessage.value = '';
      isLoading.value = true;

      if (password.value.length < 6) {
        errorMessage.value = 'La contraseña debe tener al menos 6 caracteres.';
        isLoading.value = false;
        return;
      }

      if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Las contraseñas no coinciden.';
        isLoading.value = false;
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        // Update user profile with display name
        await updateProfile(user, {
          displayName: displayName.value
        });

        // Optionally save additional user data to Firestore
        await setDoc(doc(db, "users", user.uid), {
          displayName: displayName.value,
          email: user.email,
          createdAt: new Date()
          // You can add more fields here like favorites
        });

        router.push('/'); // Redirect to home on successful registration
      } catch (error) {
        console.error("Registration error:", error.code, error.message);
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage.value = 'Este correo electrónico ya está registrado.';
            break;
          case 'auth/invalid-email':
            errorMessage.value = 'Formato de correo electrónico inválido.';
            break;
          case 'auth/weak-password':
            errorMessage.value = 'La contraseña es demasiado débil.';
            break;
          default:
            errorMessage.value = 'Ocurrió un error al registrarse. Inténtalo de nuevo.';
        }
      } finally {
        isLoading.value = false;
      }
    };

    return {
      displayName,
      email,
      password,
      confirmPassword,
      errorMessage,
      isLoading,
      handleRegister,
    };
  },
};
</script>

<style scoped>
/* Reusing most styles from login.vue for consistency */
/* Only add new styles or overrides specific to registro.vue */

.auth-page {
  background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('@/assets/auth_bg.jfif') no-repeat center center/cover;
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
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  padding: 40px;
  color: #4E342E;
}

.logo-museo {
  width: 100px;
  height: 100px;
  background-image: url('@/assets/logo.png');
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
  color: #6D4C41;
}

.group input {
  width: 100%;
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #BFAe9E;
  font-size: 1rem;
  background-color: #F8F8F8;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
}

.group input:focus {
  border-color: #8C5E3C;
  outline: none;
  box-shadow: 0 0 0 3px rgba(141, 110, 99, 0.3);
}

.auth-button {
  width: 100%;
  padding: 12px;
  border: none;
  background: #4E342E;
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
  background: #6D4C41;
  transform: translateY(-2px);
}

.auth-button:disabled {
  background: #A1887F;
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
  color: #D32F2F;
  background-color: #FFEBEE;
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
  color: #6D4C41;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.auth-link:hover {
  color: #8C5E3C;
  text-decoration: underline;
}
</style>