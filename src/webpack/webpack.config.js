module.exports = {
  mode: "development",
  devtool: "source-map",
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
            options: {
              // ...
            },
          },
        ],
      },
      {
        test: /\.css$/,
        // use 中的 loader，会通过 __webpack_require__ 来查找引入
        // 默认模块对应的 loader 为 []，在 rules 中，从上往下匹配时，test 符合条件，就加入执行数组，最后从 后 -> 前 执行数组
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
