// src/i18n.js

import { createI18n } from "vue-i18n";

// 1. Define tus textos (mensajes de traducción)
const messages = {
  es: {
    // Textos en Español
    timeline: {
      mainTitle: "Línea de Tiempo de Bolivia",
      mainDescription:
        "Un viaje interactivo a través de los momentos que han forjado la historia de nuestra nación.",
      discoverMore: "Descubrir más",
      // Eventos de la línea de tiempo
      events: {
        precolombinas: {
          title: "Culturas Precolombinas",
          description:
            "Desarrollo de civilizaciones como Wancarani, Chiripa, y la influyente Tiahuanaco en el altiplano.",
        },
        inca: {
          title: "Expansión Inca",
          description:
            "El Imperio Incaico expande su dominio sobre las vastas regiones de la actual Bolivia.",
        },
        colonial: {
          title: "Época Colonial Española",
          description:
            "Conquista y establecimiento del Alto Perú. Potosí se convierte en un centro argentífero mundial.",
        },
        // ... añade los demás eventos aquí
      },
    },
  },
  en: {
    // Textos en Inglés
    timeline: {
      mainTitle: "Timeline of Bolivia",
      mainDescription:
        "An interactive journey through the moments that have forged the history of our nation.",
      discoverMore: "Discover more",
      // Timeline Events
      events: {
        precolombinas: {
          title: "Pre-Columbian Cultures",
          description:
            "Development of civilizations such as Wancarani, Chiripa, and the influential Tiahuanaco in the highlands.",
        },
        inca: {
          title: "Inca Expansion",
          description:
            "The Inca Empire expands its domain over the vast regions of present-day Bolivia.",
        },
        colonial: {
          title: "Spanish Colonial Era",
          description:
            "Conquest and establishment of Upper Peru. Potosí becomes a global silver-mining center.",
        },
        // ... add the other events here
      },
    },
  },
};

// 2. Crea la instancia de i18n
const i18n = createI18n({
  locale: "es", // Establece el idioma inicial
  fallbackLocale: "en", // Idioma de respaldo si una traducción no existe
  messages, // Asigna los mensajes de traducción
  legacy: false, // ¡Importante! Usa el modo moderno de Vue 3
});

export default i18n;
