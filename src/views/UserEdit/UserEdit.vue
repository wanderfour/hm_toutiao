<template>
  <div class="useredit-container">
    <!-- header -->
    <van-nav-bar
      class="edit-navbar"
      title="编辑资料"
      left-arrow
      fixed
      @click-left="$router.back()"
    />
    <van-cell-group class="edit-box">
      <van-cell title="头像" center is-link>
        <template #default>
          <!-- 用户头像 -->
          <van-image
            width="1.333333rem"
            height="1.333333rem"
            round
            class="avatar"
            :src="userProfile.photo"
            @click="$refs.fileRef.click()"
          />
          <!-- 借助与隐藏的 input type="file" 文件选择框，实现选取照片的功能 -->
          <!-- 点击 van-image 时，获取到文件选择框的ref，并模拟原生dom元素的点击事件 -->
          <!-- 当用户更改<input>、<select>和<textarea> 元素的值并提交这个更改时，change 事件在这些元素上触发。 -->
          <input
            type="file"
            accept="image/*"
            v-show="false"
            ref="fileRef"
            @change="onFileChange"
          />
        </template>
      </van-cell>
      <van-cell
        title="名称"
        is-link
        :value="userProfile.name"
        @click="namePop"
      />
      <van-cell
        title="生日"
        is-link
        :value="userProfile.birthday"
        @click="onBirthCell"
      />
    </van-cell-group>
    <!-- 修改名称弹出框 -->
    <van-dialog
      v-model="showNamePop"
      title="修改名称"
      show-cancel-button
      :before-close="beforeClose"
    >
      <van-field
        v-model.trim="name"
        input-align="center"
        placeholder="请输入用户名称"
        ref="nameIpt"
      />
    </van-dialog>
    <!-- 选择生日 -->
    <van-popup
      v-model="showDatetime"
      position="bottom"
      :style="{ height: '50%' }"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="updateBirthday"
        @cancel="showDatetime = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { updateUserProfileAPI, updateUserPhotoAPI } from '@/api/userAPI.js'
// 导入时间处理第三方包
import dayjs from 'dayjs'

export default {
  name: 'UserEdit',
  data() {
    return {
      showNamePop: false,
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2025, 0, 1),
      currentDate: new Date(1990, 6, 1),
      showDatetime: false,
      // 输入框中名称
      name: ''
    }
  },
  computed: {
    ...mapState(['userProfile'])
  },
  methods: {
    ...mapActions(['initUserProfile']),
    namePop() {
      this.showNamePop = true
      this.name = this.userProfile.name
      this.$nextTick(() => {
        this.$refs.nameIpt.focus()
      })
    },
    // 修改名称 Dialog 关闭前的处理函数
    beforeClose(action, done) {
      // action 可能的值有两个： cancel 和 confirm
      if (action === 'cancel') return done()
      // 判断名称是否合法
      if (this.name === '' || this.name.length > 7) {
        // 提示用户名称长度不合法
        this.$notify({
          type: 'warning',
          message: '名称长度为1-7个字符',
          duration: 2000
        })
        // 让文本框持续获得焦点
        this.$refs.nameIpt.focus()
        // 调用 done 函数关闭对话框，调用 done(false) 阻止对话框关闭
        // 阻止对话框关闭
        return done(false)
      }
      // 调用函数，发起修改名称的请求
      this.updateName(done)
    },
    // 如果接口请求失败，且报错的消息是409，则证明当前提交的名称被占用，需要进行try...catch 处理
    async updateName(done) {
      try {
        const { data: res } = await updateUserProfileAPI({ name: this.name })
        if (res.message === 'OK') {
          // 请求数据成功，关闭弹出层
          done()
          // 重新请求用户的简介信息
          this.initUserProfile()
          // 提示用户更新成功
          this.$notify({
            type: 'success',
            message: '名称更新成功',
            duration: 2000
          })
        }
      } catch (e) {
        if (e.response.status === 409) {
          // 名称被占用提示
          this.$notify({
            type: 'warning',
            message: '名称被占用，请修改后重试',
            duration: 2000
          })
          // 阻止弹出层关闭
          done(false)
          // 让文本框持续获得焦点
          this.$refs.nameIpt.focus()
        } else {
          // 关闭对话框
          done()
          // 提示用户名更新失败
          this.$notify({
            type: 'danger',
            message: '名称更新失败',
            duration: 2000
          })
        }
      }
    },
    onBirthCell() {
      // 显示 DatetimePicker
      this.showDatetime = true
      // 日期面板当前时间为用户生日 或者 默认日期
      this.currentDate = this.userProfile.birthday
        ? new Date(this.userProfile.birthday)
        : new Date(1990, 6, 1)
    },
    async updateBirthday(value) {
      // 关闭动作面板
      this.showDatetime = false
      // 获取选择的日期，并进行格式化
      const date = dayjs(value).format('YYYY-MM-DD')
      // 请求接口提交日期
      const { data: res } = await updateUserProfileAPI({ birthday: date })
      if (res.message === 'OK') {
        // 关闭 DatetimePicker
        this.showDatetime = false
        // 更新页面数据
        this.initUserProfile()
        // 提示用户生日修改成功
        this.$notify({
          type: 'success',
          message: '生日修改成功',
          duration: 2000
        })
      }
    },
    // 选中的文件发生了变化
    async onFileChange(e) {
      if (e.currentTarget.files.length === 0) return
      const formData = new FormData()
      // 将上传的文件转化为 formData 对象格式
      formData.append('photo', e.currentTarget.files[0])
      const { data: res } = await updateUserPhotoAPI(formData)
      if (res.message === 'OK') {
        // 更新页面数据
        this.initUserProfile()
        // 提示用户更新头像成功
        this.$notify({
          type: 'success',
          message: '更新头像成功',
          duration: 2000
        })
      }
    }
  },
  created() {
    this.initUserProfile()
  }
}
</script>

<style lang="less" scoped>
.edit-box {
  padding-top: 46px;
  .avatar-uploader {
    width: 100%;
  }
}
</style>
