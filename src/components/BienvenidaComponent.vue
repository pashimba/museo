<template>
  <div id="container" class="welcome-container">
    BIENVENIDO AL
    <div id="flip">
      <div><div>DE TECNO WEB</div></div>
      <div><div>VIRTUAL</div></div>
      <div><div>MUSEO</div></div>
    </div>
    BICENTENARIO
  </div>
</template>

<script>
export default {
  name: 'BienvenidaComponent',
  mounted() {
    // La animación dura ~6 segundos, pero emitimos el evento al componente padre después de 5 segundos
    setTimeout(() => {
      this.$emit('animation-ended');
    }, 5000);  // Cambié a 5000 para que se emita después de 5 segundos
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto:700');

.welcome-container {
  color: #999;
  text-transform: uppercase;
  font-size: 36px;
  font-weight: bold;
  padding-top: 200px;
  position: fixed;
  width: 100%;
  bottom: 45%;
  text-align: center;
  z-index: 1000;
  background-color: #000;
}

#flip {
  height: 50px;
  overflow: hidden;
}

#flip > div > div {
  color: #fff;
  padding: 4px 12px;
  height: 45px;
  margin-bottom: 45px;
  display: inline-block;
}

#flip div:first-child {
  animation: show 5s linear infinite;
}

#flip div div {
  background: #42c58a;
}
#flip div:first-child div {
  background: #4ec7f3;
}
#flip div:last-child div {
  background: #DC143C;
}

@keyframes show {
  0% { margin-top: -270px; }
  5% { margin-top: -180px; }
  33% { margin-top: -180px; }
  38% { margin-top: -90px; }
  66% { margin-top: -90px; }
  71% { margin-top: 0px; }
  99.99% { margin-top: 0px; }
  100% { margin-top: -270px; }
}
</style>
