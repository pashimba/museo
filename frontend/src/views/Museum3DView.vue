<template>
  <div ref="container" class="museum-container">
    <canvas ref="museumCanvas"></canvas>
    <div id="blocker" ref="blocker">
      <div id="instructions">
        <p style="font-size: 36px">Haz clic para jugar</p>
        <p>
          Moverse: WASD<br />
          Mirar: MOUSE<br />
          Salir: ESC
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default {
  name: "Museum3DView",
  data() {
    return {
      loading: true,
      error: null,
      animationFrameId: null,
    };
  },
  // Define las propiedades de Three.js aquí para evitar que Vue las haga reactivas.
  beforeCreate() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.model = null;

    // Variables para la física del movimiento
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.prevTime = performance.now();
  },
  mounted() {
    this.initThreeD();
    window.addEventListener("resize", this.onWindowResize);
  },
  beforeUnmount() {
    // Detener el bucle de animación
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    // Limpiar escuchadores de eventos
    window.removeEventListener("resize", this.onWindowResize);
    if (this.controls) {
        this.controls.removeEventListener('lock', this.onControlsLock);
        this.controls.removeEventListener('unlock', this.onControlsUnlock);
        this.controls.dispose();
    }
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);

    // Limpieza de Three.js
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
    }
     // Anular referencias para ayudar al recolector de basura
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.model = null;
  },
  methods: {
    initThreeD() {
      try {
        const container = this.$refs.container;
        const canvas = this.$refs.museumCanvas;
        if (!canvas) throw new Error("Elemento Canvas no encontrado.");

        // 1. Escena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb); // Un color de cielo
        this.scene.fog = new THREE.Fog(0x87ceeb, 0, 100);


        // 2. Cámara
        this.camera = new THREE.PerspectiveCamera(
          75,
          container.clientWidth / container.clientHeight,
          0.1,
          1000
        );
        // Posición inicial del "jugador" (a la altura de los ojos)
        this.camera.position.set(0, 1.7, 10);

        // 3. Renderizador
        this.renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          antialias: true,
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;

        // 4. Luces
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // 5. Controles de Primera Persona (PointerLockControls)
        this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
        
        // Añadir escuchadores para el bloqueo del puntero
        const blocker = this.$refs.blocker;
        const instructions = document.getElementById('instructions');

        instructions.addEventListener('click', () => {
            this.controls.lock();
        });

        this.controls.addEventListener('lock', () => {
            instructions.style.display = 'none';
            blocker.style.display = 'none';
        });

        this.controls.addEventListener('unlock', () => {
            blocker.style.display = 'block';
            instructions.style.display = '';
        });
        
        this.scene.add(this.controls.getObject());

        // 6. Escuchadores de teclado para el movimiento
        this.onKeyDown = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = true;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = true;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = true;
                    break;
            }
        };

        this.onKeyUp = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = false;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = false;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = false;
                    break;
            }
        };

        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);


        // 7. Cargar el Modelo 3D
        const loader = new GLTFLoader();
        // Asegúrate de que esta ruta sea correcta para tu proyecto Vue CLI
        const modelPath = process.env.BASE_URL + "models/museito.glb";

        loader.load(
          modelPath,
          (gltf) => {
            this.model = gltf.scene;
            this.model.position.set(0, 0, 0); // Ajusta la posición si es necesario
             this.model.traverse((node) => {
              if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
              }
            });
            this.scene.add(this.model);
            
            // Añadir un suelo para tener referencia
            const ground = new THREE.Mesh(
                new THREE.PlaneGeometry(200, 200),
                new THREE.MeshStandardMaterial({ color: 0xcccccc, side: THREE.DoubleSide })
            );
            ground.rotation.x = -Math.PI / 2;
            ground.receiveShadow = true;
            this.scene.add(ground);

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
      
      const time = performance.now();
      
      // Solo actualizamos la posición si los controles están activos
      if (this.controls.isLocked === true) {
        const delta = (time - this.prevTime) / 1000;

        // Deceleración para un movimiento más suave
        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;
        
        // Reiniciamos la dirección en cada fotograma
        this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
        this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
        this.direction.normalize(); // Asegura un movimiento consistente en todas las direcciones

        // Aplicamos velocidad basada en la dirección
        if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * 40.0 * delta;
        if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * 40.0 * delta;

        // Movemos la cámara
        this.controls.moveRight(-this.velocity.x * delta);
        this.controls.moveForward(-this.velocity.z * delta);
      }
      
      this.prevTime = time;
      
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    },
    onWindowResize() {
      const container = this.$refs.container;
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
.museum-container {
  width: 100%;
  height: 90vh; /* O la altura que prefieras */
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}

#blocker {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.5);
}

#instructions {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 14px;
  color: white;
  font-family: Arial, sans-serif;
}
</style>
