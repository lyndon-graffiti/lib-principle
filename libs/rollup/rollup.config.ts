import { RollupOptions, defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import htmlTemplate from "rollup-plugin-generate-html-template";
import replace from "@rollup/plugin-replace";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import clear from "rollup-plugin-clear";
import postcss from "rollup-plugin-postcss";
import image from "@rollup/plugin-image";
import alias from "@rollup/plugin-alias";
import { fileURLToPath } from "node:url";
import terser from "@rollup/plugin-terser";
import { visualizer } from "rollup-plugin-visualizer";

const buildMainOptions: RollupOptions = {
  input: "src/main.tsx",
  output: {
    dir: "dist",
    format: "esm",
    name: "rollup-demo",
    sourcemap: true,
    plugins: [terser()],
    entryFileNames: "[name].js",
    chunkFileNames: "chunk/[name]-[hash:6].js",
    // DLL，动态链接库，手动分包，实现代码分割
    manualChunks: {
      "lodash-es": ["lodash-es"],
    },
    globals: {
      react: "React",
      "react-dom": "ReactDOM",
    },
    paths: {
      react: "https://cdn.jsdelivr.net/npm/react@18.2.0/+esm",
      "react-dom": "https://cdn.jsdelivr.net/npm/react-dom@18.2.0/+esm",
    },
  },
  // 实现 react 组件库。构建时，排除 react 相关
  external: ["react", "react-dom"],
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript(),
    babel({
      babelHelpers: "runtime",
      include: "src/**",
      exclude: "node_modules/**",
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),
    replace({
      // 需要将字符串做一下替换，不然会报错：process is not defined
      preventAssignment: true,
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    alias({
      entries: [
        {
          find: "@",
          // 学习 import.meta.url，why？
          replacement: fileURLToPath(new URL("src", import.meta.url)),
        },
      ],
    }),
    serve("dist"),
    livereload("src"),
    clear({
      targets: ["dist"],
    }),
    postcss({
      extensions: [".css"], // 将 scss 解析成 css
      extract: true, // 将 css 提取到 dist 目录下
      modules: true, // 增加 css 的模块化支持
    }),
    htmlTemplate({
      template: "public/index.html",
      target: "dist/index.html",
      attrs: ['type="module"'],
    }),
    image(),
    visualizer(),
  ],
};

const buildIndexOptions = defineConfig({
  input: "src/index.js",
  output: [
    {
      file: "dist/bundle-iife.js",
      format: "iife",
    },
    {
      file: "dist/bundle-cjs.js",
      format: "cjs",
    },
    {
      file: "dist/bundle-umd.js",
      format: "umd",
      name: "umd",
    },
  ],
});

export default [buildMainOptions];
