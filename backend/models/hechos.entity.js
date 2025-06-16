class HechosHistoricos {
    constructor({
        id_hecho,
        titulo,
        descripcion,
        artista,
        imagen_url,
        periodo,
        categoria,
        modelo_3d_url,
        id_seccion
    }) {
        this.id = id_hecho;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.artista = artista;
        this.imagen_url = imagen_url;
        this.periodo = periodo;
        this.categoria = categoria;
        this.modelo_3d_url = modelo_3d_url;
        this.seccion_id = id_seccion;
    }
}

module.exports = HechosHistoricos;