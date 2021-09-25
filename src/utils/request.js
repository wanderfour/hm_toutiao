// 封装axios请求工具
import axios from 'axios'
// 导入 vant 中的 Toast 组件
import { Toast } from 'vant'

// 导入 vuex模块的 store
import store from '@/store/index.js'

// 导入 router 实例对象
import router from '@/router/index.js'

// 导入换取token的 api
import { exchangeTokenAPI } from '@/api/userAPI.js'

// 调用 axios.create() 方法，创建 axios 的实例对象
const instance = axios.create({
  // 请求根路径
  baseURL: 'http://www.liulongbin.top:8000'
})

// 为 instance 实例绑定请求拦截器
// 请求拦截器，用于在请求发送前进行一系列操作，例如在每个请求体里加上 token
// 基于拦截器添加 token 认证
instance.interceptors.request.use(
  // config 是请求体数据
  config => {
    // 在请求成功前展示 loading 效果
    Toast.loading({
      message: '加载中...',
      duration: 0 // 展示时长（ms），值为 0 时，toast 不会消失
    })
    // 获取 token 值
    const tokenStr = store.state.tokenInfo.token
    if (tokenStr) {
      config.headers.Authorization = `Bearer ${tokenStr}`
    }
    return config
  },
  // error 是请求失败捕获到的错误信息
  error => {
    return Promise.reject(error)
  }
)

// 为 instance 实例绑定响应拦截器
instance.interceptors.response.use(
  response => {
    // 隐藏 loading 效果
    Toast.clear()
    return response
  },
  async error => {
    // token 续签方案1：直接强制跳转到登录页
    // 无法模拟响应 401，方案1 测试完成

    // TODO:token 续签方案2: 通过 refresh_token 无感知刷新 token，待测试

    // 在请求失败的时候，关闭 loading 提示效果
    Toast.clear()
    console.log(error.response)

    // 从 vuex 中获取 tokenInfo 对象
    const tokenInfo = store.state.tokenInfo
    // 2.1如果有响应的结果，并且响应的状态码是 401，则证明 Token 过期了
    if (
      error.response &&
      error.response.status === 401 &&
      tokenInfo.refresh_token
    ) {
      console.log('token 过期了')
      try {
        // 2.2发起请求，根据 refresh_token 重新请求一个有效的新 token （接口封装在 userAPI.js）
        const { data: res } = await exchangeTokenAPI(tokenInfo.refresh_token)
        console.log(res)
        // 2.3更新 store 中的 token
        store.commit('updateTokenInfo', {
          token: res.data.token,
          refresh_token: tokenInfo.refresh_token
        })
        // 2.4重新调用刚刚“请求未遂”的接口
        // 2.4.1 如果在响应拦截器中 return 一个新的 promise 异步请求，则会把这次请求的结果，当做上次请求的返回值 TODO:没有理解，后续复习
        return instance(error.config)
      } catch {
        // token 和 refresh_token 都失效了

        // 清空 vuex 和 localStorage 中的数据
        store.commit('cleanState')
        // 强制跳转到登录页，并通过路由的 query 查询参数，把当前用户访问未遂的路由地址带给登录页
        router.replace('/login?pre' + router.currentRoute.fullPath)
      }
    }
    return Promise.reject(error)
  }
)

export default instance
