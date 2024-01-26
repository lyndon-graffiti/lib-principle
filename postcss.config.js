module.exports = {
  plugins: [
    require("stylelint")({
      fix: true,
    }),
    require("postcss-import"),
    require("postcss-preset-env")({
      stage: 2,
    }),
    require("autoprefixer"),
    require("cssnano"),
  ],
};
