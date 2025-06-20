<template>
  <div class="ceramics-gallery-page" :class="{ 'dark-mode': isDarkMode }">
    <div class="gallery-header">
      <h1 class="gallery-main-title">Colección de Cerámicas Antiguas</h1>
      <p class="gallery-description">
        Explora la belleza y el detalle de nuestra exclusiva colección de
        cerámicas en 3D. Haz clic en cada pieza para interactuar con ella.
      </p>
    </div>


    <div class="ceramics-grid">
      <div
        v-for="(ceramic, index) in ceramics"
        :key="ceramic.id"
        class="ceramic-card"
      >
        <h2 class="ceramic-title">{{ ceramic.title }}</h2>
        <p class="ceramic-period">{{ ceramic.period }}</p>
        <div class="model-viewer-wrapper">
          <div
            :ref="`modelViewerContainer_${index}`"
            class="model-viewer-placeholder"
          ></div>
        </div>
        <p class="ceramic-description">{{ ceramic.description }}</p>
      </div>
    </div>
  </div>
</template>


<script>
import "@google/model-viewer";


export default {
  name: "CeramicsGalleryView",
  // Nuevo: Recibir la prop isDarkMode
  props: {
    isDarkMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ceramics: [
        {
          id: "a",
          title: "Vasija Ceremonial Precolombina",
          period: "Cultura Tiwanaku, 600 - 1000 d.C.",
          description:
            "Una pieza exquisita utilizada en rituales, destacando la iconografía andina temprana.",
          model3DUrl: process.env.BASE_URL + "models/a.glb",
        },
        {
          id: "b",
          title: "Cántaro de la Cultura Mollo",
          period: "Cultura Mollo, 1000 - 1400 d.C.",
          description:
            "Cántaro distintivo con patrones geométricos, reflejando la habilidad alfarera de la región del altiplano.",
          model3DUrl: process.env.BASE_URL + "models/b.glb",
        },
        {
          id: "c",
          title: "Urna Funeraria Amazónica",
          period: "Cultura Moxos, 1200 - 1500 d.C.",
          description:
            "Una gran urna de barro cocido, utilizada para entierros secundarios, con grabados que representan la fauna local.",
          model3DUrl: process.env.BASE_URL + "models/c.glb",
        },
        {
          id: "d",
          title: "Plato Ceremonial Inca",
          period: "Período Incaico, 1400 - 1532 d.C.",
          description:
            "Plato finamente decorado, evidencia de la influencia incaica y la sofisticación de sus rituales.",
          model3DUrl: process.env.BASE_URL + "models/d.glb",
        },
        {
          id: "e",
          title: "Figurilla Antropomorfa Colonial",
          period: "Período Colonial Temprano, Siglo XVI",
          description:
            "Una figurilla única que muestra la fusión de técnicas indígenas y temáticas coloniales, con detalles faciales expresivos.",
          model3DUrl: process.env.BASE_URL + "models/e.glb",
        },
      ],
    };
  },
  mounted() {
    this.renderModelViewers();
  },
  // Nuevo: Observador para re-renderizar los model-viewer si cambia el modo oscuro
  watch: {
    isDarkMode: {
      handler() {
        this.$nextTick(() => {
          this.renderModelViewers();
        });
      },
      immediate: false, // Solo reacciona a cambios posteriores a la creación
    },
  },
  methods: {
    renderModelViewers() {
      // Limpiar model-viewers existentes para recrearlos con los nuevos estilos
      this.ceramics.forEach((ceramic, index) => {
        const container = this.$refs[`modelViewerContainer_${index}`];
        const actualContainer = Array.isArray(container) ? container[0] : container;
        if (actualContainer) {
          // Eliminar cualquier model-viewer existente para recrearlo
          while (actualContainer.firstChild) {
            actualContainer.removeChild(actualContainer.firstChild);
          }
          this.createModelViewer(ceramic, index);
        }
      });
    },
    createModelViewer(ceramic, index) {
      const container = this.$refs[`modelViewerContainer_${index}`];


      if (!container || container.length === 0) {
        console.error(`Container for ceramic ${ceramic.id} not found.`);
        return;
      }


      // If ref returns an array, get the first element
      const actualContainer = Array.isArray(container)
        ? container[0]
        : container;


      if (actualContainer.querySelector("model-viewer")) {
        // Model viewer already exists, prevent re-creation
        return;
      }


      const modelViewer = document.createElement("model-viewer");
      modelViewer.setAttribute("src", ceramic.model3DUrl);
      modelViewer.setAttribute("alt", `Modelo 3D de ${ceramic.title}`);
      modelViewer.setAttribute("ar", ""); // boolean attribute
      modelViewer.setAttribute("ar-modes", "webxr quick-look scene-viewer");
      modelViewer.setAttribute("shadow-intensity", "1.5");
      modelViewer.setAttribute("camera-controls", ""); // boolean attribute
      modelViewer.setAttribute("auto-rotate", ""); // boolean attribute
      modelViewer.setAttribute("rotation-per-second", "1.5deg");
      modelViewer.setAttribute("exposure", "1.2");
      modelViewer.setAttribute("environment-image", "neutral");
      modelViewer.setAttribute("camera-orbit", "-30deg 75deg auto");


      // Nuevo: Añadir el atributo data-dark-mode al model-viewer
      if (this.isDarkMode) {
        modelViewer.setAttribute("data-dark-mode", "true");
      } else {
        modelViewer.removeAttribute("data-dark-mode");
      }


      modelViewer.classList.add("ceramic-model-viewer");


      // Create loading spinner slot content
      const loadingSpinnerDiv = document.createElement("div");
      loadingSpinnerDiv.classList.add("loading-spinner");
      loadingSpinnerDiv.setAttribute("slot", "progress-bar");


      const spinnerDiv = document.createElement("div");
      spinnerDiv.classList.add("spinner");
      loadingSpinnerDiv.appendChild(spinnerDiv);


      // Create AR button slot content
      const arButton = document.createElement("button");
      arButton.setAttribute("id", "ar-button");
      arButton.setAttribute("slot", "ar-button");
      arButton.textContent = "Ver en AR";


      // Append slotted content and then the model-viewer to the placeholder
      modelViewer.appendChild(loadingSpinnerDiv);
      modelViewer.appendChild(arButton);
      actualContainer.appendChild(modelViewer);
    },
  },
};
</script>


<style scoped>
/* --- Variables CSS para el Tema --- */
:root {
  /* Colores para el modo claro */
  --ceramics-bg-gradient-start-light: #fefcf3;
  --ceramics-bg-gradient-end-light: #e6d3b3;
  --ceramics-text-color-light: #4e342e;
  --ceramics-title-color-light: #8c5e3c;
  --ceramics-description-color-light: #6d4c41;
  --card-bg-light: #fff;
  --card-shadow-light: rgba(0, 0, 0, 0.15);
  --card-hover-shadow-light: rgba(0, 0, 0, 0.25);
  --card-title-light: #4e342e;
  --card-period-light: #a1887f;
  --model-viewer-border-light: #bfae9e;
  --model-viewer-placeholder-bg-light: #f8f8f8;
  --loading-spinner-bg-light: rgba(255, 255, 255, 0.8);
  --loading-spinner-border-light: #8c5e3c;
  --ar-button-bg-light: #5d4037;
  --ar-button-hover-bg-light: #795548;
  --ar-button-shadow-light: rgba(0, 0, 0, 0.2);


  /* Colores para el modo oscuro */
  --ceramics-bg-gradient-start-dark: #2a2a2a;
  --ceramics-bg-gradient-end-dark: #1a1a1a;
  --ceramics-text-color-dark: #e0e0e0;
  --ceramics-title-color-dark: #ffcc00;
  --ceramics-description-color-dark: #bbbbbb;
  --card-bg-dark: #3a3a3a;
  --card-shadow-dark: rgba(255, 255, 255, 0.1);
  --card-hover-shadow-dark: rgba(255, 255, 255, 0.2);
  --card-title-dark: #ffeb3b; /* Amarillo más vibrante */
  --card-period-dark: #c0c0c0; /* Gris claro */
  --model-viewer-border-dark: #777;
  --model-viewer-placeholder-bg-dark: #444;
  --loading-spinner-bg-dark: rgba(0, 0, 0, 0.6);
  --loading-spinner-border-dark: #ffcc00;
  --ar-button-bg-dark: #a08c6d;
  --ar-button-hover-bg-dark: #b8a58a;
  --ar-button-shadow-dark: rgba(255, 255, 255, 0.1);
}


/* --- Estilos Generales de la Página --- */
.ceramics-gallery-page {
  padding-top: 80px;
  min-height: 100vh;
  background: linear-gradient(
    to bottom right,
    var(--ceramics-bg-gradient-start-light),
    var(--ceramics-bg-gradient-end-light)
  );
  color: var(--ceramics-text-color-light);
  font-family: "Georgia", serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  transition: background 0.5s ease, color 0.5s ease;
}


/* Modo oscuro para la página completa */
.ceramics-gallery-page.dark-mode {
  background: linear-gradient(
    to bottom right,
    var(--ceramics-bg-gradient-start-dark),
    var(--ceramics-bg-gradient-end-dark)
  );
  color: var(--ceramics-text-color-dark);
}


/* --- Encabezado de la Galería --- */
.gallery-header {
  text-align: center;
  margin-bottom: 50px;
  max-width: 900px;
  padding: 20px;
}


.gallery-main-title {
  font-size: 3.8rem;
  margin-bottom: 15px;
  color: var(--ceramics-title-color-light);
  text-shadow: 3px 3px 5px var(--card-shadow-light); /* Sombra adaptable */
  font-family: "Playfair Display", serif;
  transition: color 0.5s ease, text-shadow 0.5s ease;
}


/* Modo oscuro para el título principal */
.ceramics-gallery-page.dark-mode .gallery-main-title {
  color: var(--ceramics-title-color-dark);
  text-shadow: 3px 3px 5px var(--card-shadow-dark);
}


.gallery-description {
  font-size: 1.3rem;
  line-height: 1.8;
  color: var(--ceramics-description-color-light);
  transition: color 0.5s ease;
}


/* Modo oscuro para la descripción */
.ceramics-gallery-page.dark-mode .gallery-description {
  color: var(--ceramics-description-color-dark);
}


/* --- Grid de Cerámicas --- */
.ceramics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 40px;
  width: 90%;
  max-width: 1400px;
  padding-bottom: 50px;
}


/* --- Tarjeta de Cerámica Individual --- */
.ceramic-card {
  background-color: var(--card-bg-light);
  border-radius: 15px;
  box-shadow: 0 10px 30px var(--card-shadow-light);
  padding: 25px;
  text-align: center;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out,
    background-color 0.5s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}


/* Modo oscuro para la tarjeta */
.ceramics-gallery-page.dark-mode .ceramic-card {
  background-color: var(--card-bg-dark);
  box-shadow: 0 10px 30px var(--card-shadow-dark);
}


.ceramic-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px var(--card-hover-shadow-light);
}


/* Modo oscuro para el hover de la tarjeta */
.ceramics-gallery-page.dark-mode .ceramic-card:hover {
  box-shadow: 0 15px 40px var(--card-hover-shadow-dark);
}


.ceramic-title {
  font-size: 2rem;
  color: var(--card-title-light);
  margin-bottom: 10px;
  font-family: "Playfair Display", serif;
  transition: color 0.5s ease;
}


/* Modo oscuro para el título de la tarjeta */
.ceramics-gallery-page.dark-mode .ceramic-title {
  color: var(--card-title-dark);
}


.ceramic-period {
  font-size: 1.1rem;
  color: var(--card-period-light);
  font-style: italic;
  margin-bottom: 20px;
  transition: color 0.5s ease;
}


/* Modo oscuro para el período de la tarjeta */
.ceramics-gallery-page.dark-mode .ceramic-period {
  color: var(--card-period-dark);
}


/* --- Contenedor del Visor 3D --- */
.model-viewer-wrapper {
  width: 100%;
  height: 300px;
  margin: 0 auto 20px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  border: 2px solid var(--model-viewer-border-light);
  transition: border-color 0.5s ease;
}


/* Modo oscuro para el borde del visor 3D */
.ceramics-gallery-page.dark-mode .model-viewer-wrapper {
  border: 2px solid var(--model-viewer-border-dark);
}


.model-viewer-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--model-viewer-placeholder-bg-light);
  border-radius: 10px;
  transition: background-color 0.5s ease;
}


/* Modo oscuro para el fondo del placeholder del visor 3D */
.ceramics-gallery-page.dark-mode .model-viewer-placeholder {
  background-color: var(--model-viewer-placeholder-bg-dark);
}


/* --- Estilos del model-viewer (elemento custom) --- */
.ceramic-model-viewer {
  width: 100%;
  height: 100%;
  --environment-image-filter: saturate(1.2) contrast(1.1);
  --interpolation-decay: 0.8;
  --poster-color: #f0f0f0; /* Color del poster antes de cargar el modelo */
}


/* Nuevo: Estilos condicionales para model-viewer basados en el atributo data-dark-mode */
.ceramic-model-viewer[data-dark-mode="true"] {
  /* Ajustes visuales para el modelo 3D en modo oscuro */
  --environment-image-filter: grayscale(0.5) brightness(0.8) contrast(1.1); /* Puedes ajustar estos valores */
  --poster-color: #333; /* Color de poster oscuro */
  /* Posiblemente necesites ajustar el lighting o el color del fondo si el modelo no tiene su propia iluminación */
}


/* --- Estilos para el Spinner de Carga de model-viewer --- */
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: var(--loading-spinner-bg-light);
  border-radius: 10px;
  transition: background-color 0.5s ease;
}


/* Modo oscuro para el fondo del spinner */
.ceramics-gallery-page.dark-mode .loading-spinner {
  background-color: var(--loading-spinner-bg-dark);
}


.loading-spinner .spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid var(--loading-spinner-border-light);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  transition: border-top-color 0.5s ease;
}


/* Modo oscuro para el spinner */
.ceramics-gallery-page.dark-mode .loading-spinner .spinner {
  border-top: 4px solid var(--loading-spinner-border-dark);
}


@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}


/* --- Estilos para el Botón de AR de model-viewer --- */
#ar-button {
  background-color: var(--ar-button-bg-light);
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1rem;
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 10px var(--ar-button-shadow-light);
}


/* Modo oscuro para el botón AR */
.ceramics-gallery-page.dark-mode #ar-button {
  background-color: var(--ar-button-bg-dark);
  box-shadow: 0 4px 10px var(--ar-button-shadow-dark);
}


#ar-button:hover {
  background-color: var(--ar-button-hover-bg-light);
}


/* Modo oscuro para el hover del botón AR */
.ceramics-gallery-page.dark-mode #ar-button:hover {
  background-color: var(--ar-button-hover-bg-dark);
}


.ceramic-description {
  font-size: 1rem;
  color: var(--ceramics-text-color-light); /* Color de texto principal */
  line-height: 1.6;
  margin-top: 15px;
  flex-grow: 1;
  transition: color 0.5s ease;
}


/* Modo oscuro para la descripción de la cerámica */
.ceramics-gallery-page.dark-mode .ceramic-description {
  color: var(--ceramics-text-color-dark);
}


/* Responsive adjustments */
@media (max-width: 1024px) {
  .gallery-main-title {
    font-size: 3rem;
  }
  .gallery-description {
    font-size: 1.1rem;
  }
  .ceramics-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
  }
  .ceramic-card {
    padding: 20px;
  }
  .ceramic-title {
    font-size: 1.8rem;
  }
  .model-viewer-wrapper {
    height: 250px;
  }
}


@media (max-width: 768px) {
  .gallery-main-title {
    font-size: 2.5rem;
  }
  .gallery-description {
    font-size: 1rem;
  }
  .ceramics-grid {
    grid-template-columns: 1fr;
    gap: 25px;
    width: 95%;
  }
  .ceramic-card {
    padding: 15px;
  }
  .ceramic-title {
    font-size: 1.6rem;
  }
  .ceramic-period {
    font-size: 0.9rem;
  }
  .model-viewer-wrapper {
    height: 280px;
  }
}
</style>
