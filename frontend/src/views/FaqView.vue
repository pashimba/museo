<template>
  <div class="faq-container">
    <div class="faq-card">
      <h1 class="faq-title">Preguntas Frecuentes</h1>
      <div class="faq-intro-text">
        <p>
          Se ofrece aquí respuesta a una selección de las preguntas más
          frecuentes
        </p>
        <p>
          planteadas por los usuarios del servicio de consultas lingüísticas.
        </p>
      </div>


      <!-- Aquí puedes añadir la sección de filtros si deseas replicar la imagen completamente -->
      <!-- <div class="filter-section">
        <label class="filter-checkbox-label">
          <input type="checkbox" class="filter-checkbox" />
          <span class="filter-text">Gramaticales</span>
        </label>
        <label class="filter-checkbox-label">
          <input type="checkbox" class="filter-checkbox" />
          <span class="filter-text">Léxicas</span>
        </label>
        <label class="filter-checkbox-label">
          <input type="checkbox" class="filter-checkbox" />
          <span class="ml-2 text-sm text-gray-700">Ortográficas</span>
        </label>
      </div> -->


      <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
        <button
          @click="toggleFaq(index)"
          class="faq-button"
          :class="{ 'faq-button-open': faq.isOpen }"
        >
          <span>{{ faq.question }}</span>
          <svg
            :class="{ 'rotate-180': faq.isOpen }"
            class="faq-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
        <div
          v-show="faq.isOpen"
          class="faq-answer-wrapper"
          :style="{
            maxHeight: faq.isOpen ? '500px' : '0px',
            overflow: 'hidden',
          }"
        >
          <p class="faq-answer-text">{{ faq.answer }}</p>
        </div>
      </div>


      <div class="faq-contact-info">
        ¿No encuentras tu pregunta? Contáctanos en support@boliviagame.com
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "FaqView",
  data() {
    return {
      faqs: [
        {
          question: '¿Cómo se juega "Historia de Bolivia: El Juego"?',
          answer:
            "El juego se divide en varios niveles. En el Nivel 1, interactúas con personajes para responder preguntas de trivia. En el Nivel 2, buscas objetos ocultos en un tiempo limitado. En el Nivel 3, ordenas personajes cronológicamente. Y en el Nivel 4, resuelves un rompecabezas. Cada nivel te da puntos, pero perder vidas te resta puntos.",
          isOpen: false,
        },
        {
          question: "¿Cómo gano puntos en el juego?",
          answer:
            "Ganas puntos respondiendo correctamente las preguntas de trivia, encontrando objetos rápidamente y completando el rompecabezas. Responder a la primera o segunda oportunidad en el trivia te da más puntos.",
          isOpen: false,
        },
        {
          question: "¿Qué sucede si me quedo sin vidas?",
          answer:
            "Si tus vidas llegan a cero en cualquier momento del juego, la partida termina y tendrás la opción de reiniciar y guardar tu puntuación (si es una de las más altas).",
          isOpen: false,
        },
        {
          question: "¿Mis puntuaciones se guardan?",
          answer:
            "Sí, tus puntuaciones se guardan localmente en tu navegador. Puedes ver las mejores puntuaciones de todos los tiempos en la tabla de clasificación al finalizar el juego.",
          isOpen: false,
        },
        {
          question: "¿Puedo jugar en diferentes dispositivos?",
          answer:
            "Actualmente, el juego guarda las puntuaciones solo en el dispositivo que estás usando. Si cambias de dispositivo o de navegador, tu historial de puntuaciones no se transferirá automáticamente.",
          isOpen: false,
        },
      ],
    };
  },
  methods: {
    toggleFaq(index) {
      this.faqs.forEach((faq, i) => {
        if (i === index) {
          faq.isOpen = !faq.isOpen;
        } else {
          faq.isOpen = false; // Cierra las otras FAQ cuando una se abre
        }
      });
    },
  },
};
</script>


<style scoped>
/* Importa la fuente Inter si no está ya disponible globalmente */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap");


.faq-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(
    to bottom right,
    #cdcfc7,
    #c9d4aa
  ); /* from-blue-500 to-purple-600 */
  padding: 1rem; /* p-4 */
}


.faq-card {
  width: 100%;
  max-width: 42rem; /* max-w-2xl */
  background-color: rgba(255, 255, 255, 0.95); /* bg-white bg-opacity-95 */
  border-radius: 1rem; /* rounded-2xl */
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1); /* shadow-xl */
  padding: 1.5rem; /* p-6 */
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
}


.faq-title {
  font-size: 2.25rem; /* text-3xl */
  font-weight: 800; /* font-extrabold */
  text-align: center;
  color: #374151; /* text-gray-800 */
  margin-bottom: 1.5rem; /* mb-6 */
  font-family: "Inter", sans-serif;
}


.faq-intro-text {
  text-align: center;
  margin-bottom: 1.5rem; /* mb-6 */
}


.faq-intro-text p {
  color: #4b5563; /* text-gray-600 */
  font-size: 0.875rem; /* text-sm */
}


/* Opcional: Estilos para la sección de filtros si se descomenta */
/*
.filter-section {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}


.filter-checkbox-label {
  display: inline-flex;
  align-items: center;
}


.filter-checkbox {
  color: #2563EB;
  border-radius: 0.25rem;
}


.filter-text {
  margin-left: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}
*/


.faq-item {
  background-color: #f9fafb; /* bg-gray-50 */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
  overflow: hidden;
}


.faq-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem; /* py-3 px-4 */
  font-size: 1rem; /* text-base */
  font-weight: 600; /* font-semibold */
  text-align: left;
  color: #374151; /* text-gray-800 */
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none; /* focus:outline-none */
  transition: background-color 0.3s ease-in-out; /* transition-colors duration-300 */
  border-radius: 0.5rem; /* rounded-lg */
}


.faq-button:hover {
  background-color: #f3f4f6; /* hover:bg-gray-100 */
}


.faq-button-open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}


.faq-icon {
  width: 1.25rem; /* w-5 */
  height: 1.25rem; /* h-5 */
  color: #d1d1d0; /* text-gray-600 */
  transform-origin: center;
  transition: transform 0.3s ease-in-out; /* transform transition-transform duration-300 */
}


.faq-icon.rotate-180 {
  transform: rotate(180deg);
}


.faq-answer-wrapper {
  padding: 0 1rem 1rem; /* px-4 pb-4 */
  color: #4b5563; /* text-gray-700 */
  font-size: 0.875rem; /* text-sm */
  line-height: 1.5; /* leading-relaxed */
  transition: max-height 0.3s ease-in-out; /* transition-all duration-300 ease-in-out */
}


.faq-answer-text {
  border-top: 1px solid #e5e7eb; /* border-t border-gray-200 */
  padding-top: 0.75rem; /* pt-3 */
}


.faq-contact-info {
  text-align: center;
  padding-top: 1.5rem; /* pt-6 */
  color: #4b5563; /* text-gray-700 */
  font-size: 0.75rem; /* text-xs */
}
</style>



