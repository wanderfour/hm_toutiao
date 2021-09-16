import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home/Home.vue'
import User from '@/views/User/User.vue'
import Login from '@/views/Login/Login.vue'

Vue.use(VueRouter)

const routes = [
  // 带有 name 名称的路由规则，叫命名路由，可在跳转的时候指定 name 实现
  { path: '/', name: 'home', component: Home },
  { path: '/user', name: 'user', component: User },
  { path: '/login', name: 'login', component: Login }
]

const router = new VueRouter({
  routes
})

export default router
