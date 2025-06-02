<template>
  <div class="galeria-container">
    <div class="carousel-3d-container" v-if="galleryItems.length > 0 && !isLoading">
      <gl-renderer
        ref="renderer"
        :width="rendererWidth"
        :height="rendererHeight"
        antialias
        clearColor="#f0f0f0"
      >
        <gl-scene>
          <gl-camera :position="[0, 0, 8]" :fov="75" :near="0.1" :far="1000"></gl-camera>
          <gl-ambient-light :intensity="1.5"></gl-ambient-light>
          <gl-directional-light :position="[1, 1, 1]" :intensity="1.5"></gl-directional-light>

          <template v-if="currentModelObject">
            <gl-model :object="currentModelObject" :scale="[0.8, 0.8, 0.8]" />
          </template>
          <template v-else>
            <gl-mesh :position="[0, 0, 0]" :rotation="[0, Math.PI / 4, 0]">
              <gl-box-geometry :width="1" :height="1" :depth="1" />
              <gl-mesh-basic-material :color="'#4e342e'" />
            </gl-mesh>
          </template>
        </gl-scene>
      </gl-renderer>

      <div class="carousel-info">
        <div class="carousel-title">{{ galleryItems[currentIndex].title }}</div>
        <div class="carousel-artist">{{ galleryItems[currentIndex].artist }}</div>
      </div>
      <div class="carousel-controls">
        <button @click="prevImage" aria-label="Anterior imagen">&#10094;</button>
        <button @click="nextImage" aria-label="Siguiente imagen">&#10095;</button>
      </div>
    </div>

    <div class="loading-spinner" v-if="isLoading">
      <div class="spinner"></div>
      <p>Cargando obras 3D...</p>
    </div>

    <div class="error-message" v-if="errorMessage">
      <p>{{ errorMessage }}</p>
      <button @click="fetchGalleryItems">Reintentar</button>
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
        <option v-for="periodo in periodosUnicos" :key="periodo">{{ periodo }}</option>
      </select>
    </div>

    <div class="gallery-grid" v-if="filteredGalleryItems.length > 0 && !isLoading">
      <div class="gallery-item" v-for="item in filteredGalleryItems" :key="item.id">
        <img :src="item.imageUrl" :alt="item.title" @click="verDetalles(item.id)" class="gallery-item-img"/>
        <div class="gallery-item-info">
          <h3>{{ item.title }}</h3>
          <p class="artist">{{ item.artist }}</p>
          <p class="description">{{ item.description }}</p>
          <p class="periodo">Período: {{ item.periodo }}</p>
          <button @click="verDetalles(item.id)" class="details-button">Ver Detalles 3D</button>
        </div>
      </div>
    </div>

    <div v-else-if="!isLoading && !errorMessage" class="no-results">
      <p>No se encontraron obras que coincidan con la búsqueda o filtros.</p>
    </div>
  </div>
</template>

<script>
// La línea 'import * as Three from 'three';' ha sido eliminada
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three-orbitcontrols-ts'; // O 'three/examples/jsm/controls/OrbitControls.js' si prefieres la versión de Three.js
import { Renderer, Scene, Camera, AmbientLight, DirectionalLight, Mesh, BoxGeometry, MeshBasicMaterial, Model } from 'vue-gl';

export default {
  name: 'GaleriaView',
  components: {
    'gl-renderer': Renderer,
    'gl-scene': Scene,
    'gl-camera': Camera,
    'gl-ambient-light': AmbientLight,
    'gl-directional-light': DirectionalLight,
    'gl-mesh': Mesh,
    'gl-box-geometry': BoxGeometry,
    'gl-mesh-basic-material': MeshBasicMaterial,
    'gl-model': Model, // Usaremos este componente para el modelo GLTF
    // FondoDinamico,
  },
  data() {
    return {
      galleryItems: [],
      currentIndex: 0,
      busqueda: '',
      filtroPeriodo: '',
      periodosUnicos: [],
      isLoading: true,
      errorMessage: '',
      currentModelObject: null, // THREE.Object3D para el modelo cargado
      rendererWidth: 0,
      rendererHeight: 0,
      orbitControls: null, // Instancia de OrbitControls
      // Example 3D models and their data (same as before)
      all3dModels: [
        { id: 1, title: 'Obra 3D A', artist: 'Artista A', description: 'Una descripción detallada de la obra A.', periodo: 'Precolombino', imageUrl: require('@/assets/images/a.jpg'), modelUrl: require('@/assets/modelos/a.glb') },
        { id: 2, title: 'Obra 3D B', artist: 'Artista B', description: 'Una descripción detallada de la obra B.', periodo: 'Colonial', imageUrl: require('@/assets/images/b.jpg'), modelUrl: require('@/assets/modelos/b.glb') },
        { id: 3, title: 'Obra 3D C', artist: 'Artista C', description: 'Una descripción detallada de la obra C.', periodo: 'Republicano', imageUrl: require('@/assets/images/c.jpg'), modelUrl: require('@/assets/modelos/c.glb') },
        { id: 4, title: 'Obra 3D D', artist: 'Artista D', description: 'Una descripción detallada de la obra D.', periodo: 'Contemporáneo', imageUrl: require('@/assets/images/d.jpg'), modelUrl: require('@/assets/modelos/d.glb') },
        { id: 5, title: 'Obra 3D E', artist: 'Artista E', description: 'Una descripción detallada de la obra E.', periodo: 'Republicano', imageUrl: require('@/assets/images/e.jpg'), modelUrl: require('@/assets/modelos/e.glb') },
      ],
    };
  },
  computed: {
    filteredGalleryItems() {
      let items = this.galleryItems;

      if (this.busqueda) {
        const lowerCaseBusqueda = this.busqueda.toLowerCase();
        items = items.filter(item =>
          item.title.toLowerCase().includes(lowerCaseBusqueda) ||
          item.artist.toLowerCase().includes(lowerCaseBusqueda) ||
          item.description.toLowerCase().includes(lowerCaseBusqueda)
        );
      }

      if (this.filtroPeriodo) {
        items = items.filter(item => item.periodo === this.filtroPeriodo);
      }

      return items;
    },
  },
  methods: {
    async fetchGalleryItems() {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        this.galleryItems = this.all3dModels;
        this.extractUniquePeriods();
        // Cargar el primer modelo al iniciar
        if (this.galleryItems.length > 0) {
          await this.loadCurrentModel();
        }
      } catch (error) {
        this.errorMessage = 'Hubo un error al cargar las obras. Por favor, inténtalo de nuevo más tarde.';
        console.error('Error fetching gallery items:', error);
      } finally {
        this.isLoading = false;
      }
    },
    extractUniquePeriods() {
      const periods = new Set(this.galleryItems.map(item => item.periodo));
      this.periodosUnicos = Array.from(periods);
    },
    async loadCurrentModel() {
      this.currentModelObject = null; // Limpiar el modelo anterior
      const modelUrl = this.galleryItems[this.currentIndex].modelUrl;
      const loader = new GLTFLoader();

      try {
        const gltf = await loader.loadAsync(modelUrl);
        this.currentModelObject = gltf.scene;
        console.log('Modelo 3D cargado:', modelUrl);

        // Ajustar la posición y escala si es necesario, o Vue-GL lo hará con la prop :scale
        // gltf.scene.scale.set(0.8, 0.8, 0.8);
        // gltf.scene.position.set(0, 0, 0);

      } catch (error) {
        console.error('Error loading 3D model:', modelUrl, error);
        // Aquí podrías mostrar un placeholder o un mensaje de error visual
      }
    },
    async nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.galleryItems.length;
      await this.loadCurrentModel(); // Cargar el nuevo modelo
    },
    async prevImage() {
      this.currentIndex = (this.currentIndex - 1 + this.galleryItems.length) % this.galleryItems.length;
      await this.loadCurrentModel(); // Cargar el nuevo modelo
    },
    verDetalles(id) {
      this.$router.push({ name: 'DetalleObra', params: { id: id } });
    },
    aplicarFiltros() {
      // Logic for applying filters
    },
    resetFilters() {
      this.filtroPeriodo = '';
    },
    setupRenderer() {
      // Ajustar el tamaño del renderizador al contenedor
      const container = this.$refs.renderer.$el.parentNode;
      this.rendererWidth = container.clientWidth;
      this.rendererHeight = container.clientHeight;

      window.addEventListener('resize', this.onResize);

      // Configurar OrbitControls
      const renderer = this.$refs.renderer.renderer;
      const camera = this.$refs.renderer.camera;
      if (renderer && camera) {
        this.orbitControls = new OrbitControls(camera, renderer.domElement);
        this.orbitControls.enableDamping = true; // para un movimiento más suave
        this.orbitControls.dampingFactor = 0.05;
        this.orbitControls.screenSpacePanning = false; // para evitar que se mueva en el plano
        this.orbitControls.minDistance = 2; // Distancia mínima de zoom
        this.orbitControls.maxDistance = 15; // Distancia máxima de zoom
        this.orbitControls.autoRotate = true; // Autogirar
        this.orbitControls.autoRotateSpeed = 0.5; // Velocidad de autogiro

        renderer.setAnimationLoop(() => {
          this.orbitControls.update(); // Necesario para enableDamping o autoRotate
          renderer.render(this.$refs.renderer.scene, camera);
        });
      }
    },
    onResize() {
      const container = this.$refs.renderer.$el.parentNode;
      this.rendererWidth = container.clientWidth;
      this.rendererHeight = container.clientHeight;
    },
  },
  async created() {
    await this.fetchGalleryItems();
  },
  mounted() {
    this.setupRenderer();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize);
    if (this.orbitControls) {
      this.orbitControls.dispose();
    }
  },
  watch: {
    currentIndex: {
      immediate: true,
      async handler() {
        if (this.galleryItems.length > 0) {
          await this.loadCurrentModel();
          // Reset controls when new model loads
          if (this.orbitControls) {
            this.orbitControls.reset();
            this.orbitControls.autoRotate = true; // Reiniciar autogiro
          }
        }
      },
    },
  },
};
</script>

<style scoped>
/* Estilos existentes (mantener la mayoría) */
.galeria-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.carousel-3d-container {
  position: relative;
  width: 100%;
  height: 500px; /* Ajustar altura según sea necesario */
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Asegura que el canvas de Vue-GL ocupe todo el contenedor */
.gl-renderer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block; /* Importante para evitar espacios extra */
}

.carousel-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 10px 15px;
  border-radius: 5px;
  z-index: 10;
}

.carousel-title {
  font-size: 1.8rem;
  font-weight: bold;
}

.carousel-artist {
  font-size: 1.2rem;
  opacity: 0.9;
}

.carousel-controls {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  z-index: 10;
  padding: 0 10px;
}

.carousel-controls button {
  background-color: rgba(78, 52, 46, 0.7);
  color: white;
  border: none;
  padding: 15px 20px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.carousel-controls button:hover {
  background-color: #4e342e;
}

/* Search and Filter Styles */
.search-bar {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.search-bar input[type="text"],
.search-bar select {
  padding: 12px 20px;
  border: 1px solid #ccc;
  border-radius: 25px;
  font-size: 1rem;
  flex-grow: 1;
  max-width: 400px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-bar input[type="text"]:focus,
.search-bar select:focus {
  border-color: #4e342e;
  box-shadow: 0 0 0 3px rgba(78, 52, 46, 0.2);
  outline: none;
}

/* Gallery Grid Styles */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  padding: 20px 0;
}

.gallery-item {
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
  height: 200px;
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
  font-size: 1.5rem;
  color: #4e342e;
  margin-top: 0;
  margin-bottom: 8px;
}

.gallery-item-info .artist {
  font-style: italic;
  color: #666;
  margin-bottom: 5px;
}

.gallery-item-info .description {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #555;
  margin-top: 10px;
  margin-bottom: 15px;
}

.gallery-item-info .periodo {
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 15px;
}

.details-button {
  background-color: #8d6e63;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
  align-self: flex-start;
  margin-top: auto;
}

.details-button:hover {
  background-color: #6d4c41;
}

/* Loading Spinner */
.loading-spinner, .error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  text-align: center;
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
  margin: 1rem auto;
  border-radius: 4px;
  max-width: 500px;
}

.error-message button {
  background-color: #c62828;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.no-results {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #666;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    align-items: center;
  }
  .search-bar input[type="text"],
  .search-bar select {
    max-width: 90%;
  }
  .carousel-3d-container {
    height: 350px; /* Smaller height for mobile */
  }
}
</style>