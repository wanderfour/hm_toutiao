import Vue from 'vue'
import Vuex from 'vuex'

// 安装 Vuex 为 Vue 的插件
Vue.use(Vuex)

// 初始的 state 对象
let initState = {
  // token 的信息对象
  // 用来存储 token 信息的对象，将来这个对象中会包含两个属性 {token, refresh_token}
  tokenInfo: {}
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
    saveStateToStorage(state) {
      localStorage.setItem('state', JSON.stringify(state))
    }
  }
})

export default store
