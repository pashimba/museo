import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import LoginView from '../views/LoginView.vue'
import GaleriaView from '../views/GaleriaView.vue'
import RegistroView from '../views/RegistroView.vue'
import LineaDelTiempoView from '../views/LineaDelTiempoView.vue' // 👈 Importación nueva

const routes = [
  {
    path: '/',
    name: 'Home',
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
    path: '/linea-del-tiempo',               // 👈 Ruta nueva
    name: 'LineaDelTiempo',
    component: LineaDelTiempoView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
