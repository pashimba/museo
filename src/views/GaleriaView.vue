<template>
  <div class="galeria-container">
    <FondoDinamico /> 
  </div>
  <div class="galeria-container">
    <div class="carousel" v-if="carouselImages.length > 0">
      <img 
        :src="carouselImages[currentIndex].imageUrl" 
        :alt="carouselImages[currentIndex].title" 
        class="carousel-img" 
        @click="verDetalles(carouselImages[currentIndex].id)"
      />
      <div class="carousel-info">
        <div class="carousel-title">{{ carouselImages[currentIndex].title }}</div>
        <div class="carousel-artist">{{ carouselImages[currentIndex].artist }}</div>
      </div>
      <div class="carousel-controls">
        <button @click="prevImage" aria-label="Anterior imagen">&#10094;</button>
        <button @click="nextImage" aria-label="Siguiente imagen">&#10095;</button>
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
        <option v-for="periodo in periodosUnicos" :key="periodo" :value="periodo">{{ periodo }}</option>
      </select>
      <select v-model="filtroTipo" @change="aplicarFiltros">
        <option value="">Todos los tipos</option>
        <option v-for="tipo in tiposUnicos" :key="tipo" :value="tipo">{{ tipo }}</option>
      </select>
      <button @click="limpiarFiltros">Limpiar Filtros</button>
    </div>

    <div class="gallery">
      <div v-if="isLoading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Cargando obras de arte...</p>
      </div>

      <div v-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
        <button @click="cargarObras">Reintentar</button>
      </div>

      <div v-if="!isLoading && !errorMessage && filteredObras.length === 0" class="no-results">
        <p>No se encontraron obras que coincidan con su búsqueda o filtros.</p>
      </div>

      <div class="gallery-grid">
        <div v-for="obra in filteredObras" :key="obra.id" class="gallery-item">
          <img :src="obra.imageUrl" :alt="obra.title" class="gallery-item-img" @click="verDetalles(obra.id)" />
          <div class="gallery-item-info">
            <h3>{{ obra.title }}</h3>
            <p class="artist">{{ obra.artist }}</p>
            <p class="description">{{ truncateDescription(obra.description) }}</p>
            <button class="details-button" @click="verDetalles(obra.id)">Ver Detalles</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-content">
        <span class="close-button" @click="cerrarModal">&times;</span>
        <h2>{{ obraSeleccionada.title }}</h2>
        <p class="modal-artist">{{ obraSeleccionada.artist }}</p>
        <img :src="obraSeleccionada.imageUrl" :alt="obraSeleccionada.title" class="modal-img" />
        <p class="modal-description">{{ obraSeleccionada.description }}</p>
        <p class="modal-details">
          <strong>Período:</strong> {{ obraSeleccionada.period }} <br />
          <strong>Tipo:</strong> {{ obraSeleccionada.type }} <br />
          <strong>Año:</strong> {{ obraSeleccionada.year }}
        </p>

        <div v-if="obraSeleccionada.model3dUrl" class="model-viewer-container">
          <h3>Vista 3D Interactiva</h3>
          <model-viewer
            :src="obraSeleccionada.model3dUrl"
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            shadow-intensity="1"
            alt="Modelo 3D de la obra"
            class="main-model-viewer"
          >
            <template v-slot:hotspot-1>
                <button data-position="0.5 0.2 0.8" data-normal="0 1 0" data-visibility-attribute="visible" class="hotspot" @click="showHotspotInfo('hotspot1')">
                    <div class="hotspot-label">Objeto Antiguo</div>
                </button>
            </template>
            <template v-slot:hotspot-2>
                <button data-position="-0.3 0.4 -0.6" data-normal="0 1 0" data-visibility-attribute="visible" class="hotspot" @click="showHotspotInfo('hotspot2')">
                    <div class="hotspot-label">Arte Colonial</div>
                </button>
            </template>
            <template v-slot:custom-dim>
                <div class="dim"></div>
            </template>
            <template v-slot:controls>
                <div class="slider">
                    <div class="slider-controls">
                        <button @click="modelViewer?.cameraOrbit='0deg 75deg 105%'" class="view-button">Vista Frontal</button>
                        <button @click="modelViewer?.cameraOrbit='-90deg 75deg 105%'" class="view-button">Vista Lateral</button>
                        <button @click="modelViewer?.cameraOrbit='90deg 75deg 105%'" class="view-button">Vista Trasera</button>
                    </div>
                </div>
            </template>
          </model-viewer>
          <div v-if="currentHotspotInfo" class="hotspot-info">
            <h4>{{ currentHotspotInfo.title }}</h4>
            <p>{{ currentHotspotInfo.description }}</p>
            <button @click="hideHotspotInfo">Cerrar</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import '@google/model-viewer'; // Importa el componente web 'model-viewer'
import FondoDinamico from '@/components/FondoDinamico.vue'; // Asegúrate de que la ruta sea correcta

export default {
  name: 'GaleriaView',
  components: {
    FondoDinamico,
  },
  data() {
    return {
      obras: [],
      carouselImages: [],
      currentIndex: 0,
      mostrarModal: false,
      obraSeleccionada: null,
      busqueda: '',
      filtroPeriodo: '',
      filtroTipo: '',
      isLoading: false,
      errorMessage: '',
      hotspotData: {
        hotspot1: { title: 'Punto de interés 1', description: 'Descripción detallada del punto 1.' },
        hotspot2: { title: 'Punto de interés 2', description: 'Descripción detallada del punto 2.' },
      },
      currentHotspotInfo: null,
      modelViewer: null, // Referencia al componente model-viewer
    };
  },
  computed: {
    periodosUnicos() {
      const periodos = new Set(this.obras.map(obra => obra.period));
      return [...periodos].sort();
    },
    tiposUnicos() {
      const tipos = new Set(this.obras.map(obra => obra.type));
      return [...tipos].sort();
    },
    filteredObras() {
      let filtered = this.obras;

      if (this.busqueda) {
        const lowerBusqueda = this.busqueda.toLowerCase();
        filtered = filtered.filter(obra =>
          obra.title.toLowerCase().includes(lowerBusqueda) ||
          obra.artist.toLowerCase().includes(lowerBusqueda) ||
          obra.description.toLowerCase().includes(lowerBusqueda)
        );
      }

      if (this.filtroPeriodo) {
        filtered = filtered.filter(obra => obra.period === this.filtroPeriodo);
      }

      if (this.filtroTipo) {
        filtered = filtered.filter(obra => obra.type === this.filtroTipo);
      }

      return filtered;
    },
  },
  methods: {
    async cargarObras() {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        // Simulación de carga de datos
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.obras = [
          {
            id: '1',
            title: 'Máscara Ritual Andina',
            artist: 'Cultura Tiwanaku',
            description: 'Máscara ceremonial tallada en piedra, utilizada en rituales ancestrales para conectar con las deidades y espíritus de la naturaleza. Representa la cosmovisión andina y la profunda espiritualidad de sus creadores. Se caracteriza por sus detalles intrincados y simbolismo profundo.',
            imageUrl: 'https://cdn.shopify.com/s/files/1/0259/3499/2813/products/mascara-ritual.jpg?v=1602931818',
            period: 'Precolombino',
            type: 'Escultura',
            year: '600-900 d.C.',
            model3dUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb' // Ejemplo de modelo 3D
          },
          {
            id: '2',
            title: 'El Sacrificio de Isaac',
            artist: 'Melchor Pérez de Holguín',
            description: 'Pintura barroca que representa el pasaje bíblico del sacrificio de Isaac. Obra maestra del renombrado pintor colonial boliviano, destacada por su dramática composición, el uso magistral de la luz y la sombra (claroscuro), y la intensidad emocional de los personajes, elementos característicos del estilo barroco. Se encuentra en la Casa Nacional de Moneda en Potosí.',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Melchor_P%C3%A9rez_de_Holgu%C3%ADn_-_El_sacrificio_de_Isaac.jpg',
            period: 'Colonial',
            type: 'Pintura',
            year: 'c. 1700',
            model3dUrl: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb' // Otro ejemplo de modelo 3D
          },
          {
            id: '3',
            title: 'Puerta del Sol',
            artist: 'Cultura Tiwanaku',
            description: 'Monolito de piedra que forma parte de la antigua ciudad de Tiwanaku. Es una de las estructuras más emblemáticas y enigmáticas de la arqueología andina, con intrincados grabados que posiblemente representan un calendario astronómico y deidades importantes. Su precisión y simbolismo han fascinado a historiadores y arqueólogos por siglos.',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Tiwanaku_-_Puerta_del_Sol.jpg',
            period: 'Precolombino',
            type: 'Arquitectura',
            year: '400-800 d.C.'
          },
          {
            id: '4',
            title: 'Virgen del Cerro',
            artist: 'Maestro de Calamarca (José López de los Ríos)',
            description: 'Icono del arte colonial en Bolivia, representando a la Virgen María fusionada con el Cerro Rico de Potosí. Esta obra simboliza la sincretización de la fe católica y las creencias andinas, mostrando la Pachamama (Madre Tierra) en la figura de la Virgen. Es un ejemplo clave del arte virreinal que integraba elementos indígenas.',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Virgen_del_Cerro.jpg',
            period: 'Colonial',
            type: 'Pintura',
            year: 'c. 1740'
          },
          {
            id: '5',
            title: 'Textil Paracas',
            artist: 'Cultura Paracas',
            description: 'Fragmento de un textil funerario precolombino de la cultura Paracas, conocido por sus vibrantes colores y complejos diseños que a menudo representan figuras zoomorfas y antropomorfas con gran detalle. Los textiles Paracas son testimonio de la avanzada técnica textil y la rica cosmovisión de esta cultura andina, siendo a menudo encontrados en fardos funerarios.',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Paracas_textile_fragment%2C_Peru%2C_100BC-200AD%2C_cotton_and_camelid_fibres_-_Museu_Calouste_Gulbenkian%2C_Lisbon_-_DSC06990.JPG',
            period: 'Precolombino',
            type: 'Textil',
            year: '200 a.C. - 200 d.C.'
          }
        ];
        this.carouselImages = [...this.obras]; // Inicializa las imágenes del carrusel
      } catch (error) {
        console.error("Error cargando obras:", error);
        this.errorMessage = "No se pudieron cargar las obras de arte. Intente de nuevo más tarde.";
      } finally {
        this.isLoading = false;
      }
    },
    truncateDescription(description) {
      if (description.length > 150) {
        return description.substring(0, 150) + '...';
      }
      return description;
    },
    verDetalles(id) {
      this.obraSeleccionada = this.obras.find(obra => obra.id === id);
      this.mostrarModal = true;
      if (this.obraSeleccionada && this.obraSeleccionada.model3dUrl) {
        // Asegúrate de que model-viewer haya sido cargado antes de acceder a sus propiedades
        this.$nextTick(() => {
          this.modelViewer = document.querySelector('.main-model-viewer');
        });
      }
    },
    cerrarModal() {
      this.mostrarModal = false;
      this.obraSeleccionada = null;
      this.currentHotspotInfo = null; // Reinicia la info del hotspot al cerrar el modal
      this.modelViewer = null; // Limpia la referencia
    },
    prevImage() {
      this.currentIndex = (this.currentIndex - 1 + this.carouselImages.length) % this.carouselImages.length;
    },
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.carouselImages.length;
    },
    aplicarFiltros() {
      // Los filtros se aplican automáticamente a través de la propiedad computada `filteredObras`
    },
    resetFilters() {
      this.filtroPeriodo = '';
      this.filtroTipo = '';
    },
    limpiarFiltros() {
      this.busqueda = '';
      this.filtroPeriodo = '';
      this.filtroTipo = '';
    },
    showHotspotInfo(hotspotKey) {
      this.currentHotspotInfo = this.hotspotData[hotspotKey];
    },
    hideHotspotInfo() {
      this.currentHotspotInfo = null;
    }
  },
  mounted() {
    this.cargarObras();
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Roboto:wght@400;500&display=swap');

.galeria-container {
  font-family: 'Roboto', sans-serif;
  color: #4e342e;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fbfaf5;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

h1, h2, h3 {
  font-family: 'Playfair Display', serif;
  color: #4e342e;
  text-align: center;
  margin-bottom: 20px;
}

.carousel {
  position: relative;
  width: 100%;
  max-height: 450px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 40px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.carousel-img {
  width: 100%;
  height: 450px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}

.carousel-img:hover {
  transform: scale(1.02);
}

.carousel-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 15px;
  text-align: center;
}

.carousel-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  margin-bottom: 5px;
}

.carousel-artist {
  font-size: 1.1rem;
  font-weight: 300;
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
  background-color: rgba(78, 52, 46, 0.7);
  color: white;
  border: none;
  padding: 12px 18px;
  font-size: 1.5rem;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.carousel-controls button:hover {
  background-color: #4e342e;
}

.search-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
  justify-content: center;
}

.search-bar input,
.search-bar select {
  padding: 10px 15px;
  border: 1px solid #bfae9e;
  border-radius: 5px;
  font-size: 1rem;
  flex-grow: 1;
  max-width: 300px;
}

.search-bar button {
  background-color: #8c5e3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.search-bar button:hover {
  background-color: #a1887f;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.gallery-item {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.gallery-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.gallery-item-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.gallery-item-info {
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.gallery-item-info h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  margin-top: 0;
  margin-bottom: 8px;
  text-align: left;
}

.gallery-item-info .artist {
  font-size: 0.95rem;
  color: #6d4c41;
  margin-bottom: 10px;
  text-align: left;
}

.gallery-item-info .description {
  font-size: 0.85rem;
  line-height: 1.6;
  color: #555;
  flex-grow: 1;
  margin-bottom: 15px;
  text-align: left;
}

.details-button {
  background-color: #bfae9e;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  align-self: flex-start; /* Align button to the start */
  transition: background-color 0.3s ease;
}

.details-button:hover {
  background-color: #8c5e3c;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fbfaf5;
  padding: 30px;
  border-radius: 10px;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.close-button {
  position: sticky;
  top: 10px;
  right: 10px;
  background: #4e342e;
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001; /* Ensure it's above other modal content */
  float: right; /* Helps position it at the top-right */
  margin-left: 10px; /* Space from content */
}


.modal-content h2 {
  margin-top: 0;
  font-size: 2.2rem;
  color: #4e342e;
}

.modal-artist {
  text-align: center;
  font-size: 1.2rem;
  color: #6d4c41;
  margin-bottom: 15px;
}

.modal-img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto 20px auto;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-description,
.modal-details {
  font-size: 1rem;
  line-height: 1.8;
  color: #333;
  margin-bottom: 15px;
  text-align: justify;
}

.model-viewer-container {
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
  text-align: center;
}

.model-viewer-container h3 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #4e342e;
}

.main-model-viewer {
  width: 100%;
  height: 400px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Hotspot styles */
.hotspot {
  background: #4e342e;
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  border: 2px solid white;
  transition: transform 0.2s, background-color 0.2s;
}

.hotspot:hover {
  transform: scale(1.1);
  background-color: #6d4c41;
}

.hotspot-label {
  display: none; /* Hidden by default */
  position: absolute;
  top: -30px; /* Adjust positioning as needed */
  left: 50%;
  transform: translateX(-50%);
  background-color: #4e342e;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  white-space: nowrap;
  font-size: 0.8rem;
}

.hotspot:hover .hotspot-label {
  display: block; /* Show label on hover */
}

.hotspot-info {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #bfae9e;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  max-width: 300px;
  text-align: left;
}

.hotspot-info h4 {
  margin-top: 0;
  font-size: 1.2rem;
  color: #4e342e;
}

.hotspot-info p {
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.hotspot-info button {
  background-color: #8c5e3c;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  float: right;
}

/* Slider controls for model viewer */
.slider {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  background: rgba(255, 255, 255, 0.8);
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.slider-controls {
  display: flex;
  gap: 10px;
}

.view-button {
  background-color: #bfae9e;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.view-button:hover {
  background-color: #8c5e3c;
}

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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  gap: 10px;
}

.error-message button {
  background-color: #c62828;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.error-message button:hover {
  background-color: #e53935;
}

.no-results {
  text-align: center;
  padding: 50px;
  font-size: 1.1rem;
  color: #666;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .galeria-container {
    padding: 15px;
  }

  .carousel-img {
    height: 300px;
  }

  .carousel-title {
    font-size: 1.4rem;
  }

  .carousel-artist {
    font-size: 1rem;
  }

  .search-bar {
    flex-direction: column;
  }

  .search-bar input,
  .search-bar select,
  .search-bar button {
    max-width: 100%;
    width: 100%;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 20px;
  }

  .modal-content h2 {
    font-size: 1.8rem;
  }

  .main-model-viewer {
    height: 300px;
  }

  .hotspot-info {
    max-width: 250px;
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .carousel-img {
    height: 200px;
  }
}
</style>