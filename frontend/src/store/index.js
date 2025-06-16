// src/store/index.js
import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    user: null,
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
    async login({ commit }, { email, password }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const res = await axios.post("http://localhost:3000/api/auth/login", {
          correo: email,        // nombre de campo esperado por backend
          contrasenia: password // nombre de campo esperado por backend
        });

        const { token, user } = res.data;

        localStorage.setItem("token", token);  // guardar token
        commit("SET_USER", user);              // guardar usuario en estado
        return true;
      } catch (err) {
        const msg =
          err.response?.data?.error ||      // <-- capturar errores del backend
          err.response?.data?.message ||
          "Error al iniciar sesión.";
        commit("SET_ERROR", msg);
        return false;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    logout({ commit }) {
      localStorage.removeItem("token"); // eliminar token
      commit("CLEAR_AUTH_STATE");
    },

    async register({ commit }, { displayName, email, password }) {
  commit("SET_LOADING", true);
  commit("SET_ERROR", null);
  try {
    await axios.post("http://localhost:3000/api/auth/register", {
      nombre: displayName,
      correo: email,
      contrasenia: password
    });

    return true; // si quieres guardar usuario, puedes usar response.data.user
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
}
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
    isLoading: (state) => state.loading,
    authError: (state) => state.error,
  },
});