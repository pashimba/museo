<template>
  <div class="mapa-interactivo-page">
    <div class="mapa-header">
      <h1 class="mapa-main-title">
        Mapa Interactivo de la Independencia de Bolivia
      </h1>
      <p class="mapa-description">
        Explora los eventos clave y lugares históricos de la independencia
        boliviana.
      </p>
    </div>

    <div class="mapa-container">
      <div id="interactive-map">
        <p class="map-placeholder-text">Cargando mapa interactivo...</p>
        <p class="map-placeholder-text">
          Implementación de mapa (ej. Leaflet.js) iría aquí.
        </p>
      </div>

      <div class="mapa-controls">
        <h3>Filtros y Navegación</h3>
        <div class="filter-group">
          <label for="filterDate">Filtrar por Fecha:</label>
          <input
            type="date"
            id="filterDate"
            v-model="filterDate"
            @change="applyMapFilters"
          />
        </div>
        <div class="filter-group">
          <label for="filterEvent">Buscar Evento:</label>
          <input
            type="text"
            id="filterEvent"
            v-model="searchEvent"
            placeholder="Ej. Batalla de Ayacucho"
            @input="applyMapFilters"
          />
        </div>
        <button @click="resetMapFilters">Limpiar Filtros</button>
      </div>

      <div class="event-list">
        <h3>Eventos Destacados</h3>
        <div
          class="event-item"
          v-for="event in filteredMapEvents"
          :key="event.id"
        >
          <h4>{{ event.title }} ({{ event.date }})</h4>
          <p>{{ event.description }}</p>
          <button @click="showEventDetails(event.id)">Ver en Mapa</button>
        </div>
        <p v-if="filteredMapEvents.length === 0">
          No hay eventos para mostrar con los filtros aplicados.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
// Puedes importar librerías de mapas aquí, como Leaflet.js
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

export default {
  name: "MapaInteractivoView",
  data() {
    return {
      map: null, // Variable para la instancia del mapa
      filterDate: "",
      searchEvent: "",
      mapEvents: [
        {
          id: 1,
          title: "Primer Grito Libertario",
          date: "25 de Mayo de 1809",
          description: "Revolución de Chuquisaca, actual Sucre.",
          coords: [-19.033333, -65.2625],
        },
        {
          id: 2,
          title: "Revolución de La Paz",
          date: "16 de Julio de 1809",
          description: "Pedro Domingo Murillo y la Junta Tuitiva.",
          coords: [-16.5, -68.15],
        },
        {
          id: 3,
          title: "Batalla de Ayacucho",
          date: "9 de Diciembre de 1824",
          description:
            "Victoria final de los independentistas que selló la independencia de Sudamérica.",
          coords: [-13.166667, -74.225],
        },
        {
          id: 4,
          title: "Declaración de Independencia",
          date: "6 de Agosto de 1825",
          description: "Fundación de la República de Bolivia en Sucre.",
          coords: [-19.033333, -65.2625],
        },
        // Agrega más eventos históricos con sus coordenadas
      ],
    };
  },
  computed: {
    filteredMapEvents() {
      let filtered = this.mapEvents;
      if (this.filterDate) {
        // Filtrar por fecha
        filtered = filtered.filter((event) =>
          event.date.includes(this.filterDate)
        ); // Simplificado, idealmente compara fechas
      }
      if (this.searchEvent) {
        const searchLower = this.searchEvent.toLowerCase();
        filtered = filtered.filter(
          (event) =>
            event.title.toLowerCase().includes(searchLower) ||
            event.description.toLowerCase().includes(searchLower)
        );
      }
      return filtered;
    },
  },
  mounted() {
    this.initializeMap();
  },
  methods: {
    initializeMap() {
      // ** Aquí es donde integrarías tu librería de mapas **
      // Ejemplo con Leaflet.js (asumiendo que está instalado y importado):
      // this.map = L.map('interactive-map').setView([-17.5, -64.5], 6); // Centro de Bolivia, zoom 6
      // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      // }).addTo(this.map);

      // // Añadir marcadores para cada evento
      // this.mapEvents.forEach(event => {
      //   L.marker(event.coords)
      //     .addTo(this.map)
      //     .bindPopup(`<b>${event.title}</b><br>${event.description}`);
      // });

      console.log("Mapa interactivo inicializado (Placeholder)");
    },
    applyMapFilters() {
      // Lógica para aplicar filtros al mapa (ej. actualizar marcadores)
      console.log("Aplicando filtros:", this.filterDate, this.searchEvent);
      // Tendrías que limpiar los marcadores existentes y añadir solo los filtrados
    },
    resetMapFilters() {
      this.filterDate = "";
      this.searchEvent = "";
      this.applyMapFilters(); // Vuelve a mostrar todos los eventos
    },
    showEventDetails(id) {
      const event = this.mapEvents.find((e) => e.id === id);
      if (event && this.map) {
        // Lógica para centrar el mapa en el evento y abrir su popup
        // this.map.flyTo(event.coords, 10); // Volar a la ubicación del evento, zoom 10
        // L.marker(event.coords).addTo(this.map).openPopup(); // Abrir popup (esto recrearía el marcador, mejor referenciar el existente)
        console.log("Mostrando detalles del evento en el mapa:", event.title);
      }
    },
  },
};
</script>

<style scoped>
.mapa-interactivo-page {
  padding-top: 80px; /* Ajusta para el header fijo */
  min-height: 100vh;
  background-color: #f0f8ff; /* Un azul muy claro */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.mapa-header {
  text-align: center;
  margin-bottom: 30px;
  max-width: 900px;
  padding: 0 20px;
}

.mapa-main-title {
  font-size: 3rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.mapa-description {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
}

.mapa-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 95%;
  max-width: 1200px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 25px;
}

#interactive-map {
  width: 100%;
  height: 500px; /* Altura fija para el mapa */
  background-color: #e0e0e0; /* Color de fondo mientras se carga el mapa */
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
  font-style: italic;
  font-size: 1.2rem;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
}

.map-placeholder-text {
  margin: 5px 0;
}

.mapa-controls {
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #eee;
}

.mapa-controls h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.6rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.filter-group label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #444;
}

.filter-group input[type="date"],
.filter-group input[type="text"] {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.mapa-controls button {
  padding: 10px 20px;
  background-color: #42b983; /* Un color de acento para el botón */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.mapa-controls button:hover {
  background-color: #369c71;
}

.event-list {
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #eee;
}

.event-list h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.6rem;
}

.event-item {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.event-item h4 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 5px;
}

.event-item p {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 10px;
}

.event-item button {
  padding: 8px 15px;
  background-color: #5cb85c; /* Botón verde */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.event-item button:hover {
  background-color: #4cae4c;
}

/* Responsive */
@media (max-width: 768px) {
  .mapa-main-title {
    font-size: 2.2rem;
  }
  .mapa-description {
    font-size: 1rem;
  }
  .mapa-container {
    flex-direction: column;
    padding: 15px;
    gap: 15px;
  }
  #interactive-map {
    height: 350px;
  }
  .mapa-controls,
  .event-list {
    padding: 15px;
  }
}
</style>
