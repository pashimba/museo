<template>
  <div class="galeria-container">
    <!-- Carrusel de obras destacadas -->
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

    <!-- Buscador y filtros -->
    <div class="search-bar">
      <input 
        type="text" 
        v-model="busqueda" 
        placeholder="Buscar por título, artista o descripción..." 
        @input="resetFilters"
      />
      <select v-model="filtroPeriodo" @change="aplicarFiltros">
        <option value="">Todos los períodos</option>
        <option v-for="periodo in periodosUnicos" :value="periodo" :key="periodo">
          {{ periodo }}
        </option>
      </select>
    </div>

    <!-- Estados de carga y errores -->
    <div v-if="loading" class="loading-spinner">
      <div class="spinner"></div>
      <p>Cargando obras...</p>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchArtworks" class="retry-button">Reintentar</button>
    </div>

    <div v-else-if="!loading && obrasFiltradas.length === 0" class="no-results">
      <p>No se encontraron obras que coincidan con tu búsqueda</p>
    </div>

    <!-- Galería de obras -->
    <div v-else class="gallery">
      <div 
        v-for="obra in obrasFiltradas" 
        :key="obra.id" 
        class="gallery-item"
        @click="verDetalles(obra.id)"
      >
        <img :src="obra.imageUrl" :alt="obra.title" class="gallery-img" />
        <div class="gallery-item-info">
          <h3>{{ obra.title }}</h3>
          <p class="artist">{{ obra.artist }}</p>
          <p class="year-period">{{ obra.year }} • {{ obra.period }}</p>
          <p class="description">{{ truncateDescription(obra.description) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default {
  name: 'GaleriaView',
  data() {
    return {
      busqueda: '',
      filtroPeriodo: '',
      currentIndex: 0,
      interval: null,
      loading: true,
      error: null,
      carouselImages: [],
      obras: [],
      periodosUnicos: []
    };
  },
  computed: {
    obrasFiltradas() {
      const searchTerm = this.busqueda.toLowerCase();
      return this.obras.filter(obra => {
        const matchesSearch = 
          obra.title.toLowerCase().includes(searchTerm) ||
          obra.artist.toLowerCase().includes(searchTerm) ||
          obra.description.toLowerCase().includes(searchTerm);
        
        const matchesPeriod = this.filtroPeriodo ? 
          obra.period === this.filtroPeriodo : true;
        
        return matchesSearch && matchesPeriod;
      });
    }
  },
  methods: {
    async fetchArtworks() {
      this.loading = true;
      this.error = null;
      
      try {
        const q = query(
          collection(db, 'artworks'),
          orderBy('year', 'desc')
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          this.obras = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title || 'Sin título',
              description: data.description || '',
              artist: data.artist || 'Artista desconocido',
              year: data.year || '--',
              period: data.period || 'Sin período',
              imageUrl: data.imageUrl || require('@/assets/images/a.jpg'),
              isFeatured: data.isFeatured || false
            };
          });

          this.carouselImages = this.obras.filter(obra => obra.isFeatured);
          this.periodosUnicos = [...new Set(this.obras.map(obra => obra.period))];
        } else {
          this.error = "No se encontraron obras en la base de datos";
        }
      } catch (error) {
        console.error("Error al cargar obras:", error);
        this.error = "Error al cargar las obras. Intenta nuevamente.";
      } finally {
        this.loading = false;
      }
    },
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.carouselImages.length;
      this.resetAutoSlide();
    },
    prevImage() {
      this.currentIndex = (this.currentIndex - 1 + this.carouselImages.length) % this.carouselImages.length;
      this.resetAutoSlide();
    },
    resetAutoSlide() {
      this.stopAutoSlide();
      this.startAutoSlide();
    },
    startAutoSlide() {
      if (this.carouselImages.length > 1) {
        this.interval = setInterval(this.nextImage, 5000);
      }
    },
    stopAutoSlide() {
      if (this.interval) {
        clearInterval(this.interval);
      }
    },
    verDetalles(obraId) {
      this.$router.push({ name: 'DetalleObra', params: { id: obraId } });
    },
    truncateDescription(desc) {
      return desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
    },
    resetFilters() {
      this.filtroPeriodo = '';
    },
    aplicarFiltros() {
      // Lógica adicional para filtros si es necesario
    }
  },
  async mounted() {
    await this.fetchArtworks();
    this.startAutoSlide();
  },
  beforeUnmount() {
    this.stopAutoSlide();
  }
};
</script>

<style scoped>
.galeria-container {
  background-color: #f5f0e6;
  min-height: 100vh;
  color: #4e342e;
  padding: 20px;
  font-family: 'Georgia', serif;
}

.carousel {
  position: relative;
  text-align: center;
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.carousel-img {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  transition: transform 0.5s ease;
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
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  padding: 20px;
  text-align: left;
  color: white;
}

.carousel-title {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
}

.carousel-artist {
  font-size: 1.2rem;
  font-style: italic;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.carousel-controls button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.6);
  color: #4e342e;
  border: none;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 50%;
  transition: all 0.3s;
}

.carousel-controls button:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-50%) scale(1.1);
}

.carousel-controls button:first-child {
  left: 20px;
}

.carousel-controls button:last-child {
  right: 20px;
}

.search-bar {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-bar input {
  padding: 12px 15px;
  width: 50%;
  min-width: 300px;
  border-radius: 8px;
  border: 1px solid #bfae9e;
  background-color: #fff;
  color: #4e342e;
  font-family: inherit;
  font-size: 1rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.search-bar select {
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #bfae9e;
  background-color: #fff;
  color: #4e342e;
  font-family: inherit;
  cursor: pointer;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  padding: 10px;
}

.gallery-item {
  background-color: #fffaf4;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.gallery-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.gallery-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #e0dcd2;
}

.gallery-item-info {
  padding: 15px;
  text-align: left;
}

.gallery-item-info h3 {
  color: #4e342e;
  margin-bottom: 5px;
  font-size: 1.2rem;
}

.gallery-item-info .artist {
  color: #8d6e63;
  font-weight: 500;
  margin-bottom: 5px;
}

.gallery-item-info .year-period {
  color: #a1887f;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.gallery-item-info .description {
  color: #5d4037;
  font-size: 0.95rem;
  line-height: 1.4;
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

.retry-button {
  padding: 8px 16px;
  background: #c62828;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.retry-button:hover {
  background: #b71c1c;
}

.no-results {
  text-align: center;
  padding: 50px;
  color: #8d6e63;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    align-items: center;
  }
  
  .search-bar input, 
  .search-bar select {
    width: 100%;
    min-width: auto;
  }
  
  .gallery {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}
</style>