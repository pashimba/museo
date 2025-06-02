<template>
  <div id="app">
    <BienvenidaComponent v-if="mostrarBienvenida" @animation-ended="mostrarBienvenida = false" />
    
    <div v-else>
      <header class="u-clearfix u-header u-header" id="header">
        <div class="u-clearfix u-sheet u-sheet-1">
          <a href="/" class="u-image u-logo u-image-1" data-image-width="150" data-image-height="150">
            <img src="@/assets/logo.png" class="u-logo-image u-logo-image-1" alt="Logo Museo">
          </a>
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
                  <router-link class="u-button-style u-nav-link" to="/">Inicio</router-link>
                </li>
                <li class="u-nav-item">
                  <router-link class="u-button-style u-nav-link" to="/linea-del-tiempo">Línea de Tiempo</router-link>
                </li>
                <li class="u-nav-item">
                  <router-link class="u-button-style u-nav-link" to="/galeria">Galería 3D</router-link>
                </li>
                 <li class="u-nav-item">
                  <router-link class="u-button-style u-nav-link" to="/juego">Juego Trivia</router-link> </li>
                <li class="u-nav-item">
                  <router-link class="u-button-style u-nav-link" to="/login">Iniciar Sesión</router-link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>

      <router-view />
    </div>

    <audio :src="require('@/assets/fondo.mp3')" autoplay loop></audio>

    <footer class="app-footer">
      <div class="footer-content">
        <p>&copy; {{ currentYear }} Museo Virtual de la Historia de Bolivia. Todos los derechos reservados.</p>
        <div class="social-links">
          <a href="#" target="_blank" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="#" target="_blank" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
          <a href="#" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
        </div>
        <p>Contacto: info@museovirtualbolivia.org</p>
      </div>
    </footer>
  </div>
</template>

<script>
import BienvenidaComponent from "@/components/BienvenidaComponent.vue";

export default {
  name: 'App',
  components: {
    BienvenidaComponent,
  },
  data() {
    return {
      mostrarBienvenida: true,
      currentYear: new Date().getFullYear(),
    };
  }
}
</script>

<style>
/* Global styles for a cleaner look */
body {
  margin: 0;
  font-family: 'Times New Roman', Times, serif; /* Consistent font with game */
  background-color: #f0f0f0; /* Light background */
  color: #333;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Header styles */
header {
  background-color: #4E342E; /* Dark brown */
  padding: 10px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.u-logo-image {
  height: 60px; /* Adjust logo size */
  width: auto;
}

.u-nav-container {
  font-size: 1.1rem;
}

.u-nav-link {
  color: #FFF; /* White text for links */
  padding: 10px 15px;
  margin: 0 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
  border-radius: 5px;
  text-transform: uppercase; /* Make nav links uppercase */
  font-weight: bold;
}

.u-nav-link:hover {
  background-color: #6D4C41; /* Lighter brown on hover */
  color: #FFECB3; /* Light yellow text on hover */
}

/* Active link styling (you might need to adjust based on your router-link-active class) */
.u-nav-link.router-link-exact-active {
  background-color: #8D6E63; /* Even lighter brown for active */
  color: #FFF;
}

/* Hamburger menu for responsiveness (adjust as needed for your framework's mobile menu) */
.menu-collapse {
  display: none; /* Hide by default on desktop */
}

@media (max-width: 768px) {
  .u-nav-container {
    display: none; /* Hide main nav on smaller screens */
  }
  .menu-collapse {
    display: block; /* Show hamburger icon */
  }
  /* You'll need to implement the actual offcanvas menu logic for the hamburger */
}

/* Footer styles */
.app-footer {
  background-color: #4E342E;
  color: #FFF;
  padding: 20px;
  text-align: center;
  margin-top: auto; /* Pushes footer to the bottom */
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2);
}

.footer-content p {
  margin: 5px 0;
  font-size: 0.9rem;
}

.social-links a {
  color: #FFF;
  margin: 0 10px;
  font-size: 1.5rem;
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: #FFECB3;
}

/* Add Font Awesome for social icons. You'll need to include Font Awesome in your project: */
/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"> */
</style>
