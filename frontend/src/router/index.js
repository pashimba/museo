// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import GaleriaView from "../views/GaleriaView.vue";
import LineaDelTiempoView from "../views/LineaDelTiempoView.vue";
import LoginView from "../views/LoginView.vue";
import RegistroView from "../views/RegistroView.vue";
import NotFound from "../views/NotFound.vue"; // Crea este archivo si lo usas
import Museum3DView from "../views/Museum3DView.vue";
import CeramicsGalleryView from "../views/CeramicsGalleryView.vue";
import FaqView from "../views/FaqView.vue";
import JuegoBoliviaView from "../views/JuegoBoliviaView.vue";
import AgregarHechoView from "../views/AgregarHechoView.vue";
import GuiaView from "../views/GuiaView.vue";
const routes = [
  
  
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    // <-- AÑADE ESTA NUEVA RUTA
    path: "/ceramics-gallery",
    name: "ceramics-gallery",
    component: CeramicsGalleryView,
  },
  {
    path: "/galeria",
    name: "galeria",
    component: GaleriaView,
  },
  {
    path: "/faq",
    name: "faq",
    component: FaqView,
  },
  {
    path: "/lineadeltiempo",
    name: "lineadeltiempo",
    component: LineaDelTiempoView,
  },
  {
    path: "/guia",
    name: "guia",
    component: GuiaView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/juego",
    name: "juego",
    component: JuegoBoliviaView,
  },
  {
    // <-- ADD THIS NEW ROUTE
    path: "/museum-3d",
    name: "museum-3d",
    component: Museum3DView,
  },
  {
    path: "/registro",
    name: "registro",
    component: RegistroView,
  },
  // Ruta para el mapa interactivo (aún no hemos creado el componente)
  {
    path: "/mapa-interactivo",
    name: "mapa-interactivo",
    // lazy-load para optimizar la carga
    component: () =>
      import(/* webpackChunkName: "mapa" */ "../views/MapaInteractivoView.vue"),
  },
  // Catch-all para 404 (asegúrate de crear NotFound.vue)
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },

  {
  path: "/agregar-hecho",
  name: "agregar-hecho",
  component: AgregarHechoView,
  meta: { requiresAuth: true, requiresAdmin: true }
},
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
