module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    // This line is essential for optional chaining
    '@babel/plugin-proposal-optional-chaining'
  ]
}