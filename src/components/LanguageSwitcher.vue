<template>
  <div class="language-switcher">
    <select v-model="selectedLocale" @change="handleLanguageChange">
      <option value="es">Español</option>
      <option value="en">English</option>
      <option value="mute">Silencio 🔇</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "LanguageSwitcher",
  data() {
    return {
      selectedLocale: this.$i18n.locale,
      currentAudio: null,
      currentAudioKey: null,
    };
  },
  methods: {
    handleLanguageChange() {
      // Cambiar idioma si es válido
      if (this.selectedLocale === "es" || this.selectedLocale === "en") {
        this.$i18n.locale = this.selectedLocale;
      }

      // Detener audio actual si hay uno sonando
      if (this.currentAudio && !this.currentAudio.paused) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }

      // Lógica de silencio
      if (this.selectedLocale === "mute") {
        this.currentAudio = null;
        this.currentAudioKey = null;
        return;
      }

      // Evitar volver a reproducir el mismo audio si ya está activo
      if (this.currentAudioKey === this.selectedLocale) return;

      // Definir el nuevo audio
      let audioSrc = "";
      if (this.selectedLocale === "es") {
        audioSrc = require('@/assets/es-aud.mp3');
      } else if (this.selectedLocale === "en") {
        audioSrc = require('@/assets/en-aud.mp3');
      }

      const audio = new Audio(audioSrc);
      this.currentAudio = audio;
      this.currentAudioKey = this.selectedLocale;

      audio.play().catch(err => {
        console.error("Error al reproducir el audio:", err);
      });
    }
  }
};
</script>

<style scoped>
.language-switcher {
  display: flex;
  justify-content: center;
  padding: 0 1.5rem;
  margin: 1rem 0;
}

.language-switcher select {
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background-color: rgba(255, 255, 255, 0.1);
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  color: #ffffff;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  outline: none;
  
}

/* Estilo para los option */
.language-switcher select option {
  background-color: #1f1f1f;
  color: #ffffff;
}

/* Hover y focus */
.language-switcher select:hover {
  border-color: rgba(255, 255, 255, 0.6);
  background-color: rgba(255, 255, 255, 0.15);
}

.language-switcher select:focus {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}
</style>
