<template>
  <div class="cont s--inactive">
    <div class="cont__inner">
      <div
        class="el"
        v-for="(section, index) in sections"
        :key="index"
        @click="activateSection(index)"
        :class="{ 's--active': activeIndex === index }"
      >
        <div class="el__overflow">
          <div class="el__inner">
            <div
              class="el__bg"
              :style="{ backgroundImage: `url(${section.image})` }"
            ></div>
            <div class="el__preview-cont">
              <h2 class="el__heading">{{ section.title }}</h2>
            </div>
            <div class="el__content">
              <div class="el__text">
                <h1>{{ section.title }}</h1>
                <p>{{ section.text }}</p>
              </div>
              <div class="el__close-btn" @click.stop="deactivateSection"></div>
            </div>
          </div>
        </div>
        <div class="el__index">
          <div class="el__index-back">{{ index + 1 }}</div>
          <div class="el__index-front">
            <div class="el__index-overlay" :data-index="index + 1">
              {{ index + 1 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return {
      activeIndex: null, // Para controlar qué sección está activa
      sections: [
        {
          title: "Identidad",
          image: require("@/assets/images/a.jpg"),
          text: "La identidad es el alma de nuestra comunidad, reflejada en nuestra historia, costumbres y valores únicos. En el museo, exploramos cómo se ha forjado la identidad boliviana a través de los siglos, desde las culturas precolombinas hasta la nación moderna.",
        },
        {
          title: "Culturas",
          image: require("@/assets/images/b.jpg"),
          text: "Bolivia es un mosaico de culturas. Este espacio te invita a descubrir la diversidad de pueblos indígenas, sus tradiciones, lenguas y cosmovisiones que han enriquecido el patrimonio del país. Explora las raíces de nuestra plurinacionalidad.",
        },
        {
          title: "Historia",
          image: require("@/assets/images/c.jpg"),
          text: "Un viaje a través del tiempo, desde las civilizaciones antiguas como Tiahuanaco, el Imperio Inca, la colonia española, hasta la independencia y la formación de la República de Bolivia. Conoce los hitos y personajes que forjaron nuestro destino.",
        },
        {
          title: "Arte",
          image: require("@/assets/images/d.jpg"),
          text: "Sumérgete en la riqueza del arte boliviano. Desde el arte rupestre prehistórico, las expresiones coloniales con su sincretismo religioso, hasta las vanguardias del siglo XX y el arte contemporáneo. Un reflejo de la creatividad y visión del artista boliviano.",
        },
        {
          title: "Patrimonio",
          image: require("@/assets/images/e.jpg"),
          text: "El patrimonio de Bolivia es vasto y diverso, incluyendo sitios arqueológicos, ciudades coloniales, tradiciones vivas y una biodiversidad única. Este recorrido resalta la importancia de preservar y valorar este legado invaluable para las futuras generaciones.",
        },
      ],
    };
  },
  methods: {
    activateSection(index) {
      this.activeIndex = index;
    },
    deactivateSection() {
      this.activeIndex = null;
    },
  },
};
</script>

<style scoped>
/* Estilos para el efecto de carrusel en la página de inicio */
.cont {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  background-color: #f0f2f5; /* Fondo más claro */
}

.cont.s--inactive {
  /* Cuando no hay ninguna sección activa */
}

.cont.s--active {
  /* Cuando una sección está activa (si decides usar una clase en el contenedor principal) */
}

.cont__inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.el {
  position: absolute;
  left: 0;
  top: 0;
  width: 20%; /* 5 secciones, 100% / 5 = 20% */
  height: 100%;
  background-color: #fff;
  transition: transform 0.6s ease-out, width 0.7s ease-out 0.7s, z-index 0s 0.7s;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra sutil */
  border-right: 1px solid #f0f0f0;
}

.el:nth-child(1) {
  transform: translate3d(0%, 0, 0);
  z-index: 5;
}
.el:nth-child(2) {
  transform: translate3d(100%, 0, 0);
  z-index: 4;
}
.el:nth-child(3) {
  transform: translate3d(200%, 0, 0);
  z-index: 3;
}
.el:nth-child(4) {
  transform: translate3d(300%, 0, 0);
  z-index: 2;
}
.el:nth-child(5) {
  transform: translate3d(400%, 0, 0);
  z-index: 1;
}

/* Estado activo */
.el.s--active {
  z-index: 10; /* Asegura que la sección activa esté encima */
  width: 100%;
  transform: translate3d(0, 0, 0);
  transition: width 0.7s ease-out 0.7s, transform 0.6s ease-out; /* Ajusta transiciones */
}

/* Ajuste de posición para elementos no activos cuando uno está activo */
.el.s--active ~ .el {
  transform: translate3d(
    100%,
    0,
    0
  ); /* Mueve los siguientes elementos fuera de vista */
}

/* El contenido del elemento */
.el__overflow {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.el__inner {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el__bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.6s ease-out; /* Transición para el zoom */
}

.el__bg:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4); /* Overlay oscuro */
  transition: opacity 0.6s ease-out;
}

.el.s--active .el__bg {
  transform: scale(1.05); /* Ligerísimo zoom en la imagen activa */
}

.el.s--active .el__bg:after {
  opacity: 0; /* Quita el overlay oscuro en la sección activa */
}

.el__preview-cont,
.el__content {
  position: absolute;
  color: #fff;
  text-align: center;
  transition: opacity 0.6s ease-out;
  padding: 20px;
  box-sizing: border-box;
}

.el__preview-cont {
  opacity: 1;
  z-index: 20;
}

.el.s--active .el__preview-cont {
  opacity: 0;
  pointer-events: none; /* Deshabilita clics en el preview cuando está activo */
}

.el__content {
  opacity: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* Fondo para el contenido extendido */
}

.el.s--active .el__content {
  opacity: 1;
}

.el__heading {
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.el__text h1 {
  font-size: 3rem;
  margin-bottom: 20px;
}

.el__text p {
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto;
}

.el__close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  cursor: pointer;
  z-index: 30;
  opacity: 0;
  transition: opacity 0.3s ease-out;
}

.el.s--active .el__close-btn {
  opacity: 1;
}

.el__close-btn:before,
.el__close-btn:after {
  content: "";
  position: absolute;
  width: 60%;
  height: 2px;
  background-color: #fff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
}

.el__close-btn:after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.el__index {
  position: absolute;
  bottom: 20px;
  left: 20px;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.5);
  z-index: 25;
  transition: opacity 0.6s ease-out;
}

.el.s--active .el__index {
  opacity: 0; /* Oculta el índice cuando está activa */
}

/* Media Queries para responsividad */
@media (max-width: 768px) {
  .el {
    width: 100%;
    height: 20%;
    transform: none !important; /* Resetea transformaciones para móviles */
    position: relative; /* Ajusta para el flujo normal */
  }

  .el:nth-child(1) {
    top: 0%;
  }
  .el:nth-child(2) {
    top: 100%;
  }
  .el:nth-child(3) {
    top: 200%;
  }
  .el:nth-child(4) {
    top: 300%;
  }
  .el:nth-child(5) {
    top: 400%;
  }

  .el.s--active {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transform: none;
  }

  .el.s--active ~ .el {
    transform: translateY(
      100%
    ); /* Mueve los siguientes elementos hacia abajo */
  }

  .el__heading {
    font-size: 2rem;
  }

  .el__text h1 {
    font-size: 2.5rem;
  }

  .el__text p {
    font-size: 1rem;
    max-width: 90%;
  }

  .el__index {
    display: none; /* Ocultar en móviles para simplicidad */
  }
}
</style>
