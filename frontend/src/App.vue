<template>
  <div id="app">
    <!-- Componente de Bienvenida -->
    <BienvenidaComponent
      v-if="mostrarBienvenida"
      @animation-ended="mostrarBienvenida = false"
    />

    <!-- Contenido Principal de la Aplicación -->
    <div v-else class="main-content">
      <!-- Header y Navbar -->
      <header class="main-header" :class="{ scrolled: isScrolled }">
        <nav class="navbar">
          <div class="navbar-container">
            
            <router-link to="/" class="navbar-brand">Museo</router-link>

            <!-- Botón de Hamburguesa (Móvil) -->
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

            <!-- Enlaces de Navegación -->
            <div class="navbar-links" :class="{ 'is-active': isMenuOpen }">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <router-link class="nav-link" to="/">Inicio</router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/mapa-interactivo"
                    >Mapa Interactivo</router-link
                  >
                </li>
                <li class="nav-item">
                  <router-link class="nav-link" to="/ceramics-gallery"
                    >Cerámicas 3D</router-link
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
  <router-link
    v-if="!usuarioLogueado"
    class="nav-link auth-link"
    to="/login"
  >
    Iniciar Sesión
  </router-link>
  <button
    v-else
    class="nav-link auth-link"
    @click="cerrarSesion"
    style="background: none; border: none; cursor: pointer;"
  >
    Cerrar Sesión
  </button>
</li>
              </ul>
              <LanguageSwitcher />
            </div>
          </div>
        </nav>
      </header>

      <!-- Contenido de las Vistas -->
      <router-view />
    </div>

    <!-- Audio de Fondo -->
    <audio
      v-if="!mostrarBienvenida"
      :src="require('@/assets/fondo.mp3')"
      autoplay
      loop
    ></audio>
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
      isScrolled: false, // Estado para controlar el estilo del navbar al hacer scroll
      loginStatusFlag: 0,
    };
  },
  computed: {
  usuarioLogueado() {
    // loginStatusFlag se usa para hacer reactivo el acceso a localStorage
    this.loginStatusFlag;
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
cerrarSesion() {
  localStorage.removeItem("token");
  this.loginStatusFlag++; // Forzamos la reactividad
  this.$router.push("/");
},
    // Método para detectar el scroll y actualizar 'isScrolled'
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
  },
  watch: {
    // Cierra el menú móvil al cambiar de ruta
    $route() {
      this.closeMenu();
    },
  },
  // Ciclos de vida para añadir y limpiar el event listener del scroll
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    this.usuarioLogueado = !!localStorage.getItem('token');
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
}

body {
  margin: 0;
  font-family: "Avenir", "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
  color: #333;
}

#app {
  overflow-x: hidden;
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
  background-color: rgba(32, 29, 29, 0.358);
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
  background-color: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  color: var(--primary-text-color);
  text-decoration: none;
  /* Empuja los enlaces a la derecha en la vista de escritorio */
  margin-right: auto;
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
  color: var(--primary-text-color);
  text-decoration: none;
  font-size: 1rem;
  padding: 8px 0;
  position: relative;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--text-hover-color);
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
  color: var(--primary-text-color);
  font-weight: 600;
}

/* Botón de Iniciar Sesión */
.nav-link.auth-link {
  background-color: var(--accent-color);
  color: #111;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
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
  background-color: var(--primary-text-color);
  border-radius: 3px;
  transition: transform 0.3s ease, opacity 0.3s ease;
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
    background-color: rgba(20, 20, 20, 0.98);
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
}
</style>
