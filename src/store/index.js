import Vue from 'vue'
import Vuex from 'vuex'

// 导入请求用户基本信息的 api
import { getUserInfoAPI, getUserProfileAPI } from '@/api/userAPI.js'

// 安装 Vuex 为 Vue 的插件
Vue.use(Vuex)

// 初始的 state 对象
let initState = {
  // token 的信息对象
  // 用来存储 token 信息的对象，将来这个对象中会包含两个属性 {token, refresh_token}
  tokenInfo: {},
  // 用户基本信息
  userInfo: {},
  // 用户简介信息
  userProfile: {}
}

// 读取localStorage中的 state 字符串
const stateStr = localStorage.getItem('state')

// 判断本地是否有 state 数据，有则赋值给初始 state 对象
if (stateStr) {
  // 加载本地的数据
  initState = JSON.parse(stateStr)
}

const store = new Vuex.Store({
  state: initState,
  mutations: {
    // 更新 tokenInfo 数据的方法
    updateTokenInfo(state, payload) {
      // 把提交的 payload 对象，作为 tokenInfo 的值
      state.tokenInfo = payload
      // state 更新时，同时更新本地存储中的 state，通过 this.commit() 方法调用函数
      this.commit('saveStateToStorage')
    },
    // 更新 userInfo 的方法
    updateUserInfo(state, payload) {
      // 把用户信息转存到 state 中
      state.userInfo = payload
      // 将最新的 state 对象持久化存储到本地
      this.commit('saveStateToStorage')
    },
    updateUserProfile(state, payload) {
      state.userProfile = payload
      this.commit('saveStateToStorage')
    },
    saveStateToStorage(state) {
      localStorage.setItem('state', JSON.stringify(state))
    },
    cleanState(state) {
      state.tokenInfo = {}
      state.userInfo = {}
      // 清空数据后，将state 存储到本地
      this.commit('saveStateToStorage')
    }
  },
  actions: {
    async initUserInfo(ctx) {
      // 调用获取用户信息接口
      const { data: res } = await getUserInfoAPI()
      if (res.message === 'OK') {
        // 把数据转交给 Mutation 方法
        ctx.commit('updateUserInfo', res.data)
      }
    },
    async initUserProfile(ctx) {
      const { data: res } = await getUserProfileAPI()
      if (res.message === 'OK') {
        ctx.commit('updateUserProfile', res.data)
      }
    }
  },
  getters: {
    // 用户头像的计算属性
    userAvatar(state) {
      // 默认头像地址
      let imgSrc = 'https://img.yzcdn.cn/vant/cat.jpeg'
      // 如果用户信息对象中包含 photo 属性的值，则为 imgSrc重新赋值
      if (state.userInfo.photo) {
        imgSrc = state.userInfo.photo
      }
      return imgSrc
    }
  }
})

export default store
