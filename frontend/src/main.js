import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/main.css";
import i18n from "./i18n";

//Cargar usuario guardado del localStorage al store
const savedUser = JSON.parse(localStorage.getItem("user"));
if (savedUser) {
  store.commit("SET_USER", savedUser);
}

createApp(App).use(store).use(router).use(i18n).mount("#app");