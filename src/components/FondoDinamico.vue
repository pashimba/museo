<template>
    <div class="fondo-flotante">
      <button class="toggle-button" @click="mostrarPaleta = !mostrarPaleta">
        🎨
      </button>
      <div v-if="mostrarPaleta" class="paleta">
        <div
          v-for="(gradiente, index) in gradientes"
          :key="index"
          class="color-circulo"
          :style="{ background: gradiente }"
          @click="cambiarFondo(gradiente)"
          :title="'Fondo ' + (index + 1)"
        ></div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FondoDinamico',
    data() {
      return {
        mostrarPaleta: false,
        gradientes: [
          'linear-gradient(135deg, #ff9a9e, #fad0c4)',
          'linear-gradient(135deg, #a18cd1, #fbc2eb)',
          'linear-gradient(135deg, #fad0c4, #ffd1ff)',
          'linear-gradient(135deg, #ffecd2, #fcb69f)',
          'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
          'linear-gradient(135deg, #667eea, #764ba2)',
          'linear-gradient(135deg, #89f7fe, #66a6ff)',
          'linear-gradient(135deg, #f6d365, #fda085)',
          'linear-gradient(135deg, #ff6a00, #ee0979)'
        ]
      };
    },
    mounted() {
      const fondoGuardado = localStorage.getItem('fondoGaleria');
      if (fondoGuardado) {
        document.body.style.background = fondoGuardado;
      }
    },
    methods: {
      cambiarFondo(gradiente) {
        document.body.style.background = gradiente;
        localStorage.setItem('fondoGaleria', gradiente);
      }
    }
  };
  </script>
  
  <style scoped>
  .fondo-flotante {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
  }
  
  .toggle-button {
    background: white;
    border: none;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    font-size: 1.2rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .toggle-button:hover {
    transform: scale(1.1);
  }
  
  .paleta {
    margin-top: 10px;
    background: rgba(255, 255, 255, 0.9);
    padding: 8px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .color-circulo {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    transition: transform 0.2s;
  }
  
  .color-circulo:hover {
    transform: scale(1.2);
  }
  </style>
  