// 使用node.js 的path模块拼接路径
const path = require('path')
const themePath = path.join(__dirname, './src/theme.less')

module.exports = {
  // 保证部署是dist目录资源能被正确读取
  publicPath: './',
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 直接覆盖变量
          // 'text-color': '#111',
          // 'border-color': '#eee',
          // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          hack: `true; @import "${themePath}";`
        }
      }
    }
  },
  // 增强 vue-cli 的webpack配置项
  configureWebpack: {
    // 打包优化
    externals: {
      // import 时的包名称：window 全局的成员名称
      'highlight.js': 'hljs',
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      axios: 'axios',
      vant: 'vant',
      dayjs: 'dayjs',
      'socket.io-client': 'io',
      popmotions: 'popmotions'
    }
  }
}
