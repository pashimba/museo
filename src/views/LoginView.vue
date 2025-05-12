<template>
  <div class="login-container">
    <div class="logo-museo"></div>
    <h1>MUSEO VIRTUAL</h1>

    <div class="login-box">
      <div class="login-form">
        <div class="group">
          <label for="user">Correo electrónico</label>
          <input v-model="username" type="text" id="user" />
        </div>
        <div class="group">
          <label for="pass">Contraseña</label>
          <input v-model="password" type="password" id="pass" />
        </div>
        <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
        <button @click="handleLogin">Ingresar</button>
      </div>
    </div>
  </div>
</template>

<script>
import users from "@/assets/users.json"; // Asegúrate de crear este archivo

export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    handleLogin() {
      const user = users.find(
        (u) => u.username === this.username && u.password === this.password
      );

      if (!this.username.includes("@")) {
        this.errorMessage = "Correo inválido";
      } else if (!user) {
        this.errorMessage = "Correo o contraseña incorrectos";
      } else {
        this.errorMessage = "";
        this.$router.push("/galeria"); // Redirige si el login es correcto
      }
    },
  },
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
}
.logo-museo {
  background-image: url('@/assets/museo-logo.png'); /* cambia por tu logo */
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
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
  margin: 0 auto;
}
.group {
  margin-bottom: 1rem;
}
input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}
button {
  padding: 0.8rem 2rem;
  border: none;
  background: #8c5e3c;
  color: white;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background: #a86e47;
}
.error-message {
  color: red;
  font-size: 0.9rem;
}
</style>
