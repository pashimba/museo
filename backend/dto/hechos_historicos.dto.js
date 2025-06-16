class HechosHistoricosDTO {
    constructor(hecho) {
        this.id = hecho.id_hecho;
        this.title = hecho.titulo;
        this.description = hecho.descripcion;
        this.artist = hecho.artista;
        this.image = hecho.imagen_url;
        this.period = hecho.periodo;
        this.category = hecho.categoria;
        this.model3DUrl = hecho.modelo_3d_url;
        this.sectionId = hecho.seccion_id;
    }
}

module.exports = HechosHistoricosDTO; 