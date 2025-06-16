<template>
  <div class="bienvenida-overlay" :class="{ 'fade-out': !animating }">
    <div class="bienvenida-content">
      <img
        src="@/assets/images/logo_museo.png"
        alt="Logo Museo Virtual"
        class="logo-animado"
      />
      <h1 class="titulo-animado">MUSEO VIRTUAL</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "BienvenidaComponent",
  data() {
    return {
      animating: true,
    };
  },
  mounted() {
    // Simula una animación con un temporizador
    setTimeout(() => {
      this.animating = false; // Inicia la animación de desvanecimiento
    }, 3000); // Muestra la animación por 3 segundos

    setTimeout(() => {
      this.$emit("animation-ended"); // Emite el evento cuando la animación termina
    }, 4000); // 1 segundo después para que la transición fade-out se complete
  },
};
</script>

<style scoped>
.bienvenida-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fefcf3; /* Color de fondo de la bienvenida */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Asegura que esté por encima de todo */
  transition: opacity 1s ease-out; /* Transición de desvanecimiento */
}

.bienvenida-overlay.fade-out {
  opacity: 0;
  pointer-events: none; /* Deshabilita interacciones una vez que se desvanece */
}

.bienvenida-content {
  text-align: center;
}

.logo-animado {
  width: 150px;
  height: auto;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInLogo 1s ease-out 0.5s forwards;
}

.titulo-animado {
  font-size: 3rem;
  color: #4e342e;
  margin-top: 20px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInText 1s ease-out 1s forwards;
}

@keyframes fadeInLogo {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInText {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estilos de spinner si decides reusarlos en otros componentes */
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
