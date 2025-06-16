<template>
  <div class="timeline-body">
    <div class="header-section">
      <h1 class="main-title">Línea de Tiempo de Bolivia</h1>
      <p class="main-description">
        Un viaje interactivo a través de los momentos que han forjado la historia de nuestra nación.
      </p>
    </div>

    <div class="timeline-container">
      <swiper
        :effect="'coverflow'"
        :grabCursor="true"
        :centeredSlides="true"
        :slidesPerView="'auto'"
        :loop="true"
        :coverflowEffect="{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }"
        :pagination="{ clickable: true, el: '.swiper-pagination-custom' }"
        :navigation="{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }"
        :modules="modules"
        class="history-swiper"
      >
        <swiper-slide
          v-for="(event, index) in timelineEvents"
          :key="index"
          class="history-slide"
        >
          <div
            class="slide-background"
            :style="`background-image: url(${event.image})`"
          ></div>
          <div class="slide-content">
            <span class="event-year">{{ event.year }}</span>
            <h3 class="event-title">{{ event.title }}</h3>
            <p class="event-description">{{ event.description }}</p>
            <a
              v-if="event.link"
              :href="event.link"
              target="_blank"
              class="event-link"
            >
              Descubrir más
            </a>
          </div>
        </swiper-slide>
      </swiper>

      <div class="swiper-navigation">
        <div class="swiper-button-prev-custom">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-arrow-left"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </div>
        <div class="swiper-pagination-custom"></div>
        <div class="swiper-button-next-custom">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-arrow-right"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Importa los componentes y módulos de Swiper
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";

// Importa los estilos de Swiper
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default {
  name: "LineaDelTiempoView",
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    return {
      modules: [EffectCoverflow, Pagination, Navigation],
    };
  },
  data() {
    return {
      timelineEvents: [
        {
          year: "2000 a.C. - 1000 d.C.",
          title: "Culturas Precolombinas",
          description:
            "Desarrollo de civilizaciones como Wancarani, Chiripa, y la influyente Tiahuanaco en el altiplano.",
          image: require("@/assets/images/tiahuanaco.jpg"),
          link: "https://es.wikipedia.org/wiki/Tiwanaku",
        },
        {
          year: "Siglo XV",
          title: "Expansión Inca",
          description:
            "El Imperio Incaico expande su dominio sobre las vastas regiones de la actual Bolivia.",
          image: require("@/assets/images/inca.jpg"),
          link: "https://es.wikipedia.org/wiki/Imperio_incaico",
        },
        {
          year: "1532 - 1825",
          title: "Época Colonial Española",
          description:
            "Conquista y establecimiento del Alto Perú. Potosí se convierte en un centro argentífero mundial.",
          image: require("@/assets/images/colonia.jpg"),
          link: "https://es.wikipedia.org/wiki/Alto_Per%C3%BA",
        },
        {
          year: "1809 - 1825",
          title: "Guerra de Independencia",
          description:
            "Levantamientos y batallas liderados por figuras como Bolívar y Sucre para lograr la independencia.",
          image: require("@/assets/images/independencia.jpg"),
          link: "https://es.wikipedia.org/wiki/Guerra_de_la_Independencia_de_Bolivia",
        },
        {
          year: "6 de Agosto de 1825",
          title: "Fundación de Bolivia",
          description:
            "Nacimiento de la República de Bolívar, nombrada en honor a su libertador y hoy conocida como Bolivia.",
          image: require("@/assets/images/bolivia_fundacion.jpg"),
          link: "https://es.wikipedia.org/wiki/Declaraci%C3%B3n_de_Independencia_de_Bolivia",
        },
        {
          year: "1879 - 1884",
          title: "Guerra del Pacífico",
          description:
            "Conflicto con Chile que resulta en la trágica pérdida del acceso soberano al mar para Bolivia.",
          image: require("@/assets/images/guerra_pacifico.jpg"),
          link: "https://es.wikipedia.org/wiki/Guerra_del_Pac%C3%ADfico",
        },
        {
          year: "1932 - 1935",
          title: "Guerra del Chaco",
          description:
            "Disputa territorial con Paraguay por el control de la región del Chaco Boreal.",
          image: require("@/assets/images/guerra_chaco.jpg"),
          link: "https://es.wikipedia.org/wiki/Guerra_del_Chaco",
        },
        {
          year: "1952",
          title: "Revolución Nacional",
          description:
            "Hito histórico que incluyó la reforma agraria, nacionalización de minas y el voto universal.",
          image: require("@/assets/images/revolucion_1952.jpg"),
          link: "https://es.wikipedia.org/wiki/Revoluci%C3%B3n_boliviana_de_1952",
        },
        {
          year: "2006",
          title: "Primer Presidente Indígena",
          description:
            "Evo Morales asume la presidencia, marcando un giro histórico en la política boliviana.",
          image: require("@/assets/images/evo_morales.jpg"),
          link: "https://es.wikipedia.org/wiki/Gobierno_de_Evo_Morales",
        },
        {
          year: "2009",
          title: "Nueva Constitución Política",
          description:
            "Se aprueba la nueva Constitución que refunda Bolivia como un Estado Plurinacional y con autonomías.",
          image: require("@/assets/images/cpe.jpg"),
          link: "https://es.wikipedia.org/wiki/Constituci%C3%B3n_pol%C3%ADtica_del_Estado_de_Bolivia_de_2009",
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Ultima version estable */
/* Importar fuentes desde Google Fonts */
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Lora:ital,wght@0,400;0,700;1,400&display=swap");

/* Variables CSS para una fácil personalización */
:root {
  --font-primary: "Georgia", sans-serif;
  --font-secondary: "Lora", serif;
  --color-background: #121212;
  --color-text-primary: #e0e0e0;
  --color-text-secondary: #bdbdbd;
  --color-accent: #d4af37; /* Tono dorado */
  --color-card-bg: rgba(24, 24, 24, 0.8);
}

.timeline-body {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  font-family: var(--font-primary);
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.header-section {
  text-align: center;
  margin-bottom: 50px;
}

.main-title {
  font-family: var(--font-secondary);
  font-size: 3.5rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
  margin-bottom: 15px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.main-description {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.timeline-container {
  width: 100%;
  max-width: 1400px;
  position: relative;
  padding-bottom: 80px; /* Espacio para la navegación */
}

.history-swiper {
  width: 100%;
  padding-top: 50px;
  padding-bottom: 50px;
}

.history-slide {
  background-position: center;
  background-size: cover;
  width: 320px; /* Ancho fijo para las tarjetas */
  height: 480px; /* Altura fija para las tarjetas */
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);
  transition: transform 0.5s ease;
}

.swiper-slide-active {
  transform: scale(1.05);
}

.slide-background {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.history-slide:hover .slide-background {
  transform: scale(1.1);
}

.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  z-index: 2;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 20%,
    rgba(0, 0, 0, 0.1) 100%
  );
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.7);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s 0.2s ease, transform 0.6s 0.2s ease;
}

.swiper-slide-active .slide-content {
  opacity: 1;
  transform: translateY(0);
}

.event-year {
  font-family: var(--font-secondary);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-accent);
  margin-bottom: 10px;
}

.event-title {
  font-family: var(--font-primary);
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 15px;
}

.event-description {
  font-size: 0.9rem;
  font-weight: 300;
  line-height: 1.5;
  margin-bottom: 20px;
  flex-grow: 1;
}

.event-link {
  display: inline-block;
  background-color: var(--color-accent);
  color: #000;
  padding: 10px 20px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.3s ease;
  align-self: flex-start;
}

.event-link:hover {
  background-color: #fff;
  transform: scale(1.05);
}

/* --- Navegación y Paginación --- */
.swiper-navigation {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 300px;
}

.swiper-button-prev-custom,
.swiper-button-next-custom {
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: color 0.3s ease, transform 0.3s ease;
  padding: 10px;
}

.swiper-button-prev-custom:hover,
.swiper-button-next-custom:hover {
  color: #fff;
  transform: scale(1.1);
}

.swiper-pagination-custom {
  position: relative;
  width: auto !important;
  bottom: auto !important;
  margin: 0 20px;
}

.swiper-pagination-custom .swiper-pagination-bullet {
  background: var(--color-text-secondary);
  width: 10px;
  height: 10px;
  opacity: 0.7;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.swiper-pagination-custom .swiper-pagination-bullet-active {
  background: var(--color-accent);
  opacity: 1;
  transform: scale(1.3);
}

/* --- Responsividad --- */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }
  .main-description {
    font-size: 1rem;
  }
  .history-slide {
    width: 280px;
    height: 420px;
  }
  .event-title {
    font-size: 1.5rem;
  }
  .event-description {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .timeline-body {
    padding: 20px 10px;
  }
  .main-title {
    font-size: 2rem;
  }
  .header-section {
    margin-bottom: 30px;
  }
  .history-slide {
    width: 250px;
    height: 400px;
  }
  .event-year {
    font-size: 1.2rem;
  }
  .event-title {
    font-size: 1.3rem;
  }
}
</style>
