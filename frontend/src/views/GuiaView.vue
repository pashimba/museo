<template>
  <div class="guia-ninos-page">
    <div class="header-section">
      <h1 class="main-title">Guías Interactivas para Niños</h1>
      <p class="main-description">
        Elige una de nuestras guías predefinidas sobre Bolivia o crea una historia personalizada para tu visita al museo.
      </p>
    </div>


    <div class="predefined-guides-section">
      <h2 class="section-title">Nuestras Guías Populares</h2>
      <div class="cards">
        <div class="card" v-for="guia in predefinedGuides" :key="guia.titulo">
          <h3>{{ guia.titulo }}</h3>
          <p>{{ guia.descripcion }}</p>
          <button @click="playPredefinedAudio(guia.audioSrc)">🔊 Escuchar Guía</button>
        </div>
      </div>
    </div>


    <hr class="section-divider">


    <div class="story-creator-container">
      <div class="form-card">
        <h2 class="section-title">¡O Crea Tu Propia Aventura!</h2>
       
        <div class="form-group">
          <label for="storyTitle">Título de la Guía:</label>
          <input
            type="text"
            id="storyTitle"
            v-model="storyTitle"
            placeholder="El misterio del oro inca"
          />
        </div>


        <div class="form-group">
          <label for="mainCharacter">Personaje principal:</label>
          <select id="mainCharacter" v-model="mainCharacter">
            <option value="">Selecciona un personaje</option>
            <option value="un valiente explorador">Un valiente explorador</option>
            <option value="una curiosa arqueóloga">Una curiosa arqueóloga</option>
            <option value="un sabio cóndor">Un sabio cóndor</option>
            <option value="un pequeño llama">Un pequeño llama</option>
            <option value="una momia amistosa">Una momia amistosa</option>
            <option value="un puma andino">Un puma andino</option>
          </select>
        </div>


        <div class="form-group">
          <label for="historicalPeriod">Época o período:</label>
          <select id="historicalPeriod" v-model="historicalPeriod">
            <option value="">Selecciona una época</option>
            <option value="la época pre-colonial">Época Pre-Colonial</option>
            <option value="el período colonial">Período Colonial</option>
            <option value="la independencia de Bolivia">La Independencia</option>
            <option value="la república temprana">La República Temprana</option>
            <option value="los tiempos modernos">Los Tiempos Modernos</option>
          </select>
        </div>


        <div class="form-group">
          <label for="artifact">Objeto clave (opcional):</label>
          <input
            type="text"
            id="artifact"
            v-model="artifact"
            placeholder="Ej: un quipu antiguo, una máscara ceremonial"
          />
        </div>


        <div class="form-group">
          <label for="adventurePlot">Describe brevemente la aventura (2-3 frases):</label>
          <textarea
            id="adventurePlot"
            v-model="adventurePlot"
            rows="4"
            placeholder="El personaje descubre un mapa secreto que lo lleva a un tesoro oculto en los Andes."
          ></textarea>
        </div>


        <button @click="generateStoryAndAudio" :disabled="isLoading">
          <span v-if="!isLoading">Generar Guía y Audio</span>
          <span v-else><i class="spinner"></i> Generando...</span>
        </button>


        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>


      <div class="story-output-card" v-if="generatedStory">
        <h2>Tu Historia Generada</h2>
        <div class="story-text">
          <p>{{ generatedStory }}</p>
        </div>


        <div class="audio-player-section">
          <h3>Escucha la Historia:</h3>
          <button @click="playStory" :disabled="isLoadingAudio || !generatedStory">
            <span v-if="!isLoadingAudio">▶️ Reproducir Historia</span>
            <span v-else><i class="spinner"></i> Reproduciendo...</span>
          </button>
          <button @click="stopStory" v-if="isSpeaking">⏹️ Detener Audio</button>
         
          <p v-if="!speechSynthesisSupported" class="error-message">
            Tu navegador no soporta la síntesis de voz. Prueba con Chrome o Firefox.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
// Importamos los archivos de audio directamente desde la carpeta assets
// Asegúrate de tener los archivos aa.wav, bb.mp3, cc.mp3 en 'src/assets'
import audioAA from '@/assets/aa.wav';
import audioBB from '@/assets/bb.wav';
import audioCC from '@/assets/cc.wav';


export default {
  name: "GuiaNinosView",
  data() {
    return {
      // --- Datos para Guías Predefinidas ---
      predefinedGuides: [
        {
          titulo: 'La Leyenda del Ekeko',
          descripcion: 'Descubre la historia del dios de la abundancia y la fortuna en la mitología andina. ¡Un personaje lleno de alegría y regalos!',
          audioSrc: audioAA,
        },
        {
          titulo: 'El Mágico Salar de Uyuni',
          descripcion: 'Viaja al desierto de sal más grande del mundo. Conoce su origen, sus islas de cactus y por qué parece un espejo gigante.',
          audioSrc: audioBB,
        },
        {
          titulo: 'El Imperio de Tiwanaku',
          descripcion: 'Explora una de las civilizaciones más antiguas y misteriosas de América del Sur. Conoce la Puerta del Sol y sus gigantes de piedra.',
          audioSrc: audioCC,
        }
      ],
      predefinedAudioPlayer: null, // Para controlar el audio de las guías predefinidas


      // --- Datos para el Generador de Historias ---
      storyTitle: "",
      mainCharacter: "",
      historicalPeriod: "",
      artifact: "",
      adventurePlot: "",
      generatedStory: null,
      isLoading: false,
      isLoadingAudio: false,
      errorMessage: null,
      isSpeaking: false,
      speechSynthesisUtterance: null,
     
      // Nueva propiedad para verificar de forma segura el soporte de la API de voz
      speechSynthesisSupported: false,
    };
  },
  methods: {
    // --- Métodos para Guías Predefinidas ---
    playPredefinedAudio(audioSrc) {
      this.stopStory(); // Detenemos el TTS si se está reproduciendo


      if (this.predefinedAudioPlayer && !this.predefinedAudioPlayer.paused) {
        this.predefinedAudioPlayer.pause();
        if (this.predefinedAudioPlayer.src.includes(audioSrc.split('/').pop())) {
          return;
        }
      }


      this.predefinedAudioPlayer = new Audio(audioSrc);
      this.predefinedAudioPlayer.play().catch(e => {
        this.errorMessage = "No se pudo reproducir el audio. Error: " + e.message;
      });
    },


    stopPredefinedAudio() {
        if (this.predefinedAudioPlayer) {
            this.predefinedAudioPlayer.pause();
            this.predefinedAudioPlayer.currentTime = 0;
        }
    },


    // --- Métodos para el Generador de Historias ---
    generateStoryAndAudio() {
      this.stopAllAudio();
      this.isLoading = true;
      this.errorMessage = null;
      this.generatedStory = null;


      if (!this.storyTitle || !this.mainCharacter || !this.historicalPeriod || !this.adventurePlot) {
        this.errorMessage = "Por favor, completa todos los campos requeridos para generar la historia.";
        this.isLoading = false;
        return;
      }


      const storyParts = [];
      storyParts.push(`¡Hola, pequeños exploradores! Hoy les contaré una historia increíble titulada "${this.storyTitle}". `);
      storyParts.push(`Nuestra aventura comienza con ${this.mainCharacter}, `);
      storyParts.push(`un personaje muy especial que vivía en ${this.historicalPeriod} de Bolivia. `);
      storyParts.push(`Un día, ${this.adventurePlot}. `);
     
      if (this.artifact) {
        storyParts.push(`En su búsqueda, se encontró con un fascinante ${this.artifact}. `);
      } else {
        storyParts.push(`En su viaje, descubrió algo asombroso. `);
      }


      storyParts.push(`A través de desafíos y descubrimientos, ${this.mainCharacter} aprendió mucho sobre la historia y la cultura de nuestro país. `);
      storyParts.push(`¡Y así, esta increíble aventura llegó a su fin, llena de sabiduría y emoción! `);
      storyParts.push(`Recuerda que cada objeto en el museo tiene una historia esperando ser contada.`);


      this.generatedStory = storyParts.join('');
      this.isLoading = false;
    },


    playStory() {
      if (!this.speechSynthesisSupported) {
        this.errorMessage = "Tu navegador no soporta la síntesis de voz (Web Speech API).";
        return;
      }
      if (!this.generatedStory) {
        this.errorMessage = "Primero genera una historia para poder reproducirla.";
        return;
      }
     
      this.stopAllAudio();


      this.isLoadingAudio = true;
      this.isSpeaking = true;
      this.errorMessage = null;


      this.speechSynthesisUtterance = new SpeechSynthesisUtterance(this.generatedStory);


      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(voice => voice.lang.startsWith('es') && (voice.name.includes('Google') || voice.name.includes('Microsoft')));
     
      if (spanishVoice) {
        this.speechSynthesisUtterance.voice = spanishVoice;
      } else {
        const defaultSpanishVoice = voices.find(voice => voice.lang.startsWith('es'));
        if (defaultSpanishVoice) {
          this.speechSynthesisUtterance.voice = defaultSpanishVoice;
        }
      }
     
      this.speechSynthesisUtterance.pitch = 1;
      this.speechSynthesisUtterance.rate = 1;
      this.speechSynthesisUtterance.volume = 1;


      this.speechSynthesisUtterance.onend = () => {
        this.isLoadingAudio = false;
        this.isSpeaking = false;
      };


      this.speechSynthesisUtterance.onerror = (event) => {
        this.isLoadingAudio = false;
        this.isSpeaking = false;
        this.errorMessage = `Error de síntesis de voz: ${event.error}`;
      };


      window.speechSynthesis.speak(this.speechSynthesisUtterance);
    },


    stopStory() {
      if (this.isSpeaking && this.speechSynthesisSupported && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        this.isSpeaking = false;
        this.isLoadingAudio = false;
      }
    },


    stopAllAudio() {
        this.stopStory();
        this.stopPredefinedAudio();
    }
  },
  mounted() {
    // Lógica de detección movida aquí. Este código solo se ejecuta en el navegador.
    this.speechSynthesisSupported = 'speechSynthesis' in window;


    if (this.speechSynthesisSupported) {
      window.speechSynthesis.onvoiceschanged = () => {
        console.log('Voces de síntesis de voz cargadas.');
      };
    }
  },
  beforeUnmount() {
    this.stopAllAudio();
  }
};
</script>


<style scoped>
/* Colores y fuentes */
:root {
  --color-primary: #a98f6c;
  --color-secondary: #c9b19e;
  --color-accent: #f0a500;
  --color-text-dark: #3e2723;
  --color-text-light: #f5f5f5;
  --color-background-light: #fdfaf6;
  --color-border: #ddd;
  --font-primary: "Roboto", sans-serif;
  --font-secondary: "Playfair Display", serif;
}


.guia-ninos-page {
  font-family: var(--font-primary);
  color: var(--color-text-dark);
  padding: 40px 20px;
  background-color: var(--color-background-light);
  max-width: 1200px;
  margin: 0 auto;
}


.header-section {
  text-align: center;
  margin-bottom: 40px;
}


.main-title {
  font-family: var(--font-secondary);
  font-size: 3.5rem;
  color: var(--color-text-dark);
  margin-bottom: 10px;
}


.main-description {
  font-size: 1.2rem;
  color: #666;
  max-width: 700px;
  margin: 0 auto 40px;
}


/* --- Estilos para Guías Predefinidas --- */
.predefined-guides-section {
    margin-bottom: 40px;
}


.section-title {
    font-family: var(--font-secondary);
    color: var(--color-text-dark);
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 30px;
}


.cards {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}


.card {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    border: 1px solid var(--color-border);
    box-shadow: 0 6px 15px rgba(0,0,0,0.07);
    transition: transform 0.3s, box-shadow 0.3s;
    text-align: center;
}


.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}


.card h3 {
    font-size: 1.5rem;
    font-family: var(--font-secondary);
    color: var(--color-text-dark);
    margin-top: 0;
}


.card p {
    font-size: 1rem;
    color: #666;
    line-height: 1.6;
    margin: 1rem 0;
}


.card button {
    background-color: var(--color-primary);
    color: white;
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
    margin-top: 1rem;
}


.card button:hover {
    background-color: #8c7354;
}


.section-divider {
    border: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, var(--color-secondary), transparent);
    margin: 60px 0;
}


/* --- Estilos para Generador de Historias --- */
.story-creator-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: flex-start;
}


@media (max-width: 900px) {
  .story-creator-container {
    grid-template-columns: 1fr;
  }
}


.form-card,
.story-output-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  border: 1px solid var(--color-border);
  min-height: 400px;
}


.form-card .section-title,
.story-output-card h2 {
    font-size: 2rem;
    margin-top: 0;
    font-family: var(--font-secondary);
    color: var(--color-text-dark);
    text-align: center;
}




.form-group { margin-bottom: 20px; }
label { display: block; font-weight: 600; margin-bottom: 8px; color: var(--color-text-dark); }
input[type="text"], select, textarea {
  width: 100%;
  padding: 12px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  box-sizing: border-box;
}


textarea { resize: vertical; min-height: 80px; }


.form-card button {
  display: block;
  width: 100%;
  padding: 15px;
  background-color: var(--color-accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 10px;
}


.form-card button:hover:not(:disabled) {
  background-color: #e09500;
  transform: translateY(-2px);
}
.form-card button:disabled { background-color: #cccccc; cursor: not-allowed; }


.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }


.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  border: 1px solid #ef9a9a;
  text-align: center;
}


.story-text {
  background-color: #f9f9f9;
  border-left: 4px solid var(--color-primary);
  padding: 20px;
  margin-top: 20px;
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--color-text-dark);
}


.audio-player-section { margin-top: 30px; text-align: center; }
.audio-player-section h3 { font-size: 1.5rem; margin-bottom: 15px; color: var(--color-text-dark); }
.audio-player-section button {
  width: auto;
  display: inline-block;
  margin: 0 10px;
  padding: 10px 20px;
  background-color: var(--color-accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}


.audio-player-section button:hover:not(:disabled) {
    background-color: #e09500;
}
</style>

