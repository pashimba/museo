<template>
  <div id="app">
    <BienvenidaComponent
      v-if="mostrarBienvenida"
      @animation-ended="mostrarBienvenida = false"
    />
<!-- hola bobois -->
    <div v-else class="main-content">
      <header class="u-clearfix u-header u-header" id="header">
        <div class="u-clearfix u-sheet u-sheet-1">
          <nav class="u-menu u-menu-one-level u-offcanvas u-menu-1">
            <div
              class="menu-collapse"
              style="font-size: 1rem; letter-spacing: 0px"
            >
              <a class="u-button-style u-nav-link" href="#">
                <svg class="u-svg-link" viewBox="0 0 24 24">
                  <use xlink:href="#menu-hamburger"></use>
                </svg>
                <svg
                  class="u-svg-content"
                  version="1.1"
                  id="menu-hamburger"
                  viewBox="0 0 16 16"
                >
                  <g>
                    <rect y="1" width="16" height="2" />
                    <rect y="7" width="16" height="2" />
                    <rect y="13" width="16" height="2" />
                  </g>
                </svg>
              </a>
            </div>
            <div class="u-nav-container">
              <ul class="u-nav u-unstyled u-nav-1">
                <li class="u-nav-item">
                  <router-link class="u-button-style u-nav-link" to="/"
                    >Inicio</router-link
                  >
                </li>
                <li class="u-nav-item">
                  <router-link
                    class="u-button-style u-nav-link"
                    to="/mapa-interactivo"
                    >Mapa Interactivo</router-link
                  >
                </li>
                <li class="u-nav-item">
                  <router-link
                    class="u-button-style u-nav-link"
                    to="/ceramics-gallery"
                    >Cerámicas 3D</router-link
                  >
                  <!-- AÑADE ESTA LÍNEA -->
                </li>
                <li class="u-nav-item">
                  <router-link
                    class="u-button-style u-nav-link"
                    to="/linea-del-tiempo"
                    >Linea Tiempo</router-link
                  >
                </li>
                <li class="u-nav-item">
                  <router-link class="u-button-style u-nav-link" to="/museum-3d"
                    >Museo</router-link
                  >
                </li>
                <li class="u-nav-item">
                  <router-link class="u-button-style u-nav-link" to="/galeria"
                    >Galeria</router-link
                  >
                </li>
                <li class="u-nav-item">
                  <router-link class="u-button-style u-nav-link" to="/login"
                    >Iniciar sesión</router-link
                  >
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>

      <router-view />
    </div>

    <audio :src="require('@/assets/fondo.mp3')" autoplay loop></audio>
  </div>
</template>

<script>
import BienvenidaComponent from "@/components/BienvenidaComponent.vue";

export default {
  name: "App",
  components: {
    BienvenidaComponent,
  },
  data() {
    return {
      mostrarBienvenida: true,
    };
  },
};
</script>

<style>
/* Estilos globales para App.vue y el header */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /* Eliminar margin/padding predeterminado si es necesario */
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* Evitar scroll horizontal */
}

body {
  margin: 0;
  padding: 0;
}

.main-content {
  padding-top: 60px; /* Ajusta según la altura de tu header */
}

/* Estilos básicos para el header (puedes personalizar más) */
.u-header {
  background-color: #f8f8f8;
  border-bottom: 1px solid #eee;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.u-sheet-1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}

.u-menu-1 {
  /* Estilos para el menú de navegación */
}

.u-nav-1 {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.u-nav-item {
  margin-left: 20px;
}

.u-nav-link {
  text-decoration: none;
  color: #333;
  font-weight: bold;
  padding: 5px 10px;
  transition: color 0.3s ease;
}

.u-nav-link:hover,
.u-nav-link.router-link-exact-active {
  color: #42b983; /* Color de realce para el enlace activo */
}

/* Estilos para el icono de hamburguesa (si usas Responsive design) */
.menu-collapse {
  display: none; /* Oculto por defecto en desktop, visible en móviles */
}

@media (max-width: 768px) {
  .u-nav-container {
    display: none; /* Oculta el menú en móviles por defecto */
  }
  .menu-collapse {
    display: block; /* Muestra el icono de hamburguesa */
  }
  /* Aquí deberías implementar la lógica para mostrar el menú al hacer clic en el icono */
}

/* Estilos para el audio (opcional, solo para visualización) */
audio {
  display: none; /* Oculta el reproductor de audio, pero sigue sonando */
}
</style>
