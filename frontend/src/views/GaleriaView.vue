<template>
  <div class="galeria-page">
    <FondoDinamico />
    <div class="galeria-container">
      <div class="carousel" v-if="carouselImages.length > 0">
        <img
          :src="carouselImages[currentIndex].imageUrl"
          :alt="carouselImages[currentIndex].title"
          class="carousel-img"
          @click="verDetalles(carouselImages[currentIndex].id)"
        />
        <div class="carousel-info">
          <div class="carousel-title">
            {{ carouselImages[currentIndex].title }}
          </div>
          <div class="carousel-artist">
            {{ carouselImages[currentIndex].artist }}
          </div>
        </div>
        <div class="carousel-controls">
          <button @click="prevImage" aria-label="Anterior imagen">
            &#10094;
          </button>
          <button @click="nextImage" aria-label="Siguiente imagen">
            &#10095;
          </button>
        </div>
      </div>

      <div class="search-bar">
        <input
          type="text"
          v-model="busqueda"
          placeholder="Buscar por título, artista o descripción..."
          @input="resetFilters"
        />
        <select v-model="filtroPeriodo" @change="aplicarFiltros">
          <option value="">Todos los períodos</option>
          <option
            v-for="periodo in periodosUnicos"
            :key="periodo"
            :value="periodo"
          >
            {{ periodo }}
          </option>
        </select>
        <select v-model="filtroCategoria" @change="aplicarFiltros">
          <option value="">Todas las categorías</option>
          <option value="mis-favoritos">Mis favoritos</option>
          <option
            v-for="categoria in categoriasUnicas"
            :key="categoria"
            :value="categoria"
          >
            {{ categoria }}
          </option>
        </select>
        <button @click="limpiarFiltros">Limpiar Filtros</button>
      </div>

      <div v-if="isLoading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Cargando obras...</p>
      </div>
      <div v-else-if="error" class="error-message">
        <p>Error al cargar las obras: {{ error }}</p>
        <button @click="cargarObras">Reintentar</button>
      </div>
      <div v-else class="gallery-grid">
        <div
          class="gallery-item"
          v-for="obra in obrasFiltradas"
          :key="obra.id"
        >
          <button
    v-if="isAdmin"
    @click="eliminarHecho(obra.id)"
    title="Eliminar obra"
    class="btn-eliminar-obra"
  >
    &minus;
  </button>
          <img
            :src="obra.imageUrl"
            :alt="obra.title"
            class="gallery-item-img"
            @click="verDetalles(obra.id)"
          />
          <div class="gallery-item-info">
            <h3>
              {{ obra.title }}
              <span
                class="estrella"
                :title="obra.esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'"
                @click.stop="toggleFavorito(obra)"
              >
                {{ obra.esFavorito ? '★' : '☆' }}
              </span>
            </h3>
            <p>{{ obra.artist }}</p>
            <p class="description">
              {{ truncateDescription(obra.description) }}
            </p>
            <div class="share-buttons">
              <button @click="compartirEnFacebook(obra)">🔵</button>
              <button @click="compartirEnTwitter(obra)">🐦</button>
              <button @click="compartirEnWhatsApp(obra)">🟢</button>
            </div>
          </div>
        </div>
        <p
          v-if="obrasFiltradas.length === 0 && !isLoading && !error"
          class="no-results"
        >
          No se encontraron obras con los filtros aplicados.
        </p>
      </div>
      <button
  v-if="isAdmin"
  class="boton-flotante"
  @click="$router.push('/agregar-hecho')"
>
  +
</button>
    </div>

    <div class="modal-overlay" v-if="mostrarModal" @click.self="cerrarModal">
      <div class="modal-content" v-if="obraSeleccionada">
        <button class="modal-close-button" @click="cerrarModal">&times;</button>
        <h2>{{ obraSeleccionada.title }}</h2>
        <p><strong>Artista:</strong> {{ obraSeleccionada.artist }}</p>
        <p><strong>Período:</strong> {{ obraSeleccionada.period }}</p>
        <p><strong>Categoría:</strong> {{ obraSeleccionada.category }}</p>
        <p class="modal-description">{{ obraSeleccionada.description }}</p>

        <div class="model-viewer-container" v-if="obraSeleccionada.model3DUrl">
          <model-viewer
            ref="modelViewer"
            :src="obraSeleccionada.model3DUrl"
            alt="Modelo 3D de la obra"
            ar
            ar-modes="webxr quick-look scene-viewer"
            shadow-intensity="1"
            camera-controls
            touch-action="pan-y"
            interaction-prompt="auto"
            auto-rotate
            exposure="1"
          ></model-viewer>
          <div class="slider-controls">
            <button
              @click="setCameraOrbit('0deg 75deg 105%')"
              class="view-button"
            >
              Vista Frontal
            </button>
            <button
              @click="setCameraOrbit('-90deg 75deg 105%')"
              class="view-button"
            >
              Vista Lateral
            </button>
            <button
              @click="setCameraOrbit('90deg 75deg 105%')"
              class="view-button"
            >
              Vista Trasera
            </button>
            <button
              @click="setCameraOrbit('45deg 55deg 105%')"
              class="view-button"
            >
              Vista Diag.
            </button>
          </div>
        </div>
        <img
          :src="obraSeleccionada.imageUrl"
          :alt="obraSeleccionada.title"
          class="modal-img"
          v-else
        />
      </div>
    </div>
  </div>
</template>

<!-- <script>
import FondoDinamico from "@/components/FondoDinamico.vue";
import "@google/model-viewer"; // Importa el componente web de model-viewer

export default {
  name: "GaleriaView",
  components: {
    FondoDinamico,
  },
  data() {
    return {
      obras: [], // Todas las obras cargadas
      carouselImages: [], // Solo las obras para el carrusel
      currentIndex: 0,
      busqueda: "",
      filtroPeriodo: "",
      filtroCategoria: "",
      mostrarModal: false,
      obraSeleccionada: null,
      isLoading: false,
      error: null,
    };
  },
  computed: {
    // Filtra las obras basadas en la búsqueda y los filtros
    obrasFiltradas() {
      let filtered = this.obras;

      if (this.busqueda) {
        const busquedaLower = this.busqueda.toLowerCase();
        filtered = filtered.filter(
          (obra) =>
            obra.title.toLowerCase().includes(busquedaLower) ||
            obra.artist.toLowerCase().includes(busquedaLower) ||
            obra.description.toLowerCase().includes(busquedaLower)
        );
      }

      if (this.filtroPeriodo) {
        filtered = filtered.filter(
          (obra) => obra.period === this.filtroPeriodo
        );
      }

      if (this.filtroCategoria) {
        filtered = filtered.filter(
          (obra) => obra.category === this.filtroCategoria
        );
      }
      return filtered;
    },
    periodosUnicos() {
      const periodos = new Set(this.obras.map((obra) => obra.period));
      return [...periodos].sort();
    },
    categoriasUnicas() {
      const categorias = new Set(this.obras.map((obra) => obra.category));
      return [...categorias].sort();
    },
  },
  methods: {
    truncateDescription(description, maxLength = 100) {
      if (description.length > maxLength) {
        return description.substring(0, maxLength) + "...";
      }
      return description;
    },
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.carouselImages.length;
    },
    prevImage() {
      this.currentIndex =
        (this.currentIndex - 1 + this.carouselImages.length) %
        this.carouselImages.length;
    },
    resetFilters() {
      // Al buscar, limpia los filtros de selección para evitar conflictos
      this.filtroPeriodo = "";
      this.filtroCategoria = "";
    },
    aplicarFiltros() {
      // Re-aplica los filtros si se cambian las selecciones
    },
    limpiarFiltros() {
      this.busqueda = "";
      this.filtroPeriodo = "";
      this.filtroCategoria = "";
    },
async cargarObras() {
  this.isLoading = true;
  this.error = null;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/hechos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("No se pudieron cargar los hechos históricos");

    const hechos = await response.json();

    this.obras = hechos.map(h => ({
      id: h.id,
      title: h.title,
      artist: h.artist || "Anónimo",
      imageUrl: h.image || "",               // imagen_url
      description: h.description,
      period: h.period || "Desconocido",
      category: h.category || "Sin categoría",
      model3DUrl: h.coordinates3D || ""      // modelo_3d_url
    }));

    this.carouselImages = this.obras.slice(0, 3); // carrusel = primeros 3
  } catch (err) {
    this.error = err.message;
  } finally {
    this.isLoading = false;
  }},
    verDetalles(id) {
      this.obraSeleccionada = this.obras.find((obra) => obra.id === id);
      if (this.obraSeleccionada) {
        this.mostrarModal = true;
        this.$nextTick(() => {
          if (this.$refs.modelViewer) {
            this.$refs.modelViewer.cameraOrbit = "0deg 75deg 105%";
          }
        });
      }
    },   // ⛔ aquí falta una coma
    cerrarModal() {
      this.mostrarModal = false;
      this.obraSeleccionada = null;
    },
    setCameraOrbit(orbitValue) {
      if (this.$refs.modelViewer) {
        this.$refs.modelViewer.cameraOrbit = orbitValue;
      }
    }
  },
  created() {
    this.cargarObras();
  }
}
</script> -->

<script>
import FondoDinamico from "@/components/FondoDinamico.vue";
import { mapGetters } from "vuex";
import "@google/model-viewer";

export default {
  name: "GaleriaView",
  components: {
    FondoDinamico,
  },
  data() {
    return {
      obras: [],
      favoritosIds: [],
      carouselImages: [],
      currentIndex: 0,
      busqueda: "",
      filtroPeriodo: "",
      filtroCategoria: "",
      mostrarModal: false,
      obraSeleccionada: null,
      isLoading: false,
      error: null,
    };
  },
  computed: {
    ...mapGetters({ user: "currentUser" }),
    isAdmin() {
      return this.user?.id_rol === 1;
    },
    obrasFiltradas() {
      let filtered = this.obras;

      if (this.filtroCategoria === "mis-favoritos") {
        if (!this.estaAutenticado()) {
          return [];
        }
        filtered = filtered.filter((obra) => obra.esFavorito);
      }

      if (this.busqueda) {
        const busquedaLower = this.busqueda.toLowerCase();
        filtered = filtered.filter(
          (obra) =>
            obra.title.toLowerCase().includes(busquedaLower) ||
            obra.artist.toLowerCase().includes(busquedaLower) ||
            obra.description.toLowerCase().includes(busquedaLower)
        );
      }

      if (this.filtroPeriodo) {
        filtered = filtered.filter(
          (obra) => obra.period === this.filtroPeriodo
        );
      }

      if (
        this.filtroCategoria &&
        this.filtroCategoria !== "mis-favoritos"
      ) {
        filtered = filtered.filter(
          (obra) => obra.category === this.filtroCategoria
        );
      }

      return filtered;
    },
    periodosUnicos() {
      const periodos = new Set(this.obras.map((obra) => obra.period));
      return [...periodos].sort();
    },
    categoriasUnicas() {
      const categorias = new Set(this.obras.map((obra) => obra.category));
      return [...categorias].sort();
    },
  },
  methods: {
        async eliminarHecho(id) {
      if (!confirm("¿Seguro que deseas eliminar este hecho?")) return;
      try {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:3000/api/hechos/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        this.obras = this.obras.filter((o) => o.id !== id);
      } catch (err) {
        alert("Error al eliminar la obra.");
      }
    },
    estaAutenticado() {
      return !!localStorage.getItem("token");
    },
compartirEnFacebook(obra) {
  const texto = `${obra.title} - ${obra.artist}\n${obra.description}`;
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(obra.imageUrl)}&quote=${encodeURIComponent(texto)}`;
  window.open(url, "_blank");
},

compartirEnTwitter(obra) {
  const texto = `${obra.title} - ${obra.artist}: ${obra.description}`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(obra.imageUrl)}`;
  window.open(url, "_blank");
},

compartirEnWhatsApp(obra) {
  const texto = `${obra.title} - ${obra.artist}\n${obra.description}\n${obra.imageUrl}`;
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank");
},
    truncateDescription(description, maxLength = 100) {
      return description.length > maxLength
        ? description.substring(0, maxLength) + "..."
        : description;
    },
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.carouselImages.length;
    },
    prevImage() {
      this.currentIndex =
        (this.currentIndex - 1 + this.carouselImages.length) %
        this.carouselImages.length;
    },
    resetFilters() {
      this.filtroPeriodo = "";
      this.filtroCategoria = "";
    },
    aplicarFiltros() {},
    limpiarFiltros() {
      this.busqueda = "";
      this.filtroPeriodo = "";
      this.filtroCategoria = "";
    },
    async cargarObras() {
  this.isLoading = true;
  this.error = null;
  const token = localStorage.getItem("token");

  try {
    // ✅ Solo enviar el header Authorization si hay token
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch("http://localhost:3000/api/hechos", {
      headers,
    });

    if (!response.ok) throw new Error("No se pudieron cargar los hechos");

    const hechos = await response.json();

    let favoritos = [];
    if (token) {
      const favRes = await fetch("http://localhost:3000/api/favoritos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (favRes.ok) {
        const favData = await favRes.json();
        favoritos = favData.map((f) => f.id);
      }
    }

    this.favoritosIds = favoritos;
    this.obras = hechos.map((h) => ({
      id: h.id,
      title: h.title,
      artist: h.artist || "Anónimo",
      imageUrl: h.image || "",
      description: h.description,
      period: h.period || "Desconocido",
      category: h.category || "Sin categoría",
      model3DUrl: h.coordinates3D || "",
      esFavorito: favoritos.includes(h.id),
    }));

    this.carouselImages = this.obras.slice(0, 3);
  } catch (err) {
    this.error = err.message;
  } finally {
    this.isLoading = false;
  }
},
    async cargarFavoritos() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("http://localhost:3000/api/favoritos", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("No se pudieron cargar los favoritos");

    const data = await res.json();
    this.favoritosIds = data.map((f) => f.id);
  } catch (err) {
    console.error("Error al cargar favoritos:", err.message);
  }
},
async toggleFavorito(obra) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Debes iniciar sesión para usar favoritos");
    return;
  }

  try {
    let response;

    if (obra.esFavorito) {
      // Eliminar favorito (sin body)
      response = await fetch(`http://localhost:3000/api/favoritos/${obra.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      // Agregar favorito (con body)
      response = await fetch("http://localhost:3000/api/favoritos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_hecho: obra.id }),
      });
    }

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Error al modificar favorito");
    }

    obra.esFavorito = !obra.esFavorito;
  } catch (err) {
    alert(err.message);
  }
},
    verDetalles(id) {
      this.obraSeleccionada = this.obras.find((obra) => obra.id === id);
      if (this.obraSeleccionada) {
        this.mostrarModal = true;
        this.$nextTick(() => {
          if (this.$refs.modelViewer) {
            this.$refs.modelViewer.cameraOrbit = "0deg 75deg 105%";
          }
        });
      }
    },
    cerrarModal() {
      this.mostrarModal = false;
      this.obraSeleccionada = null;
    },
    setCameraOrbit(orbitValue) {
      if (this.$refs.modelViewer) {
        this.$refs.modelViewer.cameraOrbit = orbitValue;
      }
    },
  },
  created() {
    this.cargarObras();
    console.log("🧠 Usuario logueado:", this.user);
  },
};
</script>

<style scoped>
 .share-buttons {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  justify-content: flex-start;
}

.share-buttons button {
  background-color: #e0e0e0;
  color: #333;
  font-size: 1.2rem;
  padding: 6px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.share-buttons button:hover {
  background-color: #c7c7c7;
}
/* Estilos generales de la galería */
.galeria-page {
  position: relative;
  min-height: 100vh;
  padding-top: 60px; /* Para compensar el header fijo */
  box-sizing: border-box;
}

.galeria-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Carrusel */
.carousel {
  position: relative;
  width: 100%;
  height: 400px; /* Altura fija para el carrusel */
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  cursor: pointer;
}

.carousel-info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
  color: #fff;
  padding: 20px;
  box-sizing: border-box;
}

.carousel-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.carousel-artist {
  font-size: 1.2rem;
}

.carousel-controls {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  padding: 0 10px;
}

.carousel-controls button {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  padding: 10px 15px;
  font-size: 1.5rem;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.3s;
}

.carousel-controls button:hover {
  background: rgba(0, 0, 0, 0.8);
}

/* Buscador y filtros */
.search-bar {
  display: flex;
  flex-wrap: wrap; /* Permite que los elementos se envuelvan en líneas nuevas */
  gap: 15px; /* Espacio entre los elementos */
  margin-bottom: 30px;
  justify-content: center;
}

.search-bar input,
.search-bar select {
  flex: 1; /* Permite que los inputs y selects ocupen el espacio disponible */
  min-width: 200px; /* Ancho mínimo para cada elemento */
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.search-bar button {
  padding: 10px 20px;
  background-color: #4e342e;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.search-bar button:hover {
  background-color: #6d4c41;
}

/* Grid de la galería */
/* Grid de la galería */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  padding: 0;
}

.gallery-item {
  background-color: #fefcf3;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.gallery-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.gallery-item-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.gallery-item-info {
  padding: 15px;
  position: relative;

}

.gallery-item-info h3 {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 5px;
  color: #4e342e;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.gallery-item-info p {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  margin-top: 0;
}

.gallery-item-info .description {
  margin-top: 10px;
}

/* Estrella para favoritos */
.estrella {
  font-size: 1.4rem;
  color: #ff9800;
  cursor: pointer;
  margin-left: 10px;
  transition: transform 0.2s;
}

.estrella:hover {
  transform: scale(1.3);
}

/* Modal de detalles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fefcf3;
  padding: 30px;
  border-radius: 10px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.modal-close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #4e342e;
}

.modal-content h2 {
  font-size: 2.5rem;
  color: #4e342e;
  margin-bottom: 15px;
}

.modal-content p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 10px;
}

.modal-description {
  margin-top: 20px;
  font-style: italic;
  color: #555;
}

.modal-img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 20px auto;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Estilos de model-viewer */
.model-viewer-container {
  width: 100%;
  height: 400px; /* Altura deseada para el visor 3D */
  margin: 20px auto;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative; /* Para posicionar los controles */
}

model-viewer {
  width: 100%;
  height: 100%;
  --environment-image-filter: saturate(1.2); /* Ajusta el ambiente */
}

.slider-controls {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 8px 15px;
  border-radius: 20px;
}

.view-button {
  background-color: #795548; /* Color de botón relacionado con el tema */
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.view-button:hover {
  background-color: #5d4037;
}

/* Loading y error */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #4e342e;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  margin: 1rem;
  border-radius: 4px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.error-message button {
  margin-top: 10px;
  padding: 8px 15px;
  background-color: #c62828;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.no-results {
  text-align: center;
  color: #888;
  padding: 30px;
  font-style: italic;
}

.boton-flotante {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 15px 20px;
  font-size: 18px;
  border-radius: 50px;
  cursor: pointer;
  z-index: 999;
}

.btn-eliminar-obra {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: white;
  color: red;
  font-weight: bold;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 18px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  cursor: pointer;
  z-index: 10;
}

/* Responsividad para móviles */
@media (max-width: 768px) {
  .carousel {
    height: 300px;
  }

  .carousel-title {
    font-size: 1.5rem;
  }

  .carousel-artist {
    font-size: 1rem;
  }

  .search-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .gallery-item-img {
    height: 180px;
  }

  .modal-content {
    width: 95%;
    padding: 20px;
  }

  .modal-content h2 {
    font-size: 2rem;
  }

  .modal-content p {
    font-size: 1rem;
  }

  .model-viewer-container {
    height: 300px;
  }

  .slider-controls {
    flex-wrap: wrap; /* Permitir que los botones se envuelvan */
    justify-content: center;
    padding: 5px;
  }

  .view-button {
    padding: 6px 10px;
    font-size: 0.8rem;
  }

  /* ⭐ Estrella de favoritos */
.estrella {
  font-size: 1.4rem;
  color: #ff9800;
  cursor: pointer;
  margin-left: 10px;
  transition: transform 0.2s;
}

.estrella:hover {
  transform: scale(1.3);
}
}
</style>
