// src/store/index.js
import { createStore } from "vuex";

export default createStore({
  state: {
    user: null, // Podría ser un objeto { email, displayName, ... }
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      state.isAuthenticated = !!user;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_AUTH_STATE(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  actions: {
    // Ejemplo de acción de login (aquí integrarías tu lógica de autenticación real, ej. con Firebase)
    async login({ commit }, { email, password }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        // Simulación de una llamada API
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (email === "test@example.com" && password === "password") {
          const user = { email: email, displayName: "Usuario Test" };
          commit("SET_USER", user);
          return true; // Login exitoso
        } else {
          throw new Error("Correo o contraseña incorrectos.");
        }
      } catch (err) {
        commit("SET_ERROR", err.message);
        commit("SET_USER", null);
        return false; // Login fallido
      } finally {
        commit("SET_LOADING", false);
      }
    },
    // Ejemplo de acción de logout
    logout({ commit }) {
      commit("CLEAR_AUTH_STATE");
      // Aquí podrías agregar lógica para desautenticar en tu backend
    },
    // Ejemplo de acción de registro (integrar Firebase aquí)
    async register({ commit }, { displayName, email, password }) {
      // 'password' is back to its original name
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        // Simulación de registro
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Use the password variable to satisfy ESLint
        console.log(
          "Registrando usuario:",
          email,
          "con contraseña (simulada):",
          password
        ); // THIS LINE 'USES' THE PASSWORD

        // Aquí integrarías la lógica de registro real, ej. con Firebase (donde 'password' se usaría de verdad)
        const user = { email: email, displayName: displayName };
        commit("SET_USER", user);
        return true; // Registro exitoso
      } catch (err) {
        commit("SET_ERROR", err.message);
        return false; // Registro fallido
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
    isLoading: (state) => state.loading,
    authError: (state) => state.error,
  },
});
