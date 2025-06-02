module.exports = {
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
};
