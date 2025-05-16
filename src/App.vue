<template>
  <div id="app">
    <!-- Mostrar la animación si `mostrarBienvenida` es true -->
    <BienvenidaComponent v-if="mostrarBienvenida" @animation-ended="mostrarBienvenida = false" />
    
    <div v-else>
      <!-- El contenido de tu página principal, router-view, después de la animación -->
      <header class="u-clearfix u-header u-header" id="header">
        <div class="u-clearfix u-sheet u-sheet-1">
          <nav class="u-menu u-menu-one-level u-offcanvas u-menu-1">
            <div class="menu-collapse" style="font-size: 1rem; letter-spacing: 0px;">
              <a class="u-button-style u-nav-link" href="#">
                <svg class="u-svg-link" viewBox="0 0 24 24">
                  <use xlink:href="#menu-hamburger"></use>
                </svg>
                <svg class="u-svg-content" version="1.1" id="menu-hamburger" viewBox="0 0 16 16">
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
                  <router-link class="u-button-style u-nav-link" to="/login">Iniciar sesión</router-link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>

      <router-view />
    </div>

    <!-- El audio suena en todo momento -->
    <audio :src="require('@/assets/fondo.mp3')" autoplay loop></audio>

    <!-- El pie de página -->
   
  </div>
</template>

<script>
// Importa el componente de la animación
import BienvenidaComponent from "@/components/BienvenidaComponent.vue";  // Asegúrate de que la ruta sea correcta

export default {
  name: 'App',
  components: {
    BienvenidaComponent,  // Agrega el componente aquí
  },
  data() {
    return {
      mostrarBienvenida: true,  // Muestra la animación al principio
    };
  }
}
</script>

<style>
@import './assets/nicepage.css';
@import './assets/index.css';

body {
  margin: 0;
  background-color: black;  /* Fondo negro para toda la página */
  color: white;  /* Color blanco para el texto */
}
</style>
