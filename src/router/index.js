import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入 vuex 模块，以便判断用户是否登录
import store from '@/store/index.js'
// 基于 const Foo = () => import('./Foo.vue') 语法，改造组件的导入方式
// 1. 将异步组件定义为返回一个 Promise 的工厂函数 (该函数返回的 Promise 应该 resolve 组件本身)
// 2. 在 Webpack 2 中，我们可以使用动态 import 语法来定义代码分块点 (split point)
// import Main from '@/views/Main/Main.vue'
const Main = () => import('@/views/Main/Main.vue')
// import Home from '@/views/Home/Home.vue'
const Home = () => import('@/views/Home/Home.vue')
// import User from '@/views/User/User.vue'
const User = () => import('@/views/User/User.vue')
// import Login from '@/views/Login/Login.vue'
const Login = () => import('@/views/Login/Login.vue')
// import Search from '@/views/Search/Search.vue'
const Search = () => import('@/views/Search/Search.vue')
// import SearchResult from '@/views/SearchResult/SearchResult.vue'
const SearchResult = () => import('@/views/SearchResult/SearchResult.vue')
// import ArticleDetail from '@/views/ArticleDetail/ArticleDetail.vue'
const ArticleDetail = () => import('@/views/ArticleDetail/ArticleDetail.vue')
// import UserEdit from '@/views/UserEdit/UserEdit.vue'
const UserEdit = () => import('@/views/UserEdit/UserEdit.vue')
// import Chat from '@/views/Chat/Chat.vue'
const Chat = () => import('@/views/Chat/Chat.vue')

Vue.use(VueRouter)

const routes = [
  // 带有 name 名称的路由规则，叫命名路由，可在跳转的时候指定 name 实现
  {
    path: '/',
    component: Main,
    children: [
      {
        path: '',
        component: Home,
        name: 'home',
        meta: { isRecord: true, top: 0 }
      },
      { path: '/user', component: User, name: 'user' }
    ]
  },
  { path: '/login', component: Login, name: 'login' },
  { path: '/search', component: Search, name: 'search' },
  {
    path: '/search/:kw',
    component: SearchResult,
    name: 'search-result',
    props: true,
    meta: { isRecord: true, top: 0 }
  },
  {
    path: '/article/:aid',
    component: ArticleDetail,
    name: 'article-detail',
    props: true,
    meta: {
      isRecord: true,
      top: 0
    }
  },
  { path: '/user/edit', component: UserEdit, name: 'user-edit' },
  { path: '/chat', component: Chat, name: 'chat' }
]

const router = new VueRouter({
  routes
})

// 定义需要权限访问的页面
const pagePathArr = ['/user', '/user/edit']

// 为路由的实例对象挂载全局前置守卫
router.beforeEach((to, from, next) => {
  if (pagePathArr.indexOf(to.path) !== -1) {
    // 访问有权限控制的 /user,/user/edit 页面需要前置守卫，判断是否登录
    // 从 store 中获取 token 值
    const tokenStr = store.state.tokenInfo.token
    if (tokenStr) {
      // token 有值，表示已经登录，则放行
      next()
    } else {
      // token 不存在，强制跳转到登录页面
      // next('/login')
      // 被强制跳转到登录页后，携带路由的 query查询参数，记录上次访问未遂的路由地址，以便登录后直接跳转到访问未遂的地址
      // 需要改造登录页的登录方法
      next(`/login?pre=${to.fullPath}`)
    }
  } else {
    // 访问没有权限控制的页面直接跳转
    next()
  }
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 如果当前路由元信息中的 isRecord 为 true
  if (to.meta.isRecord) {
    setTimeout(() => {
      window.scrollTo(0, to.meta.top)
    }, 0)
  }
})

// 使用导航守卫，改变来原来的跳转，浏览器会报错：Redirected when going from "/" to "/user" via a navigation guard. stack overflow 上有2个解决方案
// 方案1：更换 $router.push() 为 <router-link>
// 方案2.1：Individual suppress errors on each router.push call
// 方案2.2 Augment Router.prototype.push to always suppress errors

// 现采用方案2.2
// 将 VueRouter 本身提供的 $router.push 方法转存到常量中
const originalPush = VueRouter.prototype.push
// 自定义 $router.push 方法，在内部调用原生的 originalPush 方法进行路由跳转，并通过 .catch 捕获错误
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch(err => err)
}

export default router
