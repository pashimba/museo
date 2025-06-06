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
          @click="verDetalles(obra.id)"
        >
          <img
            :src="obra.imageUrl"
            :alt="obra.title"
            class="gallery-item-img"
          />
          <div class="gallery-item-info">
            <h3>{{ obra.title }}</h3>
            <p>{{ obra.artist }}</p>
            <p class="description">
              {{ truncateDescription(obra.description) }}
            </p>
          </div>
        </div>
        <p
          v-if="obrasFiltradas.length === 0 && !isLoading && !error"
          class="no-results"
        >
          No se encontraron obras con los filtros aplicados.
        </p>
      </div>
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

<script>
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
        // Simula una llamada a una API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Datos de ejemplo para las obras
        this.obras = [
          {
            id: 1,
            title: "La Mona Lisa",
            artist: "Leonardo da Vinci",
            imageUrl:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
            description: "Retrato icónico del Renacimiento italiano.",
            period: "Renacimiento",
            category: "Pintura",
            model3DUrl: "", // No hay modelo 3D para este ejemplo
          },
          {
            id: 2,
            title: "El Pensador",
            artist: "Auguste Rodin",
            imageUrl:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Auguste_Rodin_-_The_Thinker_-_Walters_275211.jpg/800px-Auguste_Rodin_-_The_Thinker_-_Walters_275211.jpg",
            description: "Escultura de bronce de un hombre meditando.",
            period: "Impresionismo",
            category: "Escultura",
            model3DUrl:
              "https://modelviewer.dev/shared-assets/models/Astronaut.glb", // Ejemplo de modelo 3D
          },
          {
            id: 3,
            title: "La Noche Estrellada",
            artist: "Vincent van Gogh",
            imageUrl:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
            description:
              "Paisaje nocturno de un pueblo bajo un cielo arremolinado.",
            period: "Post-impresionismo",
            category: "Pintura",
            model3DUrl: "",
          },
          {
            id: 4,
            title: "La Venus de Milo",
            artist: "Antigua Grecia (atribuida a Alexandros de Antioquía)",
            imageUrl:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Venus_de_Milo_Louvre_Ma399_n2.jpg/800px-Venus_de_Milo_Louvre_Ma399_n2.jpg",
            description: "Estatua griega de mármol de Afrodita.",
            period: "Helenístico",
            category: "Escultura",
            model3DUrl:
              "https://modelviewer.dev/shared-assets/models/BrainStem.glb", // Otro ejemplo de modelo 3D
          },
          {
            id: 5,
            title: "Guernica",
            artist: "Pablo Picasso",
            imageUrl:
              "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/PicassoGuernica.jpg/800px-PicassoGuernica.jpg",
            description:
              "Representa el bombardeo de Guernica durante la Guerra Civil Española.",
            period: "Cubismo",
            category: "Pintura",
            model3DUrl: "",
          },
        ];

        // Selecciona algunas obras para el carrusel (ej. las primeras 3)
        this.carouselImages = this.obras.slice(0, 3);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
    verDetalles(id) {
      this.obraSeleccionada = this.obras.find((obra) => obra.id === id);
      if (this.obraSeleccionada) {
        this.mostrarModal = true;
        // Si hay un modelo 3D, asegúrate de que el model-viewer esté cargado
        // y puedes configurar la vista inicial aquí si es necesario.
        this.$nextTick(() => {
          if (this.$refs.modelViewer) {
            this.$refs.modelViewer.cameraOrbit = "0deg 75deg 105%"; // Vista inicial por defecto
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
  },
};
</script>

<style scoped>
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
}

.gallery-item-info h3 {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 5px;
  color: #4e342e;
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
}
</style>
