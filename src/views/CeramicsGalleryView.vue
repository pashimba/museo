<template>
  <div class="ceramics-gallery-page">
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
          <!-- Placeholder div where model-viewer will be dynamically mounted -->
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
// Asegúrate de que model-viewer esté importado para que el componente web sea reconocido
import "@google/model-viewer";

export default {
  name: "CeramicsGalleryView",
  data() {
    return {
      ceramics: [
        {
          id: "a",
          title: "Vasija Ceremonial Precolombina",
          period: "Cultura Tiwanaku, 600 - 1000 d.C.",
          description:
            "Una pieza exquisita utilizada en rituales, destacando la iconografía andina temprana.",
          model3DUrl: process.env.BASE_URL + "models/a.glb", // Ruta a tu modelo 'a.glb'
        },
        {
          id: "b",
          title: "Cántaro de la Cultura Mollo",
          period: "Cultura Mollo, 1000 - 1400 d.C.",
          description:
            "Cántaro distintivo con patrones geométricos, reflejando la habilidad alfarera de la región del altiplano.",
          model3DUrl: process.env.BASE_URL + "models/b.glb", // Ruta a tu modelo 'b.glb'
        },
        {
          id: "c",
          title: "Urna Funeraria Amazónica",
          period: "Cultura Moxos, 1200 - 1500 d.C.",
          description:
            "Una gran urna de barro cocido, utilizada para entierros secundarios, con grabados que representan la fauna local.",
          model3DUrl: process.env.BASE_URL + "models/c.glb", // Ruta a tu modelo 'c.glb'
        },
        {
          id: "d",
          title: "Plato Ceremonial Inca",
          period: "Período Incaico, 1400 - 1532 d.C.",
          description:
            "Plato finamente decorado, evidencia de la influencia incaica y la sofisticación de sus rituales.",
          model3DUrl: process.env.BASE_URL + "models/d.glb", // Ruta a tu modelo 'd.glb'
        },
        {
          id: "e",
          title: "Figurilla Antropomorfa Colonial",
          period: "Período Colonial Temprano, Siglo XVI",
          description:
            "Una figurilla única que muestra la fusión de técnicas indígenas y temáticas coloniales, con detalles faciales expresivos.",
          model3DUrl: process.env.BASE_URL + "models/e.glb", // Ruta a tu modelo 'e.glb'
        },
      ],
    };
  },
  mounted() {
    this.ceramics.forEach((ceramic, index) => {
      this.createModelViewer(ceramic, index);
    });
  },
  methods: {
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
.ceramics-gallery-page {
  padding-top: 80px; /* Ajusta para el header fijo */
  min-height: 100vh;
  background: linear-gradient(
    to bottom right,
    #fefcf3,
    #e6d3b3
  ); /* Degradado suave, vistoso */
  color: #4e342e; /* Marrón oscuro para el texto */
  font-family: "Georgia", serif; /* Fuente más elegante */
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.gallery-header {
  text-align: center;
  margin-bottom: 50px;
  max-width: 900px;
  padding: 20px;
}

.gallery-main-title {
  font-size: 3.8rem;
  margin-bottom: 15px;
  color: #8c5e3c; /* Marrón más intenso */
  text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.15);
  font-family: "Playfair Display", serif; /* Otra fuente elegante para títulos */
}

.gallery-description {
  font-size: 1.3rem;
  line-height: 1.8;
  color: #6d4c41;
}

.ceramics-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(320px, 1fr)
  ); /* Columnas responsivas */
  gap: 40px; /* Mayor espacio entre las tarjetas */
  width: 90%;
  max-width: 1400px;
  padding-bottom: 50px;
}

.ceramic-card {
  background-color: #fff;
  border-radius: 15px; /* Bordes más redondeados */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); /* Sombra más pronunciada */
  padding: 25px;
  text-align: center;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Para que el contenido se distribuya */
}

.ceramic-card:hover {
  transform: translateY(-8px); /* Elevación sutil al pasar el mouse */
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
}

.ceramic-title {
  font-size: 2rem;
  color: #4e342e;
  margin-bottom: 10px;
  font-family: "Playfair Display", serif;
}

.ceramic-period {
  font-size: 1.1rem;
  color: #a1887f; /* Tono de marrón más claro */
  font-style: italic;
  margin-bottom: 20px;
}

.model-viewer-wrapper {
  width: 100%;
  height: 300px; /* Altura generosa para el visor */
  margin: 0 auto 20px;
  border-radius: 10px;
  overflow: hidden; /* Asegura que el modelo no se desborde */
  position: relative;
  border: 2px solid #bfae9e; /* Borde sutil para el visor */
}

/* New placeholder div style to ensure it takes up space before model-viewer is added */
.model-viewer-placeholder {
  width: 100%;
  height: 100%;
  display: flex; /* Make it a flex container to center the model-viewer */
  justify-content: center;
  align-items: center;
  /* Add a subtle background while it's empty, or remove if you prefer transparency */
  background-color: #f8f8f8;
  border-radius: 10px;
}

.ceramic-model-viewer {
  width: 100%;
  height: 100%;
  --environment-image-filter: saturate(1.2) contrast(1.1);
  --interpolation-decay: 0.8;
  --poster-color: #f0f0f0;
}

/* Estilos para el spinner de carga de model-viewer */
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
}

.loading-spinner .spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #8c5e3c;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Estilos para el botón de AR de model-viewer */
#ar-button {
  background-color: #5d4037;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1rem;
  position: absolute; /* This might need adjustment if you only want it within model-viewer's internal layout */
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  transition: background-color 0.3s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

#ar-button:hover {
  background-color: #795548;
}

.ceramic-description {
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
  margin-top: 15px;
  flex-grow: 1;
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
