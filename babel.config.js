module.exports = {
  presets: ["@vue/app"],
  plugins: ["@babel/plugin-syntax-bigint"],
  env: {
    test: {
      plugins: ["@babel/transform-modules-commonjs"]
    }
  }
};
