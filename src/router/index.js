import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue' // Corrected: Using Home.vue as per your original
import LoginView from '../views/LoginView.vue'
import GaleriaView from '../views/GaleriaView.vue'
import RegistroView from '../views/RegistroView.vue'
import LineaDelTiempoView from '../views/LineaDelTiempoView.vue'
import GameView from '../views/GameView.vue' // New: Import for the game page

const routes = [
  {
    path: '/',
    name: 'Home', // Aligned with your original: 'Home'
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/galeria',
    name: 'Galeria',
    component: GaleriaView
  },
  {
    path: '/registro',
    name: 'registro',
    component: RegistroView
  },
  {
    path: '/linea-del-tiempo',
    name: 'LineaDelTiempo',
    component: LineaDelTiempoView
  },
  {
    path: '/juego', // New: Route for the game page
    name: 'Juego', // Name for the game route
    component: GameView
  }
]

const router = createRouter({
  history: createWebHistory(), // Aligned with your original
  routes
})

export default router