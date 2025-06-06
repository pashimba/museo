<template>
  <div class="fondo-dinamico"></div>
</template>

<script>
export default {
  name: "FondoDinamico",
};
</script>

<style scoped>
.fondo-dinamico {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
      circle at top left,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 70%
    ),
    radial-gradient(
      circle at bottom right,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 70%
    );
  /* Puedes añadir animaciones, partículas, etc. */
  pointer-events: none; /* Permite clics a través de él */
  z-index: 0; /* Asegúrate de que esté debajo del contenido principal */
}
</style>
