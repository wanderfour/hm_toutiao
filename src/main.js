import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入 Vant 组件库（采用全局注册引入）
// TODO:全局注册导致打包体积过大的问题（此问题在项目发布时，可通过 CDN 加速解决）
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.less'

// 引入通过 vuex 定义好的 store
import store from '@/store/index.js'

// 导入时间格式化包 dayjs
import dayjs from 'dayjs'
// 导入计算相对时间的插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 导入中文语言包
import zh from 'dayjs/locale/zh-cn'

// 安装为 Vue 的插件
Vue.use(Vant)
Vue.use(Lazyload)

// 配置"计算相对时间"的插件
dayjs.extend(relativeTime)
// 配置中文语言包
dayjs.locale(zh)

Vue.config.productionTip = false

// 定义格式化时间的全局过滤器
Vue.filter('dateFormat', dt => {
  return dayjs().to(dt)
})

new Vue({
  router,
  // 为了在 Vue 组件中访问 this.$store property，你需要为 Vue 实例提供创建好的 store。
  store,
  render: h => h(App)
}).$mount('#app')
