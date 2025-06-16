// vue.config.js
const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  // Modifica la cadena de configuración de Webpack
  chainWebpack: (config) => {
    // Busca la regla de Vue y su 'vue-loader'
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap((options) => {
        // Asegúrate de que options.compilerOptions exista
        options.compilerOptions = options.compilerOptions || {};
        // Añade isCustomElement para reconocer 'model-viewer'
        // Esto le dice al compilador de Vue que no trate 'model-viewer'
        // como un componente Vue, sino como un elemento HTML nativo/custom.
        options.compilerOptions.isCustomElement = (tag) =>
          tag.includes("model-viewer");
        return options;
      });

    // Si tuvieras una regla específica para GLB/GLTF en chainWebpack (que deberíamos haber eliminado),
    // asegúrate de que no haya conflictos aquí. Como el plan anterior era cargarlo desde public,
    // esta regla no debería ser necesaria para los GLB, solo para el v-slot en model-viewer.
  },
  // Si tienes otras configuraciones (ej. css: {...}), déjalas aquí fuera de chainWebpack.
});
