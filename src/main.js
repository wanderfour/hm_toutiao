import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入 Vant 组件库（采用全局注册引入）
// TODO:全局注册导致打包体积过大的问题（此问题在项目发布时，可通过 CDN 加速解决）
import Vant from 'vant'
import 'vant/lib/index.less'

// 安装为 Vue 的插件
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
