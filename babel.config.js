module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  // 实现路由组件按需导入的 babel 插件
  // 如果使用的是 Babel，需要添加 syntax-dynamic-import 插件，才能使 Babel 可以正确地解析语法。
  plugins: ['@babel/plugin-syntax-dynamic-import']
}
