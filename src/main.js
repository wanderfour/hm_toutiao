import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入 Vant 组件库（采用全局注册引入）
// TODO:全局注册导致打包体积过大的问题（此问题在项目发布时，可通过 CDN 加速解决）
import Vant from 'vant'
import 'vant/lib/index.less'

// 引入通过 vuex 定义好的 store
import store from '@/store/index.js'

// 安装为 Vue 的插件
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  // 为了在 Vue 组件中访问 this.$store property，你需要为 Vue 实例提供创建好的 store。
  store,
  render: h => h(App)
}).$mount('#app')
