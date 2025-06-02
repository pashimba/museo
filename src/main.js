import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@google/model-viewer'

// Configuración segura para Vue 3
const initVueApp = () => {
  const app = createApp(App)
  
  // Configuración mínima de plugins
  app.use(router)
  
  // Montaje seguro
  const appMount = () => {
    app.mount('#app')
    console.log('Vue app mounted successfully')
  }

  // Manejo de conflictos con devtools
  if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
    setTimeout(appMount, 300)
  } else {
    appMount()
  }
}

// Inicialización diferida para evitar conflictos
if (document.readyState === 'complete') {
  initVueApp()
} else {
  document.addEventListener('DOMContentLoaded', initVueApp)
}