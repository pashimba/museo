import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'     // nombre del componente será HomeView
import LoginView from '../views/LoginView.vue'
import GaleriaView from '../views/GaleriaView.vue'
import RegistroView from '../views/RegistroView.vue'
import TestView from '../views/TestView.vue'
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
    path: '/test',
    name: 'test',
    component: TestView
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
