const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  // Podemos volver a 'true' o incluso eliminar esta línea si no tienes otras dependencias problemáticas.
  // Si tienes otras dependencias que necesiten transpilación, déjalo como 'true'.
  transpileDependencies: true,

  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
        __VUE_PROD_DEVTOOLS__: 'false'
      })
    ],
    module: {
      rules: [
        {
          test: /\.(glb|gltf)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'assets/modelos/[name].[ext]',
              },
            },
          ],
        },
      ],
    },
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.compilerOptions = {
          ...options.compilerOptions,
          isCustomElement: tag => tag.startsWith('ion-')
        }
        return options
      })
  }
})