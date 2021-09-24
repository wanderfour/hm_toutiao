<template>
  <div class="login-container">
    <!-- 引入Navbar vant 组件 -->
    <van-nav-bar fixed title="黑马头条-登录" />
    <!-- 登录表单 -->
    <van-form @submit="login">
      <van-field
        v-model="form.mobile"
        type="tel"
        label="手机号码"
        placeholder="请输入手机号"
        required
        :rules="rules.mobile"
      />
      <van-field
        v-model="form.code"
        type="password"
        label="登录密码"
        placeholder="请输入密码"
        required
        :rules="rules.code"
      />
      <div style="margin: .426667rem;">
        <van-button round block type="info" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
// 导入 userAPI
import { loginAPI } from '@/api/userAPI.js'
// 按需导入 vuex 中的辅助方法
import { mapMutations } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      // 登录表单的数据，需要双向绑定到登录表单上
      form: {
        mobile: '13800001111',
        code: '246810'
      },
      // 登录表单字段的校验规则
      rules: {
        mobile: [
          { required: true, message: '请填写手机号码', trigger: 'onBlur' },
          {
            pattern: /^1\d{10}$/,
            message: '请填写正确的手机号码',
            trigger: 'onBlur'
          }
        ],
        // 密码的校验规则
        code: [{ required: true, message: '请填写您的密码', trigger: 'onBlur' }]
      }
    }
  },
  methods: {
    // 映射 store mutations 中的方法
    ...mapMutations(['updateTokenInfo']),
    async login() {
      // 表单数据前端校验通过，调用 login 函数
      // 调用api接口，发起登录请求
      const { data: res } = await loginAPI(this.form)
      // 判断登录是否成功
      if (res.message === 'OK') {
        // 把登录成功的结果，存储到 vuex 的一个 store 中
        // 存储在 vuex 中的数据都是内存数据，只要浏览器一刷新，vuex 的数据就被清空了
        this.updateTokenInfo(res.data)

        // 如果登录页面有查询参数，记录访问未遂的页面，则跳转到访问未遂的页面，否则跳转到首页
        const navPath = this.$route.query.pre || '/'
        // 登录成功后，跳转到主页
        this.$router.push(navPath)
      }
    }
  },
  created() {}
}
</script>

<style lang="less" scoped>
.login-container {
  z-index: 999;
  padding: 1.226667rem 0 1.333333rem 0;
}
</style>
