<template>
  <div class="timeline-page">
    <div class="timeline-header">
      <h1 class="timeline-main-title">Línea de Tiempo de Bolivia</h1>
      <p class="timeline-description">
        Explora los eventos clave que marcaron la historia de Bolivia, desde sus
        orígenes hasta la actualidad.
      </p>
    </div>

    <div class="timeline-container">
      <swiper
        :direction="'vertical'"
        :slidesPerView="1"
        :spaceBetween="0"
        :mousewheel="true"
        :pagination="{ clickable: true, el: '.swiper-pagination-custom' }"
        :navigation="{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }"
        class="timeline-swiper"
      >
        <swiper-slide
          v-for="(event, index) in timelineEvents"
          :key="index"
          :style="`background-image: url(${event.image})`"
          :data-year="event.year"
        >
          <div class="swiper-slide-overlay"></div>
          <div class="swiper-slide-content">
            <span class="timeline-year">{{ event.year }}</span>
            <h4 class="timeline-title">{{ event.title }}</h4>
            <p class="timeline-text">{{ event.description }}</p>
            <div class="event-details">
              <p v-if="event.details">{{ event.details }}</p>
              <a
                :href="event.link"
                target="_blank"
                v-if="event.link"
                class="event-link"
                >Más información</a
              >
            </div>
          </div>
        </swiper-slide>
      </swiper>
      <div class="swiper-pagination-custom"></div>
      <div class="swiper-button-prev-custom"></div>
      <div class="swiper-button-next-custom"></div>
    </div>
  </div>
</template>

<script>
// Importa los módulos de Swiper necesarios
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Navigation, Mousewheel } from "swiper/modules"; // Importa los módulos
import "swiper/swiper-bundle.css"; // Estilos base de Swiper
import "swiper/css"; // Estilos base
import "swiper/css/pagination"; // Estilos de paginación
import "swiper/css/navigation"; // Estilos de navegación

export default {
  name: "LineaDelTiempoView",
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    return {
      modules: [Pagination, Navigation, Mousewheel], // Registra los módulos
    };
  },
  data() {
    return {
      timelineEvents: [
        {
          year: "2000 a.C. - 1000 d.C.",
          title: "Culturas Precolombinas",
          description:
            "Desarrollo de civilizaciones como Wancarani, Chiripa, y la más influyente, Tiahuanaco, en el altiplano andino.",
          image: require("@/assets/images/tiahuanaco.jpg"),
          details:
            "Tiahuanaco fue un centro religioso y político crucial, precursor del Imperio Inca.",
          link: "https://es.wikipedia.org/wiki/Tiwanaku",
        },
        {
          year: "Siglo XV",
          title: "Expansión Inca",
          description:
            "El Imperio Incaico (Tahuantinsuyo) expande su dominio sobre vastas regiones de lo que hoy es Bolivia.",
          image: require("@/assets/images/inca.jpg"),
          details:
            "Incorporación de señoríos aimaras y quechuas al Tawantinsuyu, con Potosí como un centro importante.",
          link: "https://es.wikipedia.org/wiki/Imperio_incaico",
        },
        {
          year: "1532 - 1825",
          title: "Época Colonial",
          description:
            "Conquista española y establecimiento del Alto Perú como parte del Virreinato del Perú, luego del Río de la Plata.",
          image: require("@/assets/images/colonia.jpg"),
          details:
            "Explotación de la plata de Potosí, que se convierte en una de las ciudades más grandes y ricas del mundo colonial.",
          link: "https://es.wikipedia.org/wiki/Alto_Per%C3%BA",
        },
        {
          year: "1809 - 1825",
          title: "Guerra de la Independencia",
          description:
            "Levantamientos y batallas por la independencia contra el dominio español, liderados por figuras como Simón Bolívar y Antonio José de Sucre.",
          image: require("@/assets/images/independencia.jpg"),
          details:
            "Batallas decisivas de Junín y Ayacucho que sellaron la independencia del Alto Perú.",
          link: "https://es.wikipedia.org/wiki/Guerra_de_la_Independencia_de_Bolivia",
        },
        {
          year: "6 de Agosto de 1825",
          title: "Fundación de Bolivia",
          description:
            "Declaración de la Independencia y nacimiento de la República de Bolívar, posteriormente Bolivia.",
          image: require("@/assets/images/bolivia_fundacion.jpg"),
          details:
            "Nombrada en honor a Simón Bolívar, con Antonio José de Sucre como su primer presidente.",
          link: "https://es.wikipedia.org/wiki/Declaraci%C3%B3n_de_Independencia_de_Bolivia",
        },
        {
          year: "1879 - 1884",
          title: "Guerra del Pacífico",
          description:
            "Conflicto con Chile que resulta en la pérdida del acceso marítimo de Bolivia.",
          image: require("@/assets/images/guerra_pacifico.jpg"),
          details:
            "Un golpe devastador para la economía y la geopolítica boliviana.",
          link: "https://es.wikipedia.org/wiki/Guerra_del_Pac%C3%ADfico",
        },
        {
          year: "1932 - 1935",
          title: "Guerra del Chaco",
          description:
            "Conflicto con Paraguay por el control de la región del Chaco Boreal.",
          image: require("@/assets/images/guerra_chaco.jpg"),
          details:
            "Aunque Bolivia perdió gran parte del territorio disputado, la guerra impulsó cambios sociales y políticos significativos.",
          link: "https://es.wikipedia.org/wiki/Guerra_del_Chaco",
        },
        {
          year: "1952",
          title: "Revolución Nacional",
          description:
            "Un hito transformador que incluyó la reforma agraria, la nacionalización de las minas y el voto universal.",
          image: require("@/assets/images/revolucion_1952.jpg"),
          details:
            "Cambió radicalmente la estructura social y política del país.",
          link: "https://es.wikipedia.org/wiki/Revoluci%C3%B3n_boliviana_de_1952",
        },
        {
          year: "2006",
          title: "Primer Presidente Indígena",
          description:
            "Evo Morales Ayma asume la presidencia, marcando un giro histórico en la política boliviana.",
          image: require("@/assets/images/evo_morales.jpg"),
          details:
            'Inicio del "Estado Plurinacional de Bolivia" y profundas reformas constitucionales y sociales.',
          link: "https://es.wikipedia.org/wiki/Gobierno_de_Evo_Morales",
        },
        {
          year: "2009",
          title: "Nueva Constitución Política del Estado",
          description:
            "Se aprueba una nueva Constitución que refunda Bolivia como un Estado Plurinacional, descolonizador y con autonomías.",
          image: require("@/assets/images/cpe.jpg"),
          details:
            "Reconocimiento de 36 naciones y pueblos indígenas originarios campesinos, y sus derechos.",
          link: "https://es.wikipedia.org/wiki/Constituci%C3%B3n_pol%C3%ADtica_del_Estado_de_Bolivia_de_2009",
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Estilos generales de la página de línea de tiempo */
.timeline-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px 20px; /* Ajusta padding-top para el header */
  background-color: #f8f5ee; /* Tono crema */
  min-height: 100vh;
  box-sizing: border-box;
  font-family: "Georgia", serif;
}

.timeline-header {
  text-align: center;
  margin-bottom: 40px;
  max-width: 800px;
}

.timeline-main-title {
  font-size: 3.5rem;
  color: #4e342e; /* Marrón oscuro */
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.timeline-description {
  font-size: 1.1rem;
  color: #6d4c41; /* Marrón medio */
  line-height: 1.6;
}

.timeline-container {
  width: 100%;
  max-width: 900px;
  height: 600px; /* Altura fija para el contenedor del Swiper */
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  overflow: hidden; /* Asegura que las imágenes no se salgan */
}

/* Swiper overrides */
.timeline-swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 18px;
  background-position: center;
  background-size: cover;
  position: relative; /* Para el overlay y el contenido */
}

.swiper-slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Oscurece la imagen de fondo */
  z-index: 1;
}

.swiper-slide-content {
  position: relative;
  z-index: 2;
  color: #fff;
  padding: 40px;
  max-width: 700px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
}

.timeline-year {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 15px;
  display: block; /* Para que ocupe su propia línea */
  color: #ffecb3; /* Amarillo claro */
}

.timeline-title {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #fff;
}

.timeline-text {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 20px;
  color: #e0e0e0;
}

.event-details p {
  font-size: 1rem;
  margin-bottom: 10px;
  color: #e0e0e0;
}

.event-link {
  display: inline-block;
  background-color: #8d6e63; /* Marrón medio */
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.event-link:hover {
  background-color: #6d4c41; /* Marrón más oscuro al pasar el mouse */
}

/* Custom Navigation (Arrows) */
.swiper-button-prev-custom,
.swiper-button-next-custom {
  color: #8d6e63; /* Color de las flechas */
  font-size: 2.5rem; /* Tamaño de las flechas */
  transition: color 0.3s ease;
}

.swiper-button-prev-custom:hover,
.swiper-button-next-custom:hover {
  color: #6d4c41;
}

/* Custom Pagination (Bullets) */
.swiper-pagination-custom.swiper-pagination-vertical {
  right: 20px;
  left: auto;
  top: 50%;
  transform: translateY(-50%);
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
}

.swiper-pagination-bullet {
  background: #8d6e63; /* Marrón medio para bullets inactivos */
  opacity: 0.7;
  margin: 8px 0 !important; /* Espacio entre bullets (important para override Swiper) */
  width: 12px;
  height: 12px;
  transition: background-color 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
}

.swiper-pagination-bullet-active {
  background: #ffecb3; /* Amarillo claro para bullet activo */
  opacity: 1;
  transform: scale(1.3); /* Bullet activo un poco más grande */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .timeline-main-title {
    font-size: 2.5rem;
  }
  .timeline-description {
    font-size: 1rem;
  }
  .timeline-container {
    height: 500px; /* Ajusta altura para móviles */
    max-width: 100%;
    margin: 10px;
  }
  .timeline-year {
    font-size: 3rem;
  }
  .timeline-title {
    font-size: 2rem;
  }
  .timeline-text {
    font-size: 0.9rem;
  }
  .swiper-slide-content {
    padding: 20px;
  }
  .swiper-button-prev-custom,
  .swiper-button-next-custom {
    font-size: 2rem;
  }
  .swiper-pagination-custom.swiper-pagination-vertical {
    right: 10px;
  }
  .swiper-pagination-bullet {
    width: 10px;
    height: 10px;
    margin: 6px 0 !important;
  }
}

@media (max-width: 480px) {
  .timeline-main-title {
    font-size: 2rem;
  }
  .timeline-year {
    font-size: 2.5rem;
  }
  .timeline-title {
    font-size: 1.8rem;
  }
}
</style>
