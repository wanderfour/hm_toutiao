// 封装axios请求工具
import axios from 'axios'
// 导入 vant 中的 Toast 组件
import { Toast } from 'vant'

// 导入 vuex模块的 store
import store from '@/store/index.js'

// 调用 axios.create() 方法，创建 axios 的实例对象
const instance = axios.create({
  // 请求根路径
  baseURL: 'http://www.liulongbin.top:8000'
})

// 为 instance 实例绑定请求拦截器
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
  error => {
    return Promise.reject(error)
  }
)

export default instance
