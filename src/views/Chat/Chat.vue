<template>
  <div class="chat-container">
    <!-- header -->
    <van-nav-bar
      class="edit-navbar"
      title="小思同学"
      left-arrow
      fixed
      @click-left="$router.back()"
    />
    <!-- 聊天区域 -->
    <div class="chat-list">
      <div v-for="(item, index) in chatList" :key="index">
        <!-- 左侧机器人小思 -->
        <div class="chat-item left" v-if="item.name === 'xs'">
          <van-image
            width="1.066667rem"
            height="1.066667rem"
            round
            class="avatar"
            src="https://img01.yzcdn.cn/vant/cat.jpeg"
          />
          <div class="chat-bubble">{{ item.msg }}</div>
        </div>
        <!-- 右侧用户 -->
        <div class="chat-item right" v-else>
          <div class="chat-bubble">
            {{ item.msg }}
          </div>
          <van-image
            width="1.066667rem"
            height="1.066667rem"
            round
            class="avatar"
            :src="userAvatar"
          />
        </div>
      </div>
    </div>
    <!-- 发送消息区域 -->
    <div class="send-box">
      <van-field v-model.trim="word" placeholder="说点什么...">
        <template #button>
          <van-button
            plain
            size="small"
            type="info"
            class="send-button"
            @click="send"
            >发送</van-button
          >
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
// 导入 vuex 辅助函数
import { mapGetters } from 'vuex'
// 导入 io 方法，调用 io('url') 即可创建 websocket 连接的实例
import { io } from 'socket.io-client'

// 声明变量，用来接收 io() 方法创建的socket实例
let socket = null

export default {
  name: 'Chat',
  data() {
    return {
      // 用户填写的内容
      word: '',
      // 所有聊天消息
      chatList: []
    }
  },
  computed: {
    ...mapGetters(['userAvatar'])
  },
  methods: {
    // 用户发送消息后，向数组中追加内容
    send() {
      // 如果输入的聊天内容为空，则不处理
      if (!this.word) return

      // 向服务器发送消息
      socket.emit('send', this.word)

      // 将用户填写的消息追加到 chatList 数组中
      this.chatList.push({ name: 'me', msg: this.word })

      // 清空文本框中的内容
      this.word = ''
    },
    // 自动滚动到页面底部的方法
    scrollToBottom() {
      // 获取所有的聊天item项
      const chatItem = document.querySelectorAll('.chat-item')
      // 获取 chatItem 最后一个项
      const lastItem = chatItem[chatItem.length - 1]
      // Element 接口的scrollIntoView()方法会滚动元素的父容器，使被调用scrollIntoView()的元素对用户可见。
      lastItem.scrollIntoView({
        // 定义动画过渡效果
        behavior: 'smooth',
        // 定义垂直方向的对齐
        block: 'end'
      })
    }
  },
  watch: {
    chatList() {
      // 监视数据变化，并等dom更新后，再执行滚动到底部的操作
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    }
  },
  created() {
    // 创建客户端 websocket 的实例
    socket = io('ws://www.liulongbin.top:9999')

    // 监听接收到消息的事件
    socket.on('message', msg => {
      // 将服务器发送过来的消息，存储到 chatList 数组中
      this.chatList.push({ name: 'xs', msg })
    })
  },
  beforeDestroy() {
    // 关闭连接
    socket.close()

    // 销毁 websocket 实例对象
    socket = null
  }
}
</script>

<style lang="less" scoped>
.chat-container {
  box-sizing: border-box;
  // MDN: 大多数情况下，height和width 被设定为auto的绝对定位元素，按其内容大小调整尺寸。但是，被绝对定位的元素可以通过指定top和bottom ，保留height未指定（即auto），来填充可用的垂直空间。它们同样可以通过指定left 和 right并将width 指定为auto来填充可用的水平空间。
  position: absolute;
  left: 0;
  top: 0;
  padding: 1.226667rem 0 1.2rem 0;
  width: 100%;
  height: 100%;
  background-color: #fafafa;
  .chat-list {
    height: 100%;
    font-size: 0.373333rem;
    padding: 0 0.213333rem;
    overflow-y: scroll;
    .chat-item {
      position: relative;
      padding: 0.213333rem 0;
      width: 100%;
      .chat-bubble {
        position: relative;
        padding: 0 0.213333rem;
        min-height: 1.066667rem;
        min-width: 1.066667rem;
        max-width: 7.2rem;
        line-height: 1.01333rem;
        background-color: #e0effb;
        border: 0.01333rem solid #c2d9ea;
        border-radius: 0.10667rem;
        word-break: break-all;
        &::before {
          content: '';
          width: 0.266667rem;
          height: 0.266667rem;
          position: absolute;
          top: 0.32rem;
          border-top: 0.013333rem solid #c2d9ea;
          border-right: 0.013333rem solid #c2d9ea;
          background-color: #e0effb;
        }
      }
    }
    .left {
      display: flex;
      align-items: flex-start;
      .avatar {
        margin-right: 0.32rem;
      }
      .chat-bubble {
        &::before {
          left: -0.16rem;
          transform: rotate(-135deg);
        }
      }
    }
    .right {
      display: flex;
      justify-content: flex-end;
      .avatar {
        margin-left: 0.32rem;
      }
      .chat-bubble {
        &::before {
          right: -0.16rem;
          transform: rotate(45deg);
        }
      }
    }
  }
  .send-box {
    display: flex;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 1.2rem;
    width: 100%;
    background-color: #fff;
    align-items: center;
    .send-button {
      text-align: left;
    }
  }
}
</style>
