<template>
  <div class="game-page">
    <div class="game-header">
      <h1 class="game-main-title">Juego de Trivia: Historia de Bolivia</h1>
      <p class="game-description">Pon a prueba tus conocimientos sobre la historia de Bolivia con nuestro emocionante juego de trivia. ¡Responde preguntas, completa desafíos y escala en la tabla de puntuaciones!</p>
    </div>

    <div class="game-content">
      <div class="game-section">
        <h2>¿Cómo Jugar?</h2>
        <p>El juego es una aplicación de escritorio desarrollada en Python. Para jugar, sigue estos pasos:</p>
        <ol>
          <li>Haz clic en el botón "Descargar Juego" para obtener el archivo ejecutable.</li>
          <li>Una vez descargado, ejecuta el archivo `HistoriaBoliviaJuego.exe` (o el equivalente para tu sistema operativo).</li>
          <li>Sigue las instrucciones en pantalla para interactuar con los personajes, buscar objetos, ordenar eventos y completar el rompecabezas.</li>
          <li>¡Compite por la mejor puntuación y deja tu nombre en el ranking!</li>
        </ol>
        <a href="/downloads/HistoriaBoliviaJuego.exe" download class="game-download-button">
          <i class="fas fa-download"></i> Descargar Juego
        </a>
        <p class="download-note">*Compatible con Windows. Asegúrate de tener los permisos necesarios para ejecutar el archivo.</p>
      </div>

      <div class="game-section game-showcase">
        <h2>Mira el Juego en Acción</h2>
        <div class="video-container">
          <iframe 
            src="https://www.youtube.com/embed/YOUR_GAME_VIDEO_ID" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
        <p class="video-caption">Video demostrativo de la jugabilidad.</p>

        <div class="screenshots-container">
          <img src="@/assets/game_screenshots/game_ss1.png" alt="Captura de Pantalla 1" class="game-screenshot">
          <img src="@/assets/game_screenshots/game_ss2.png" alt="Captura de Pantalla 2" class="game-screenshot">
          <img src="@/assets/game_screenshots/game_ss3.png" alt="Captura de Pantalla 3" class="game-screenshot">
        </div>
        <p class="screenshot-caption">Galería de capturas de pantalla del juego.</p>
      </div>

      <div class="game-section">
        <h2>Características del Juego</h2>
        <ul>
          <li>Trivia de historia boliviana con personajes interactivos.</li>
          <li>Búsqueda de objetos ocultos por tiempo.</li>
          <li>Desafío de ordenamiento cronológico de eventos.</li>
          <li>Rompecabezas interactivo con temporizador.</li>
          <li>Sistema de puntuación y vidas.</li>
          <li>Guardado de puntuaciones con nombres de jugadores y ranking.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameView',
};
</script>

<style scoped>
.game-page {
  background-color: #f5f5f5;
  min-height: calc(100vh - 80px);
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-header {
  text-align: center;
  margin-bottom: 40px;
  color: #4E342E;
}

.game-main-title {
  font-family: 'Georgia', serif;
  font-size: 3.5rem;
  margin-bottom: 10px;
}

.game-description {
  font-size: 1.2rem;
  max-width: 900px;
  margin: 0 auto;
  color: #555;
}

.game-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  max-width: 1200px;
  width: 100%;
}

.game-section {
  flex: 1 1 45%; /* Allows two columns on wider screens */
  background-color: #FFF;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  padding: 30px;
  box-sizing: border-box;
  min-width: 300px; /* Ensures it doesn't get too small */
}

.game-section h2 {
  font-family: 'Georgia', serif;
  font-size: 2rem;
  color: #6D4C41;
  margin-bottom: 20px;
  text-align: center;
}

.game-section p, .game-section ol, .game-section ul {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 15px;
}

.game-section ol, .game-section ul {
  padding-left: 25px;
}

.game-download-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  background-color: #A1887F;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  margin-top: 20px;
}

.game-download-button:hover {
  background-color: #8D6E63;
  transform: translateY(-3px);
}

.download-note {
  font-size: 0.9rem;
  color: #777;
  margin-top: 10px;
  text-align: center;
}

.game-showcase {
  text-align: center;
}

.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.video-caption, .screenshot-caption {
  font-size: 0.95rem;
  color: #666;
  margin-top: 10px;
  font-style: italic;
}

.screenshots-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.game-screenshot {
  width: 100%;
  max-width: 280px; /* Adjust size of screenshots */
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.game-screenshot:hover {
  transform: scale(1.03);
}

@media (max-width: 768px) {
  .game-section {
    flex: 1 1 100%; /* Stacks columns on smaller screens */
  }
}
</style>