<template>
  <div class="galeria-container">

    <div class="carousel">
      <img :src="carouselImages[currentIndex].src" :alt="carouselImages[currentIndex].title" class="carousel-img" @click="verDetalles" />
      <div class="carousel-title">{{ carouselImages[currentIndex].title }}</div>
      <div class="carousel-controls">
        <button @click="prevImage">&#10094;</button>
        <button @click="nextImage">&#10095;</button>
      </div>
    </div>

    
    <div class="search-bar">
      <input type="text" v-model="busqueda" placeholder="Buscar obras..." />
    </div>

    
    <div class="gallery">
      <div v-for="obra in obrasFiltradas" :key="obra.title" class="gallery-item">
        <img :src="obra.img" :alt="obra.title" class="gallery-img" />
        <h3>{{ obra.title }}</h3>
        <p>{{ obra.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import imgA from '../assets/images/a.jpg';
// import a from '../assets/images/a.png'


export default {
  data() {
    return {
      busqueda: '',
      currentIndex: 0,
      interval: null,
      carouselImages: [
        { title: 'A', src: imgA },
        { title: 'B', src: imgA },
        { title: 'C', src: imgA },
        { title: 'TD', src: imgA },
        { title: 'E', src: imgA }
      ],
      obras: [
        { title: 'A', img: imgA, description: 'Obra surrealista inspirada en sueños.' },
        { title: 'B', img: imgA, description: 'Exploración de la realidad y la inteligencia artificial.' },
        { title: 'C', img: imgA, description: 'Una mirada crítica a las clases sociales.' },
        { title: 'D', img: imgA, description: 'Retrato de poder y familia en la mafia.' },
        { title: 'E', img: imgA, description: 'Estética pop con narrativa no lineal.' }
      ]
    };
  },
  computed: {
    obrasFiltradas() {
      const search = this.busqueda.toLowerCase();
      return this.obras.filter(
        obra => obra.title.toLowerCase().includes(search) || obra.description.toLowerCase().includes(search)
      );
    }
  },
  methods: {
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.carouselImages.length;
    },
    prevImage() {
      this.currentIndex = (this.currentIndex - 1 + this.carouselImages.length) % this.carouselImages.length;
    },
    verDetalles() {
      alert(`Redirigirías a los detalles de ${this.carouselImages[this.currentIndex].title}`);
      // Puedes hacer router push o usar query params si tienes otra vista
    },
    startAutoSlide() {
      this.interval = setInterval(this.nextImage, 5000);
    },
    stopAutoSlide() {
      clearInterval(this.interval);
    }
  },
  mounted() {
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
}
.carousel-img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}
.carousel-title {
  margin-top: 10px;
  font-size: 1.8rem;
  color: #6d4c41;
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
  padding: 10px;
  border-radius: 50%;
  transition: background 0.3s;
}
.carousel-controls button:hover {
  background: rgba(255, 255, 255, 0.9);
}
.carousel-controls button:first-child {
  left: 10px;
}
.carousel-controls button:last-child {
  right: 10px;
}

.search-bar {
  text-align: center;
  margin-bottom: 2rem;
}
.search-bar input {
  padding: 10px;
  width: 60%;
  border-radius: 8px;
  border: 1px solid #bfae9e;
  background-color: #fff;
  color: #4e342e;
  font-family: inherit;
}


.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}
.gallery-item {
  background-color: #fffaf4;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.gallery-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e0dcd2;
}
</style>

