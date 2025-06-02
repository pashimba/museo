<template>
  <div class="detalle-obra-container">
    <div v-if="isLoading" class="loading-spinner">
      <div class="spinner"></div>
      <p>Cargando obra 3D...</p>
    </div>

    <div v-else-if="errorMessage" class="error-message">
      <p>{{ errorMessage }}</p>
      <button @click="fetchObraDetails">Reintentar</button>
    </div>

    <div v-else-if="obra" class="obra-content">
      <h1 class="obra-title">{{ obra.title }}</h1>
      <p class="obra-artist">{{ obra.artist }}</p>

      <div class="model-viewer-container">
        <gl-renderer
          ref="renderer"
          :width="rendererWidth"
          :height="rendererHeight"
          antialias
          clearColor="#f5f5f5"
        >
          <gl-scene>
            <gl-camera :position="[0, 0, 5]" :fov="75" :near="0.1" :far="1000"></gl-camera>
            <gl-ambient-light :intensity="1.2"></gl-ambient-light>
            <gl-directional-light :position="[1, 1, 1]" :intensity="1.0"></gl-directional-light>
            <gl-directional-light :position="[-1, -1, -1]" :intensity="0.8"></gl-directional-light>

            <template v-if="loadedModelObject">
              <gl-model :object="loadedModelObject" :scale="[1.0, 1.0, 1.0]" />
            </template>
            <template v-else>
              <gl-mesh :position="[0, 0, 0]" :rotation="[0, Math.PI / 4, 0]">
                <gl-box-geometry :width="0.8" :height="0.8" :depth="0.8" />
                <gl-mesh-basic-material :color="'#795548'" />
              </gl-mesh>
            </template>
          </gl-scene>
        </gl-renderer>
      </div>

      <div class="obra-description">
        <h2>Descripción</h2>
        <p>{{ obra.description }}</p>
        <p><strong>Período:</strong> {{ obra.periodo }}</p>
      </div>

      <button @click="goBack" class="back-button">Volver a la Galería</button>
    </div>

    <div v-else class="no-obra-found">
      <p>La obra no se encontró.</p>
      <button @click="goBack" class="back-button">Volver a la Galería</button>
    </div>
  </div>
</template>

<script>
// La línea 'import * as Three from 'three';' ha sido eliminada
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three-orbitcontrols-ts'; // O 'three/examples/jsm/controls/OrbitControls.js'
import { Renderer, Scene, Camera, AmbientLight, DirectionalLight, Mesh, BoxGeometry, MeshBasicMaterial, Model } from 'vue-gl';

export default {
  name: 'DetalleObra',
  components: {
    'gl-renderer': Renderer,
    'gl-scene': Scene,
    'gl-camera': Camera,
    'gl-ambient-light': AmbientLight,
    'gl-directional-light': DirectionalLight,
    'gl-mesh': Mesh,
    'gl-box-geometry': BoxGeometry,
    'gl-mesh-basic-material': MeshBasicMaterial,
    'gl-model': Model,
  },
  data() {
    return {
      obra: null,
      isLoading: true,
      errorMessage: '',
      loadedModelObject: null, // Objeto THREE.Object3D para el modelo cargado
      rendererWidth: 0,
      rendererHeight: 0,
      orbitControls: null,
      all3dModels: [
        { id: 1, title: 'Obra 3D A: Vaso Antiguo', artist: 'Artista A', description: 'Un vaso ceremonial precolombino con intrincados grabados que representan deidades y la vida cotidiana. Hecho de cerámica cocida, este objeto ofrece una visión profunda de las creencias y la artesanía de las civilizaciones andinas. Su superficie cuenta historias de un pasado glorioso y rituales ancestrales. Es un testimonio de la rica herencia cultural de la región.', periodo: 'Precolombino', imageUrl: require('@/assets/images/a.jpg'), modelUrl: require('@/assets/modelos/a.glb') },
        { id: 2, title: 'Obra 3D B: Escultura Colonial', artist: 'Artista B', description: 'Una escultura de madera policromada que data del período colonial, reflejando la fusión de las tradiciones artísticas indígenas y europeas. Representa una figura religiosa con detalles realistas y una expresión serena. La técnica de dorado y la riqueza de los colores muestran la influencia barroca en el arte de la época. Esta pieza es un ejemplo clave de la evangelización a través del arte.', periodo: 'Colonial', imageUrl: require('@/assets/images/b.jpg'), modelUrl: require('@/assets/modelos/b.glb') },
        { id: 3, title: 'Obra 3D C: Busto Republicano', artist: 'Artista C', description: 'Un busto de bronce de un prócer de la independencia, elaborado a principios del período republicano. La obra captura la seriedad y el idealismo de la era, con un enfoque en el realismo y la dignidad del personaje. Su presencia imponente evoca el espíritu de libertad y la construcción de una nueva nación. Es un homenaje a los héroes que forjaron la república.', periodo: 'Republicano', imageUrl: require('@/assets/images/c.jpg'), modelUrl: require('@/assets/modelos/c.glb') },
        { id: 4, title: 'Obra 3D D: Instalación Moderna', artist: 'Artista D', description: 'Una instalación contemporánea que explora la interacción entre luz, sonido y forma. Compuesta por elementos modulares y proyecciones dinámicas, esta obra invita a la reflexión sobre el espacio y la percepción. Es un diálogo entre la tecnología y el arte, creando una una experiencia inmersiva para el espectador. Representa la evolución del arte hacia formas más experimentales.', periodo: 'Contemporáneo', imageUrl: require('@/assets/images/d.jpg'), modelUrl: require('@/assets/modelos/d.glb') },
        { id: 5, title: 'Obra 3D E: Máscara Ritual', artist: 'Artista E', description: 'Una máscara ritual utilizada en ceremonias andinas, confeccionada con plumas, textiles y elementos naturales. Cada detalle tiene un significado simbólico, conectando al portador con el mundo espiritual. Es un objeto sagrado que representa la cosmovisión de los pueblos originarios y su profunda conexión con la naturaleza y los ancestros. Su diseño vibrante es un reflejo de la riqueza cultural.', periodo: 'Republicano', imageUrl: require('@/assets/images/e.jpg'), modelUrl: require('@/assets/modelos/e.glb') },
      ],
    };
  },
  methods: {
    async fetchObraDetails() {
      this.isLoading = true;
      this.errorMessage = '';
      this.loadedModelObject = null; // Reset model before loading

      try {
        const obraId = parseInt(this.$route.params.id);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
        this.obra = this.all3dModels.find(item => item.id === obraId);

        if (this.obra) {
          await this.loadModel(this.obra.modelUrl);
        } else {
          this.errorMessage = 'La obra solicitada no fue encontrada.';
        }
      } catch (error) {
        this.errorMessage = 'Hubo un error al cargar los detalles de la obra.';
        console.error('Error fetching obra details or loading model:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async loadModel(modelUrl) {
      const loader = new GLTFLoader();
      try {
        const gltf = await loader.loadAsync(modelUrl);
        this.loadedModelObject = gltf.scene;
        console.log('Modelo 3D cargado:', modelUrl);
        // Opcional: Centrar el modelo o ajustar la escala si es necesario después de la carga
        // const box = new Three.Box3().setFromObject(this.loadedModelObject);
        // const center = box.getCenter(new Three.Vector3());
        // this.loadedModelObject.position.sub(center);
        // this.loadedModelObject.scale.set(1, 1, 1); // Reset scale or set desired scale
      } catch (error) {
        console.error('Error loading 3D model in detail view:', modelUrl, error);
        this.errorMessage = 'No se pudo cargar el modelo 3D.';
      }
    },
    setupRenderer() {
      // Ajustar el tamaño del renderizador al contenedor
      const container = this.$refs.renderer.$el.parentNode;
      this.rendererWidth = container.clientWidth;
      this.rendererHeight = container.clientHeight;

      window.addEventListener('resize', this.onResize);

      // Configurar OrbitControls
      // Espera a que el renderer y la cámara estén disponibles
      this.$nextTick(() => {
        const renderer = this.$refs.renderer.renderer;
        const camera = this.$refs.renderer.camera;
        if (renderer && camera) {
          this.orbitControls = new OrbitControls(camera, renderer.domElement);
          this.orbitControls.enableDamping = true;
          this.orbitControls.dampingFactor = 0.05;
          this.orbitControls.screenSpacePanning = false;
          this.orbitControls.minDistance = 2;
          this.orbitControls.maxDistance = 15;
          this.orbitControls.autoRotate = true; // Autogirar
          this.orbitControls.autoRotateSpeed = 0.8; // Velocidad de autogiro

          // Bucle de animación para OrbitControls y renderizado
          const animate = () => {
            if (this.orbitControls) {
              this.orbitControls.update();
            }
            if (renderer && this.$refs.renderer.scene && camera) {
               renderer.render(this.$refs.renderer.scene, camera);
            }
            requestAnimationFrame(animate);
          };
          animate();
        }
      });
    },
    onResize() {
      const container = this.$refs.renderer.$el.parentNode;
      this.rendererWidth = container.clientWidth;
      this.rendererHeight = container.clientHeight;
      // También es importante actualizar la cámara de Vue-GL
      if (this.$refs.renderer && this.$refs.renderer.camera) {
        this.$refs.renderer.camera.aspect = this.rendererWidth / this.rendererHeight;
        this.$refs.renderer.camera.updateProjectionMatrix();
      }
    },
    goBack() {
      this.$router.push('/galeria');
    },
  },
  async created() {
    await this.fetchObraDetails();
  },
  mounted() {
    this.setupRenderer();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize);
    if (this.orbitControls) {
      this.orbitControls.dispose();
    }
  },
};
</script>

<style scoped>
/* Estilos existentes (mantener la mayoría) */
.detalle-obra-container {
  padding: 30px;
  max-width: 1000px;
  margin: 20px auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  text-align: center;
}

.obra-title {
  font-size: 2.8rem;
  color: #4e342e;
  margin-bottom: 10px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
}

.obra-artist {
  font-size: 1.5rem;
  color: #6d4c41;
  font-style: italic;
  margin-bottom: 25px;
}

.model-viewer-container {
  width: 100%;
  height: 600px;
  background-color: #f5f5f5;
  border-radius: 10px;
  overflow: hidden;
  margin: 30px auto;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
}

/* Asegura que el canvas de Vue-GL ocupe todo el contenedor */
.gl-renderer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.obra-description {
  margin-top: 30px;
  text-align: left;
  line-height: 1.8;
  font-size: 1.1rem;
  color: #555;
}

.obra-description h2 {
  font-size: 2rem;
  color: #4e342e;
  margin-bottom: 15px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 8px;
}

.obra-description p {
  margin-bottom: 10px;
}

.back-button {
  background-color: #8d6e63;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  margin-top: 40px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background-color: #6d4c41;
  transform: translateY(-2px);
}

.loading-spinner, .error-message, .no-obra-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  text-align: center;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #4e342e;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 1.5rem;
  margin: 1rem auto;
  border-radius: 8px;
  max-width: 600px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.error-message button {
  background-color: #c62828;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
  font-size: 1rem;
}

.no-obra-found {
  font-size: 1.3rem;
  color: #777;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .detalle-obra-container {
    padding: 20px;
    margin: 10px auto;
  }

  .obra-title {
    font-size: 2rem;
  }

  .obra-artist {
    font-size: 1.2rem;
  }

  .model-viewer-container {
    height: 400px;
    margin: 20px auto;
  }

  .obra-description {
    font-size: 1rem;
    margin-top: 20px;
  }

  .obra-description h2 {
    font-size: 1.6rem;
  }

  .back-button {
    padding: 10px 20px;
    font-size: 1rem;
    margin-top: 30px;
  }
}
</style>