// src/store/index.js
import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    user: JSON.parse(localStorage.getItem("user")) || null,  // ✅ Cargar user del localStorage
    isAuthenticated: !!localStorage.getItem("user"),         // ✅ Estado persistente
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
    async login({ commit }, { email, password }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const res = await axios.post("http://localhost:3000/api/auth/login", {
          correo: email,
          contrasenia: password,
        });

        const { token, user } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user)); // ✅ Guardar user
        commit("SET_USER", user);
        return true;
      } catch (err) {
        const msg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Error al iniciar sesión.";
        commit("SET_ERROR", msg);
        return false;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    logout({ commit }) {
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // ✅ Limpiar también el user
      commit("CLEAR_AUTH_STATE");
    },

    async register({ commit }, { displayName, email, password }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        await axios.post("http://localhost:3000/api/auth/register", {
          nombre: displayName,
          correo: email,
          contrasenia: password,
        });

        return true;
      } catch (err) {
        const msg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          (err.response?.data?.errors?.[0]?.msg ?? "Error al registrar usuario.");
        commit("SET_ERROR", msg);
        return false;
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