const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: "./src/index.js",
  output: {
    // 三方库的方式，在引入 js 后，在全局中可以使用
    library: "xianzhiwu",
    libraryTarget: "var",
    filename: "[name].[chunkhash:5].js",
    path: path.resolve(__dirname, "./dist"),
  },
  // 默认情况下 entry & loaders 相对的是 cwd，在配置了 context 后，相对的就是 context
  // context: path.resolve(__dirname, "src"),
  module: {
    rules: [
      {
        test: /\.js$/, // 正则匹配
        use: [
          {
            loader: "babel-loader",
            // 用来做配置，在功能相近的 loader，可以通过 options 控制
            // 工具库：loader-utils，参数可以通过 query 也可以通过 options 来传递
            // 类似：css-loader?module=true，这种单行的 loader，可以直接使用字符串，而不是对象形式
            // options: {
            //   // ...
            // },
          },
        ],
      },
      {
        test: /\.css$/,
        // use 中的 loader，会通过 __webpack_require__ 来查找引入
        // 默认模块对应的 loader 为 []，在 rules 中，从上往下匹配时，test 符合条件，就加入执行数组，最后从 后 -> 前 执行数组
        use: ["css-loader"],
      },
    ],
    // 在编译过程中，直接读取文件内容，不做 AST 抽象语法树分析，不解析依赖
    // 不根据 dependencies 的内容递归加载模块，用来忽略大型的单模块库（没有依赖），类似 /jquery/
    noParse: /test\.js$/,
  },
  resolve: {
    modules: ["node_modules"], // 模块查找的位置
    extensions: [".js", ".json"], // 可以自动补全后缀
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  externals: {
    jquery: "$",
    lodash: "_",
  },
  stats: {
    colors: true, // 控制台带颜色
    modules: false, // 忽略模块
  },
  // 带有 apply 方法的对象，在 compiler 对象构建完成后执行 apply 方法
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./public",
          to: "./",
        },
      ],
    }),
  ],
};
