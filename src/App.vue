<template>
  <div id="app">
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

    <footer class="u-align-center u-footer u-grey-80">
      <div class="u-sheet u-sheet-1">
        <p class="u-text">Diseñado por Esther Daza</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import './assets/nicepage.css';
@import './assets/index.css';
</style>
