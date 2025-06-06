<template>
  <div class="museum-3d-container">
    <canvas ref="museumCanvas" class="museum-canvas"></canvas>
    <div v-if="loading" class="loading-overlay">Cargando museo 3D...</div>
    <div v-if="error" class="error-message">
      Error al cargar el modelo 3D: {{ error }}
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default {
  name: "Museum3DView",
  data() {
    return {
      loading: true,
      error: null,
      // REMOVE THREE.js objects from here to prevent Vue's reactivity system from wrapping them
      // scene: null,
      // camera: null,
      // renderer: null,
      // controls: null,
      // model: null,
      animationFrameId: null, // This can stay, it's just an ID
    };
  },
  // Use 'beforeCreate' or 'created' to initialize non-reactive properties
  // or define them directly on 'this' in 'mounted'
  beforeCreate() {
    // Define Three.js objects directly on the component instance,
    // outside of the reactive data(). This prevents Vue from proxying them.
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.model = null; // The loaded GLTF model
  },
  mounted() {
    this.initThreeD();
    window.addEventListener("resize", this.onWindowResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer.domElement = null;
    }
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object.isMesh) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
      // Nullify references to help garbage collection
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.controls = null;
      this.model = null;
    }
  },
  methods: {
    initThreeD() {
      try {
        const container = this.$refs.museumCanvas;
        if (!container) {
          throw new Error("Elemento Canvas no encontrado.");
        }

        // 1. Escena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);

        // 2. Cámara
        this.camera = new THREE.PerspectiveCamera(
          75,
          container.clientWidth / container.clientHeight,
          0.1,
          1000
        );
        this.camera.position.set(0, 5, 10);

        // 3. Renderizador
        this.renderer = new THREE.WebGLRenderer({
          canvas: container,
          antialias: true,
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;

        // 4. Luces
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // 5. Controles (para interacción del usuario)
        this.controls = new OrbitControls(
          this.camera,
          this.renderer.domElement
        );
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 50;
        this.controls.target.set(0, 0, 0);
        this.controls.update();

        // 6. Cargar el Modelo 3D
        const loader = new GLTFLoader();
        const modelPath = process.env.BASE_URL + "models/museum.glb";

        loader.load(
          modelPath,
          (gltf) => {
            this.model = gltf.scene;
            this.scene.add(this.model);

            // Centrar la cámara y los controles en el modelo cargado
            const box = new THREE.Box3().setFromObject(this.model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = this.camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
            cameraZ *= 1.5;

            // Adjust the camera position slightly to avoid being inside the model if it starts at (0,0,0)
            this.camera.position.set(
              center.x + maxDim,
              center.y + maxDim,
              center.z + cameraZ
            ); // Move camera further out and up
            this.controls.target.copy(center);
            this.controls.update();

            this.loading = false;
            this.animate();
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + "% cargado");
          },
          (error) => {
            console.error("Error al cargar el modelo 3D:", error);
            this.error = error.message || "Error desconocido";
            this.loading = false;
          }
        );
      } catch (e) {
        console.error("Error de inicialización:", e);
        this.error = e.message;
        this.loading = false;
      }
    },
    animate() {
      this.animationFrameId = requestAnimationFrame(this.animate);
      if (this.controls) this.controls.update();
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    },
    onWindowResize() {
      const container = this.$refs.museumCanvas;
      if (container && this.camera && this.renderer) {
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
      }
    },
  },
};
</script>

<style scoped>
.museum-3d-container {
  position: relative;
  width: 100%;
  height: calc(
    100vh - 60px
  ); /* Ajusta la altura, por ejemplo, 60px para tu encabezado */
  background-color: #f0f0f0; /* Fondo de reserva */
  overflow: hidden;
}

.museum-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.loading-overlay,
.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px 40px;
  border-radius: 8px;
  font-size: 1.2rem;
  z-index: 10;
  text-align: center;
}

.error-message {
  background-color: rgba(255, 0, 0, 0.7);
}
</style>
