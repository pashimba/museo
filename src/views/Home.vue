<template>
  <div class="home-wrapper">
    <div class="hero-section">
      <h1 class="hero-title">Descubre la Fascinante Historia de Bolivia</h1>
      <p class="hero-subtitle">Un viaje interactivo a través del tiempo y la cultura</p>
      <router-link to="/linea-del-tiempo" class="u-button-style hero-button">Explora la Línea de Tiempo</router-link>
    </div>

    <div class="cont s--inactive">
      <div class="cont__inner">
        <div class="el" v-for="(section, index) in sections" :key="index" @click="toggleActive(index)" :class="{'s--active': activeIndex === index}">
          <div class="el__overflow">
            <div class="el__inner">
              <div class="el__bg" :style="{ backgroundImage: `url(${section.image})` }"></div>
              <div class="el__preview-cont">
                <h2 class="el__heading">{{ section.title }}</h2>
              </div>
              <div class="el__content">
                <div class="el__text">
                  <h1>{{section.title}}</h1>
                  <p>{{section.text}}</p>
                  <router-link :to="section.link" class="content-button" v-if="section.link">Ver más</router-link>
                </div>
                <div class="el__close-btn" @click.stop="deactivate"></div>
              </div>
            </div>
          </div>
          <div class="el__index">
            <div class="el__index-back">{{ index + 1 }}</div>
            <div class="el__index-front">
              <div class="el__index-overlay" :data-index="index + 1">{{ index + 1 }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section class="about-museum-section">
      <h2>Acerca del Museo Virtual</h2>
      <p>Nuestro Museo Virtual de la Historia de Bolivia es una iniciativa para preservar y difundir el rico patrimonio cultural y los momentos clave que forjaron nuestra nación. A través de exhibiciones interactivas, líneas de tiempo detalladas, galerías inmersivas y juegos educativos, buscamos hacer la historia accesible y emocionante para todos.</p>
      <p>¡Sumérgete y descubre los secretos y héroes de Bolivia!</p>
    </section>

  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      activeIndex: null, // To manage active state for sections
      sections: [
        { title: 'Identidad', image: require('@/assets/images/a.jpg'), text: "La identidad es el alma de nuestra comunidad, reflejada en nuestra rica diversidad cultural y el legado de nuestros ancestros.", link: "/galeria" },
        { title: 'Raíces Precolombinas', image: require('@/assets/images/b.jpg'), text: "Explora las civilizaciones antiguas que florecieron en nuestro territorio, desde Tiwanaku hasta los imperios incaicos, dejando un legado arquitectónico y cultural invaluable.", link: "/linea-del-tiempo" },
        { title: 'Conquista y Colonia', image: require('@/assets/images/c.jpg'), text: "El impacto de la llegada europea y la formación de la sociedad colonial, la explotación minera y las primeras rebeliones indígenas.", link: "/linea-del-tiempo" },
        { title: 'Independencia', image: require('@/assets/images/d.jpg'), text: "La lucha heroica por la emancipación, las batallas decisivas y los líderes que forjaron la República de Bolivia.", link: "/linea-del-tiempo" },
        { title: 'Bolivia Contemporánea', image: require('@/assets/images/e.jpg'), text: "Desde el nacimiento de la República hasta los desafíos y transformaciones del siglo XXI, un recorrido por la Bolivia moderna.", link: "/linea-del-tiempo" }
      ]
    };
  },
  mounted() {
    const cont = document.querySelector('.cont');
    const els = document.querySelectorAll('.el');

    els.forEach(el => {
      el.addEventListener('click', () => {
        if (el.classList.contains('s--active')) return;
        cont.classList.add('s--active');
        el.classList.add('s--active');
        this.activeIndex = Array.from(els).indexOf(el); // Set active index
      });
    });

    document.querySelector('.cont').addEventListener('click', (e) => {
      if (!e.target.closest('.el') || e.target.closest('.el__close-btn')) {
        this.deactivate();
      }
    });
  },
  methods: {
    toggleActive(index) {
      if (this.activeIndex === index) {
        this.deactivate(); // If clicking active, deactivate
      } else {
        const cont = document.querySelector('.cont');
        const els = document.querySelectorAll('.el');
        cont.classList.add('s--active');
        els[index].classList.add('s--active');
        this.activeIndex = index;
      }
    },
    deactivate() {
      const cont = document.querySelector('.cont');
      const activeEl = document.querySelector('.el.s--active');
      if (activeEl) {
        activeEl.classList.remove('s--active');
      }
      cont.classList.remove('s--active');
      this.activeIndex = null;
    }
  }
}
</script>

<style>
/* General body styling - moved to app.vue global styles for consistency */

.home-wrapper {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px); /* Adjust based on header height */
  /* Remove fixed height for main content */
}

.hero-section {
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('@/assets/hero_bg.jpg') no-repeat center center/cover; /* Example hero image */
  color: white;
  text-align: center;
  padding: 100px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px; /* Minimum height for hero */
}

.hero-title {
  font-family: 'Georgia', serif;
  font-size: 3.5rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 30px;
  max-width: 700px;
  line-height: 1.6;
}

.hero-button {
  display: inline-block;
  padding: 15px 30px;
  background-color: #A1887F; /* Soft brown */
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.hero-button:hover {
  background-color: #8D6E63;
  transform: translateY(-3px);
}


/* Existing .cont and .el styles - ensure they work well with the new hero section */
/* You might want to adjust their margins/positioning */
.cont {
  position: relative; /* Changed to relative for flow */
  /* height: 100vh; Removed fixed height */
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px 0; /* Add some padding */
  background-color: #f8f8f8; /* Light background for sections */
}

.cont__inner {
  position: relative;
  width: 90%; /* Make it responsive */
  max-width: 1200px; /* Max width for larger screens */
  height: 500px; /* Adjust height for the carousel */
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 2000px; /* For 3D effect */
}

.el {
  position: absolute;
  width: 20%; /* Adjust width for more cards */
  height: 100%;
  left: 0;
  right: 0;
  margin: auto;
  cursor: pointer;
  -webkit-transition: -webkit-transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: -webkit-transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1), -webkit-transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  border-radius: 10px;
  overflow: hidden;
}

.el:nth-child(1) { transform: translate3d(-180%, 0, -200px); }
.el:nth-child(2) { transform: translate3d(-90%, 0, -100px); }
.el:nth-child(3) { transform: translate3d(0, 0, 0); } /* Center */
.el:nth-child(4) { transform: translate3d(90%, 0, -100px); }
.el:nth-child(5) { transform: translate3d(180%, 0, -200px); }
/* Add more if you have more sections */

.cont.s--active .el {
  cursor: default;
}

.cont.s--active .el:nth-child(1) { transform: translate3d(-60%, 0, -200px); }
.cont.s--active .el:nth-child(2) { transform: translate3d(-30%, 0, -100px); }
.cont.s--active .el:nth-child(3) { transform: translate3d(0, 0, 0); }
.cont.s--active .el:nth-child(4) { transform: translate3d(30%, 0, -100px); }
.cont.s--active .el:nth-child(5) { transform: translate3d(60%, 0, -200px); }

/* When an element is active, others shift */
.cont.s--active .el.s--active ~ .el {
    -webkit-transform: translate3d(100%, 0, -200px);
            transform: translate3d(100%, 0, -200px);
}
.cont.s--active .el.s--active ~ .el:nth-child(2) { /* Adjust for previous elements */
    -webkit-transform: translate3d(-100%, 0, -200px);
            transform: translate3d(-100%, 0, -200px);
}

/* Specific active item styling */
.el.s--active {
  z-index: 1;
  width: 60%; /* Active element takes more width */
  -webkit-transform: translate3d(0, 0, 0);
          transform: translate3d(0, 0, 0);
  -webkit-transition: width 0.7s 0.7s, z-index 0s, -webkit-transform 0.6s;
  transition: width 0.7s 0.7s, z-index 0s, -webkit-transform 0.6s;
  transition: transform 0.6s, width 0.7s 0.7s, z-index 0s;
  transition: transform 0.6s, width 0.7s 0.7s, z-index 0s, transform 0.6s, width 0.7s 0.7s, z-index 0s;
}

/* Background image styling */
.el__bg {
  transform: translate3d(0, 0, 0);
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* Adjustments for content display */
.el__content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  background-color: rgba(0,0,0,0.7); /* Dark overlay */
  color: white;
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 2;
}

.el.s--active .el__content {
  opacity: 1;
}

.el__text h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #FFECB3;
}

.el__text p {
  font-size: 1.1rem;
  line-height: 1.6;
  text-align: center;
  max-width: 600px;
  margin-bottom: 20px;
}

.content-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #8D6E63;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.content-button:hover {
  background-color: #A1887F;
}

.el__close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 30px;
  height: 30px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.el.s--active .el__close-btn {
  opacity: 1;
}

.el__close-btn::before, .el__close-btn::after {
  content: '';
  position: absolute;
  width: 70%;
  height: 2px;
  background-color: #4E342E;
}

.el__close-btn::before { transform: rotate(45deg); }
.el__close-btn::after { transform: rotate(-45deg); }

/* About Museum Section */
.about-museum-section {
  padding: 80px 20px;
  background-color: #EDE7E4; /* Light, warm background */
  text-align: center;
  margin-top: 50px;
}

.about-museum-section h2 {
  font-family: 'Georgia', serif;
  font-size: 2.8rem;
  color: #4E342E;
  margin-bottom: 30px;
}

.about-museum-section p {
  max-width: 800px;
  margin: 0 auto 15px auto;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
}

/* Ensure images for sections (a.jpg, b.jpg, etc.) exist in assets/images */
</style>