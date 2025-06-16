<template>
  <div class="not-found-container">
    <h1>404</h1>
    <h2>Página No Encontrada</h2>
    <p>Lo sentimos, la página que estás buscando no existe.</p>
    <router-link to="/" class="home-link">Volver al Inicio</router-link>
  </div>
</template>

<script>
export default {
  name: "NotFound",
};
</script>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px); /* Ajusta para el header */
  text-align: center;
  background-color: #fefcf3;
  color: #4e342e;
  padding: 20px;
  box-sizing: border-box;
}

h1 {
  font-size: 6rem;
  margin-bottom: 10px;
  color: #8c5e3c;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2);
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

p {
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.home-link {
  display: inline-block;
  padding: 12px 25px;
  background-color: #4e342e;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;
}

.home-link:hover {
  background-color: #6d4c41;
}
</style>
