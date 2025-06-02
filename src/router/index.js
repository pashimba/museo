import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import LoginView from '../views/LoginView.vue'
import GaleriaView from '../views/GaleriaView.vue' // Asegúrate de que este es el nombre correcto del archivo
import RegistroView from '../views/RegistroView.vue'
import LineaDelTiempoView from '../views/LineaDelTiempoView.vue'
import DetalleObra from '../views/DetalleObra.vue' // Importa el nuevo componente DetalleObra

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
    path: '/linea-del-tiempo',
    name: 'LineaDelTiempo',
    component: LineaDelTiempoView
  },
  {
    path: '/detalle-obra/:id', // Ruta dinámica para los detalles de la obra
    name: 'DetalleObra',
    component: DetalleObra,
    props: true // Permite que el 'id' del parámetro de la ruta se pase como prop al componente
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
