// 采用 IIFE 的方式，可以不污染全局变量
((modules) => {
  // 缓存所有模块
  const moduleExports = {};

  // 为了避免和 node 环境的的 API 冲突，所以加 webpack 前缀
  // 构建依赖 node，因为需要读取文件内容
  function __webpack_require__(moduleId) {
    // 判断模块是否存在缓存，如有，直接返回结果，可以处理循环依赖问题
    if (moduleExports[moduleId]) {
      return moduleExports[moduleId].exports;
    }

    // 模块对应的内容，包括模块Id、是否 loading 完成、导出内容
    moduleExports[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    };
    // 使用 module 变量来处理模块导入导出
    const module = moduleExports[moduleId];

    // 调用模块，绑定 this 为 module.exports
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );

    // 模块加载完成
    module.l = true;

    // 返回模块导出内容
    return module.exports;
  }

  __webpack_require__("./src/index.js");
})({
  // 使用 eval 来包裹每个模块的代码，是在浏览器中，会为每个 eval 模块单独开一个空间，方便排查错误
  // eval 的模块所在位置提示写法：//# sourceURL=webapck:///./src/index.js，指定为 webpack 构建
  "./src/index.js": (module, exports, __webpack_require__) => {
    console.log("index module");
    // 采用 CommonJS 的导入方法，也是构建过程中的替换依赖函数，保存转换后的代码
    const a = __webpack_require__("./src/a.js");
    console.log(a);
  },
  "./src/a.js": (module, exports) => {
    console.log("a module");
    // 采用 CommonJS 的导出方法，方便分析
    module.exports = "a exports";
  },
});
