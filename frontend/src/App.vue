<template>
  <div id="app" :class="{ 'dark-mode-global': isDarkMode }">
    <BienvenidaComponent
      v-if="mostrarBienvenida"
      @animation-ended="mostrarBienvenida = false"
      :isDarkMode="isDarkMode"
    />


    <div v-else class="main-content">
      <header class="main-header" :class="{ scrolled: isScrolled }">
        <nav class="navbar">
          <div class="navbar-container">
           
            <router-link to="/" class="navbar-brand">Museo</router-link>


            <button
              class="navbar-toggler"
              @click="toggleMenu"
              aria-label="Toggle navigation"
              :class="{ 'is-active': isMenuOpen }"
            >
              <span class="toggler-icon"></span>
              <span class="toggler-icon"></span>
              <span class="toggler-icon"></span>
            </button>


            <div class="navbar-links" :class="{ 'is-active': isMenuOpen }">
              <ul class="navbar-nav">
                
                <li class="nav-item">
                  <router-link class="nav-link" to="/guia"
                    >Guia</router-link
                  >
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/juego"
                    >Juego</router-link
                  >
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/ceramics-gallery"
                    >Cerámicas 3D</router-link
                  >
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/lineadeltiempo"
                    >Línea Tiempo</router-link
                  >
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/museum-3d"
                    >Museo</router-link
                  >
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/galeria"
                    >Galería</router-link
                  >
                </li>
                 <li class="nav-item">
                  <router-link class="nav-link" to="/faq"
                    >Preguntas</router-link
                  >
                </li>
                <li class="nav-item">
  <router-link
    v-if="!usuarioLogueado"
    class="nav-link auth-link small-auth-btn"
    to="/login"
  >
    Log In
  </router-link>
  <button
    v-else
    class="nav-link auth-link small-auth-btn"
    @click="cerrarSesion"
  >
    Sign Out
  </button>
</li>
                <li class="nav-item language-switcher-item">
                  <LanguageSwitcher :isDarkMode="isDarkMode" />
                </li>
                <li class="nav-item theme-switcher-item">
                  <div class="theme-switcher-container">
                    <label class="switch">
                      <input type="checkbox" v-model="isDarkMode" @change="saveThemePreference">
                      <span class="slider round"></span>
                    </label>
                    <span class="theme-text">{{ isDarkMode ? 'Oscuro' : 'Claro' }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>


      <router-view />
    </div>


    
  </div>
</template>


<script>
import BienvenidaComponent from "@/components/BienvenidaComponent.vue";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";

export default {
  name: "App",
  components: {
    BienvenidaComponent,
    LanguageSwitcher,
  },
  data() {
    return {
      mostrarBienvenida: true,
      isMenuOpen: false,
      isScrolled: false,
      isDarkMode: false,
      loginStatusFlag: 0, // <-- NUEVO: fuerza actualización del computed
    };
  },
  computed: {
    usuarioLogueado() {
      this.loginStatusFlag; // fuerza reevaluación
      return !!localStorage.getItem("token");
    },
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      if (this.isMenuOpen) {
        this.isMenuOpen = false;
      }
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    saveThemePreference() {
      localStorage.setItem("darkMode", this.isDarkMode);
    },
    cerrarSesion() {
      localStorage.removeItem("token");
      this.loginStatusFlag++; // <-- Fuerza reevaluar usuarioLogueado
      this.$router.push("/");
    },
  },
  watch: {
    $route() {
      this.closeMenu();
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);

    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "true") this.isDarkMode = true;
    else if (savedTheme === "false") this.isDarkMode = false;
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches)
      this.isDarkMode = true;

    // Verificar si ya está logueado
    if (localStorage.getItem("token")) {
      this.loginStatusFlag++;
    }
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>


<style>
/* ===== ESTILOS GLOBALES ===== */
:root {
  --primary-text-color: #ffffff;
  --text-hover-color: #e0e0e0;
  --accent-color: #ffc107;
  --header-height: 80px;


  /* Nuevas variables CSS para el tema */
  --bg-color-light: #fefcf3; /* Color de fondo global para modo claro */
  --text-color-light: #333; /* Color de texto global para modo claro */
  --header-bg-light: rgba(32, 29, 29, 0.358); /* Fondo del header para modo claro */
  --header-scrolled-bg-light: rgba(10, 10, 10, 0.85); /* Fondo del header al hacer scroll en modo claro */
  --navbar-link-color-light: #ffffff; /* Color de los enlaces de navegación en modo claro */
  --navbar-link-hover-color-light: #e0e0e0; /* Color de los enlaces de navegación al hacer hover en modo claro */
  --toggler-icon-color-light: #ffffff; /* Color del icono de hamburguesa en modo claro */
  --navbar-mobile-bg-light: rgba(20, 20, 20, 0.98); /* Fondo del menú móvil en modo claro */




  --bg-color-dark: #1a1a1a; /* Color de fondo global para modo oscuro */
  --text-color-dark: #f0e6d6; /* Color de texto global para modo oscuro */
  --header-bg-dark: rgba(0, 0, 0, 0.7); /* Fondo del header para modo oscuro */
  --header-scrolled-bg-dark: rgba(0, 0, 0, 0.95); /* Fondo del header al hacer scroll en modo oscuro */
  --navbar-link-color-dark: #f0e6d6; /* Color de los enlaces de navegación en modo oscuro */
  --navbar-link-hover-color-dark: #ffd700; /* Color de los enlaces de navegación al hacer hover en modo oscuro */
  --toggler-icon-color-dark: #f0e6d6; /* Color del icono de hamburguesa en modo oscuro */
  --navbar-mobile-bg-dark: rgba(0, 0, 0, 0.98); /* Fondo del menú móvil en modo oscuro */
}


body {
  margin: 0;
  font-family: "Avenir", "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* background-color y color ahora son controlados por #app.dark-mode-global */
  /* background-color: #f5f5f5; */
  /* color: #333; */
}


#app {
  overflow-x: hidden;
  /* Nuevo: Uso de variables CSS para el color de fondo y texto global */
  background-color: var(--bg-color-light); /* Color de fondo por defecto (claro) */
  color: var(--text-color-light); /* Color de texto por defecto (claro) */
  transition: background-color 0.5s ease, color 0.5s ease; /* Transición suave */
  min-height: 100vh; /* Asegura que el fondo cubra toda la altura de la ventana */
}


/* Nuevo: Estilos para el modo oscuro aplicados al contenedor principal */
#app.dark-mode-global {
  background-color: var(--bg-color-dark);
  color: var(--text-color-dark);
}


audio {
  display: none;
}


/* ===== ESTILOS DEL NAVBAR ===== */
.main-header {
  position: absolute; /* O 'fixed' si quieres que siempre esté visible al hacer scroll */
  top: 0;
  left: 0;
  width: 100%;
  height: var(--header-height);
  /* Nuevo: Uso de variable CSS para el color de fondo del header */
  background-color: var(--header-bg-light);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  transition: background-color 0.4s ease, box-shadow 0.4s ease;
}


/* Estilo que se aplica al hacer scroll */
.main-header.scrolled {
  position: fixed; /* Asegura que se mantenga fijo al scrollear */
  /* Nuevo: Uso de variable CSS para el color de fondo del header al scrollear */
  background-color: var(--header-scrolled-bg-light);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}


/* Nuevo: Estilos del header para el modo oscuro */
#app.dark-mode-global .main-header {
  background-color: var(--header-bg-dark);
}


#app.dark-mode-global .main-header.scrolled {
  background-color: var(--header-scrolled-bg-dark);
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1); /* Sombra más clara para contraste en oscuro */
}


.navbar-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.navbar-brand {
  font-size: 1.8rem;
  font-weight: 600;
  /* Nuevo: Uso de variable CSS para el color del texto del brand */
  color: var(--navbar-link-color-light);
  text-decoration: none;
  /* Empuja los enlaces a la derecha en la vista de escritorio */
  margin-right: auto;
  transition: color 0.3s ease; /* Transición para el cambio de color */
}


/* Nuevo: Estilos del brand para el modo oscuro */
#app.dark-mode-global .navbar-brand {
  color: var(--navbar-link-color-dark);
}


.navbar-links {
  display: flex;
}


.navbar-nav {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
  /* ✨ CORRECCIÓN PRINCIPAL: Añadimos 'gap' para el espaciado */
  gap: 35px;
}


.nav-link {
  /* Nuevo: Uso de variable CSS para el color de los enlaces */
  color: var(--navbar-link-color-light);
  text-decoration: none;
  font-size: 1rem;
  padding: 8px 0;
  position: relative;
  transition: color 0.3s ease;
}


.nav-link:hover {
  /* Nuevo: Uso de variable CSS para el color de los enlaces al hover */
  color: var(--navbar-link-hover-color-light);
}


/* Nuevo: Estilos de los enlaces para el modo oscuro */
#app.dark-mode-global .nav-link {
  color: var(--navbar-link-color-dark);
}


#app.dark-mode-global .nav-link:hover {
  color: var(--navbar-link-hover-color-dark);
}


/* Subrayado animado para el enlace activo y en hover */
.nav-link::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--accent-color);
  transition: width 0.4s ease;
}


.nav-link:hover::after,
.nav-link.router-link-exact-active::after {
  width: 100%;
}


.nav-link.router-link-exact-active {
  /* Nuevo: Uso de variable CSS para el color del enlace activo */
  color: var(--navbar-link-color-light);
  font-weight: 600;
}


/* Nuevo: Estilo del enlace activo en modo oscuro */
#app.dark-mode-global .nav-link.router-link-exact-active {
  color: var(--navbar-link-color-dark);
}


/* Botón de Iniciar Sesión */
.nav-link.auth-link {
  background-color: var(--accent-color);
  color: #111; /* Se mantiene oscuro para buen contraste con el acento */
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease, color 0.3s ease;
}


.nav-link.auth-link:hover {
  background-color: #ffda73;
  color: #000;
  transform: scale(1.05);
}


.nav-link.auth-link::after {
  display: none;
}


/* Botón de hamburguesa */
.navbar-toggler {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  flex-direction: column;
  gap: 5px;
  z-index: 1001;
}


.toggler-icon {
  display: block;
  width: 25px;
  height: 3px;
  /* Nuevo: Uso de variable CSS para el color del icono del toggler */
  background-color: var(--toggler-icon-color-light);
  border-radius: 3px;
  transition: transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease;
}


/* Nuevo: Estilo del icono del toggler en modo oscuro */
#app.dark-mode-global .toggler-icon {
  background-color: var(--toggler-icon-color-dark);
}


.navbar-toggler.is-active .toggler-icon:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}
.navbar-toggler.is-active .toggler-icon:nth-child(2) {
  opacity: 0;
}
.navbar-toggler.is-active .toggler-icon:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}


/* ===== DISEÑO RESPONSIVO (MÓVIL) ===== */
@media (max-width: 992px) {
  /* Breakpoint ajustado para mejor cobertura */
  .navbar-brand {
    /* En móvil, quitamos el margen automático para que el 'space-between' del contenedor funcione bien */
    margin-right: 0;
  }


  .navbar-toggler {
    display: flex;
  }


  .navbar-links {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    /* Nuevo: Uso de variable CSS para el fondo del menú móvil */
    background-color: var(--navbar-mobile-bg-light);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    position: fixed;
    top: 0;
    left: 100%;
    padding-top: var(--header-height);
    transition: left 0.4s ease-in-out;
    justify-content: center;
    align-items: center;
  }


  /* Nuevo: Estilo del menú móvil en modo oscuro */
  #app.dark-mode-global .navbar-links {
    background-color: var(--navbar-mobile-bg-dark);
  }


  .navbar-links.is-active {
    left: 0;
  }


  .navbar-nav {
    flex-direction: column;
    width: 100%;
    align-items: center;
    gap: 25px; /* Espacio entre items en móvil */
  }


  .nav-item {
    margin: 10px 0;
    width: 100%;
    text-align: center;
  }


  .nav-link {
    font-size: 1.5rem;
    display: inline-block;
  }


  /* Nuevo: Ajustes específicos para el switch de idioma y tema en móvil */
  .language-switcher-item,
  .theme-switcher-item {
    order: 1; /* Asegura que aparezcan primero o en un orden específico en móvil */
    margin-top: 20px; /* Espacio superior para separarlos de los enlaces */
  }
}


/* --- Nuevos Estilos del Switch (Interruptor) --- */
.theme-switcher-container {
  display: flex;
  align-items: center;
  gap: 10px; /* Espacio entre el switch y el texto */
  /* Posicionamiento: se integrará en el navbar-nav, el media query lo moverá en móvil */
}


/* El contenedor del switch */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}


/* Oculta el checkbox por defecto del navegador */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}


/* El slider (la parte visible del switch) */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc; /* Fondo del slider en modo claro */
  -webkit-transition: .4s;
  transition: .4s;
}


.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white; /* Color del "pulgar" del switch */
  -webkit-transition: .4s;
  transition: .4s;
}


/* Cuando el input está checked (modo oscuro) */
input:checked + .slider {
  background-color: #2196F3; /* Color azul para el modo oscuro activado */
}


/* Ajustes de color para el slider en modo oscuro (cuando la app está en modo oscuro) */
#app.dark-mode-global .theme-switcher-container .slider {
  background-color: #555; /* Fondo del slider en modo oscuro */
}


input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}


input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}


/* Bordes redondeados del slider */
.slider.round {
  border-radius: 34px;
}


.slider.round:before {
  border-radius: 50%;
}


.theme-text {
  font-size: 0.9rem; /* Un poco más pequeño para integrar bien */
  font-weight: bold;
  color: var(--navbar-link-color-light); /* Color de texto del switch */
  transition: color 0.3s ease;
}


/* Modo oscuro para el texto del switch */
#app.dark-mode-global .theme-text {
  color: var(--navbar-link-color-dark);
}


.main-content {
  /* Asegura que el contenido no se superponga con el header */
  padding-top: var(--header-height);
}
</style>


