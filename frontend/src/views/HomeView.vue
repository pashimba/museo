<template>
  <section class="about-us-section">
    <div class="container">
      <!-- Columna de Imágenes (Carrusel) -->
      <div class="image-collage">
        <!-- Elementos decorativos para el marco -->
        <div class="decorative-frame-back"></div>
        <div class="decorative-frame-front"></div>
        <div class="image-wrapper">
          <transition name="fade" mode="out-in">
            <div
              :key="currentImageIndex"
              class="carousel-image"
              :style="{
                backgroundImage: `url(${sections[currentImageIndex].image})`,
              }"
            ></div>
          </transition>
        </div>
      </div>

      <!-- Columna de Texto -->
      <div class="text-content">
        <transition name="fade" mode="out-in">
          <div :key="currentImageIndex">
            <p class="pre-title">{{ sections[currentImageIndex].preTitle }}</p>
            <h2 class="title">{{ sections[currentImageIndex].title }}</h2>
            <p class="description">
              {{ sections[currentImageIndex].description }}
            </p>
            <ul class="features-list">
              <li
                v-for="feature in sections[currentImageIndex].features"
                :key="feature"
              >
                {{ feature }}
              </li>
            </ul>
          </div>
        </transition>
        <router-link to="/about" class="discover-more-btn">
          Descubre Más
          <span class="arrow">&rarr;</span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return {
      currentImageIndex: 0,
      carouselInterval: null,
      sections: [
        {
          preTitle: "NUESTRA IDENTIDAD",
          title: "El Alma de Nuestra Comunidad",
          description:
            "Explora las raíces que nos definen y los valores que nos unen. Nuestra identidad se teje con hilos de historia, tradición y un espíritu inquebrantable.",
          features: [
            "Artefactos que narran nuestra historia.",
            "Testimonios de generaciones pasadas.",
            "Símbolos de unidad y pertenencia.",
          ],
          image: require("@/assets/images/a.jpg"),
        },
        {
          preTitle: "NUESTRAS CULTURAS",
          title: "Un Mosaico de Tradiciones Vivas",
          description:
            "Celebra la diversidad que enriquece nuestro patrimonio. Cada cultura es una ventana a mundos fascinantes, llena de color, música y sabiduría ancestral.",
          features: [
            "Vestimentas y textiles tradicionales.",
            "Instrumentos musicales únicos.",
            "Rituales y celebraciones ancestrales.",
          ],
          image: require("@/assets/images/b.jpg"),
        },
        {
          preTitle: "NUESTRA HISTORIA",
          title: "Un Viaje a Través del Tiempo",
          description:
            "Recorre los hitos que marcaron nuestro pasado, desde imperios antiguos hasta revoluciones que forjaron la nación que somos hoy.",
          features: [
            "Mapas y documentos históricos.",
            "Reliquias de batallas y conquistas.",
            "Líneas de tiempo interactivas.",
          ],
          image: require("@/assets/images/c.jpg"),
        },
        {
          preTitle: "NUESTRO ARTE",
          title: "Creatividad que Trasciende Épocas",
          description:
            "Maravíllate con la expresión artística que ha florecido en nuestra tierra. Obras maestras que capturan la belleza, la lucha y los sueños de nuestra gente.",
          features: [
            "Pinturas y esculturas maestras.",
            "Cerámicas con diseños milenarios.",
            "Fotografías que capturan momentos.",
          ],
          image: require("@/assets/images/d.jpg"),
        },
        {
          preTitle: "NUESTRO PATRIMONIO",
          title: "Nuestro Legado para el Futuro",
          description:
            "Comprende la importancia de preservar nuestros tesoros culturales y naturales para las futuras generaciones. Un legado de valor incalculable.",
          features: [
            "Sitios arqueológicos protegidos.",
            "Técnicas artesanales preservadas.",
            "Proyectos de conservación y restauración.",
          ],
          image: require("@/assets/images/e.jpg"),
        },
      ],
    };
  },
  mounted() {
    // Inicia el carrusel automático
    this.carouselInterval = setInterval(() => {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.sections.length;
    }, 5000); // Cambia cada 5 segundos para dar tiempo a leer
  },
  beforeUnmount() {
    // Limpia el intervalo al destruir el componente
    clearInterval(this.carouselInterval);
  },
};
</script>

<style scoped>
/* Importamos una fuente más elegante que se ajusta al diseño */
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;500&display=swap");

:root {
  --color-primary: #333333;
  --color-secondary: #888888;
  --color-accent: #de8e1e; /* Tono dorado/beige del diseño */
  --color-background: orange;
  --font-primary: "Playfair Display", serif;
  --font-secondary: "Poppins", sans-serif;
}

.about-us-section {
  background-color: rgba(255, 210, 171, 0.27);
  width: 100%;
  padding: 100px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  overflow: hidden;
}

.container {
  display: flex;
  width: 100%;
  max-width: 1100px;
  padding: 0 20px;
  align-items: center;
  gap: 60px;
}

/* --- Columna de Imágenes --- */
.image-collage {
  flex: 1;
  position: relative;
  height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ✨ NUEVO: Marco decorativo mejorado */
.decorative-frame-back {
  content: "";
  position: absolute;
  z-index: 0;
  width: 85%;
  height: 85%;
  background-color: #e1bb8d; /* Un color beige más claro */
  top: 0;
  left: 0;
}
.decorative-frame-front {
  content: "";
  position: absolute;
  z-index: 2; /* Por encima de la imagen */
  width: 90%;
  height: 90%;
  border: 3px solid var(--color-accent);
  bottom: 0;
  right: 0;
  pointer-events: none; /* Para no interferir con el mouse */
}

.image-wrapper {
  position: relative;
  width: 90%;
  height: 90%;
  z-index: 1;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.carousel-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

/* Transición de fundido para el carrusel y el texto */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* --- Columna de Texto --- */
.text-content {
  flex: 1;
  text-align: left;
  min-height: 400px; /* Asegura altura mínima para evitar saltos */
  display: flex;
  flex-direction: column;
}

.text-content > div {
  flex-grow: 1;
}

.pre-title {
  font-family: var(--font-secondary);
  color: var(--color-accent);
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.title {
  font-family: var(--font-primary);
  color: var(--color-primary);
  font-size: 2.8rem;
  line-height: 1.2;
  margin-bottom: 20px;
  min-height: 70px; /* Evita saltos cuando el título tiene 1 o 2 líneas */
}

.description {
  font-family: var(--font-secondary);
  color: var(--color-secondary);
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 30px;
}

.features-list {
  list-style: none;
  padding: 0;
  margin-bottom: 40px;
  font-family: var(--font-secondary);
}

.features-list li {
  color: var(--color-primary);
  margin-bottom: 15px;
  position: relative;
  padding-left: 25px;
}

.features-list li::before {
  content: "✔";
  color: var(--color-accent);
  position: absolute;
  left: 0;
  top: 2px;
  font-weight: bold;
}

.discover-more-btn {
  display: inline-block;
  background-color: var(--color-accent);
  color: #a98f6c;
  padding: 12px 30px;
  text-decoration: none;
  font-family: var(--font-secondary);
  font-weight: 500;
  border: #a98f6c solid 1px;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  align-self: flex-start; /* Se alinea a la izquierda */
}

.discover-more-btn:hover {
  background-color: #a98f6c;
  color: white;
  transform: translateY(-3px);
}

.discover-more-btn .arrow {
  margin-left: 10px;
  transition: margin-left 0.3s ease;
}

.discover-more-btn:hover .arrow {
  margin-left: 15px;
}

/* --- Responsividad --- */
@media (max-width: 992px) {
  .container {
    flex-direction: column;
    text-align: center;
    gap: 40px;
  }
  .text-content {
    align-items: center;
    text-align: center;
  }
  .features-list li {
    padding-left: 0;
    text-align: left;
    display: inline-block;
    width: 100%;
    max-width: 400px;
    padding-left: 25px;
  }
  .discover-more-btn {
    align-self: center; /* Se centra en móvil */
  }
  .title {
    font-size: 2.2rem;
    min-height: 0;
  }
}

@media (max-width: 576px) {
  .about-us-section {
    padding: 60px 0;
  }
  .image-collage {
    height: 350px;
  }
  .title {
    font-size: 1.8rem;
  }
  .description,
  .features-list li {
    font-size: 0.9rem;
  }
}
</style>
