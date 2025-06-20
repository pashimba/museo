<template>
  <div class="formulario-hecho">
    <h2>Agregar Nuevo Hecho Histórico</h2>
    <form @submit.prevent="guardarObra">
      <input v-model="nuevaObra.titulo" placeholder="Título" required />
      <input v-model="nuevaObra.artista" placeholder="Artista" />
      <input v-model="nuevaObra.imagen_url" placeholder="URL de la imagen" required />
      <textarea v-model="nuevaObra.descripcion" placeholder="Descripción" required></textarea>
      <input v-model="nuevaObra.periodo" placeholder="Período" />
      <input v-model="nuevaObra.categoria" placeholder="Categoría" />
      <input v-model="nuevaObra.modelo_3d_url" placeholder="URL del modelo 3D (opcional)" />

      <select v-model="nuevaObra.seccion_id" required>
  <option disabled value="">Selecciona una sección</option>
  <option
    v-for="seccion in secciones"
    :key="seccion.id_seccion"
    :value="seccion.id_seccion"
  >
    {{ seccion.nombre_seccion }}
  </option>
</select>

      <button type="submit">Guardar</button>
    </form>
    <p v-if="error" style="color: red;">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: "AgregarHechoView",
  data() {
    return {
      secciones: [],
      nuevaObra: {
        titulo: "",
        artista: "",
        descripcion: "",
        periodo: "",
        categoria: "",
        imagen_url: "",
        modelo_3d_url: "",
        seccion_id: "",
      },
      error: null,
    };
  },
  methods: {
async cargarSecciones() {
  try {
    const res = await fetch("http://localhost:3000/api/secciones");
    if (!res.ok) throw new Error("Error al obtener secciones");
    this.secciones = await res.json();

    console.log("📦 Secciones cargadas:", this.secciones); // 👈 Agrega esto
  } catch (err) {
    this.error = err.message;
  }
},
async guardarObra() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/hechos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(this.nuevaObra),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Error al guardar el hecho");
    }

    alert("Hecho agregado correctamente");
    this.$router.push("/galeria"); // 🔁 Redirección segura
  } catch (err) {
    this.error = err.message;
  }
},
  },
  created() {
    this.cargarSecciones();
  },
};
</script>

<style scoped>
.formulario-hecho {
  max-width: 600px;
  margin: 60px auto;
  padding: 40px 35px; /* ← más espacio lateral */
  background: linear-gradient(135deg, #fef3e7, #fff9ec);
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.formulario-hecho h2 {
  margin-bottom: 25px;
  color: #3e2723;
  font-size: 26px;
  border-bottom: 2px solid #ffcc80;
  display: inline-block;
  padding-bottom: 5px;
}

.formulario-hecho input,
.formulario-hecho textarea,
.formulario-hecho select {
  display: block;
  width: 100%;
  margin: 16px 0;
  padding: 12px 18px; /* ← más padding lateral */
  border-radius: 8px;
  border: 1px solid #ccc;
  font-weight: bold;
  box-sizing: border-box;
}
.formulario-hecho input:focus,
.formulario-hecho textarea:focus,
.formulario-hecho select:focus {
  border-color: #ffb74d;
  outline: none;
  box-shadow: 0 0 5px rgba(255, 183, 77, 0.5);
}

.formulario-hecho textarea {
  resize: vertical;
  min-height: 100px;
}

.formulario-hecho button {
  background-color: #ff9800;
  color: white;
  border: none;
  padding: 14px;
  width: 100%;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.formulario-hecho button:hover {
  background-color: #fb8c00;
  transform: scale(1.02);
}

.error-message {
  color: #d32f2f;
  margin-top: 10px;
  font-weight: bold;
}
</style>