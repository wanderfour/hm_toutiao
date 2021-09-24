<template>
  <div class="user-container">
    <!-- 头部用户信息 -->
    <!-- 需要在 vuex 中请求用户的基本信息 -->
    <div class="user-box">
      <van-cell
        :title="userInfo.name"
        color="white"
        label="描述信息"
        center
        class="user-info"
      >
        <template #icon>
          <van-image
            width="1.6rem"
            height="1.6rem"
            round
            class="avatar"
            :src="userInfo.photo"
          />
        </template>
        <template #label>
          <van-tag plain type="primary">申请认证</van-tag>
        </template>
      </van-cell>
      <van-grid class="user-grid" :column-num="3">
        <van-grid-item class="user-grid-item">
          <span>{{ userInfo.art_count }}</span>
          <span>动态</span>
        </van-grid-item>
        <van-grid-item>
          <span>{{ userInfo.follow_count }}</span>
          <span>关注</span>
        </van-grid-item>
        <van-grid-item>
          <span>{{ userInfo.fans_count }}</span>
          <span>粉丝</span>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 用户菜单模块 -->
    <van-cell-group class="user-menu">
      <van-cell title="编辑资料" center is-link to="/user/edit">
        <template #icon>
          <van-icon name="edit" class="edit-icon menu-icon" />
        </template>
      </van-cell>
      <van-cell title="小思同学" center is-link to="/chat">
        <template #icon>
          <van-icon name="chat-o" class="chat-icon menu-icon" />
        </template>
      </van-cell>
      <!-- 退出登录 -->
      <van-cell title="退出登录" center is-link @click="logout">
        <template #icon>
          <van-icon name="warning-o" class="warning-icon menu-icon" />
        </template>
      </van-cell>
    </van-cell-group>
    <!-- 退出登录弹出框 -->
  </div>
</template>

<script>
// 导入 vuex 辅助函数
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  name: 'User',
  computed: {
    // 从 vuex 中把指定名称的 State 数据映射到组件中使用
    ...mapState(['userInfo', 'tokenInfo', 'userProfile'])
  },
  methods: {
    // 从 vuex 中把指定名称的 Action 方法映射到组件中使用
    ...mapActions(['initUserInfo']),
    ...mapMutations(['cleanState']),
    logout() {
      // 确认是否退出登录
      this.$dialog
        .confirm({
          title: '提示',
          message: '确认退出登录吗？'
        })
        .then(() => {
          // on confirm
          // 清空本地 token 和 userinfo，并跳转到登录页面
          this.cleanState()
          this.$router.push('/login')
        })
        .catch(err => {
          // on cancel
          return err
        })
    }
  },
  created() {
    this.initUserInfo()
  }
}
</script>

<style lang="less" scoped>
.user-box {
  padding-top: 0.533333rem;
  background-color: #007bff;
  color: #fff;
  .user-info {
    padding: 0.266667rem 0.426667rem;
    background-color: #007bff;
    .avatar {
      margin-right: 0.32rem;
    }
    .van-cell__title {
      color: #fff;
    }
    &::after {
      display: none;
    }
  }
  .user-grid {
    &::after {
      border: none;
    }
    border: 0;
    font-size: 0.373333rem;
    /deep/ .van-grid-item__content {
      padding: 30px 0;
      background-color: #007bff;
      border: none;
      &::after {
        border: none;
      }
    }
  }
}
.user-menu {
  .menu-icon {
    margin-right: 0.106667rem;
  }
}
</style>
