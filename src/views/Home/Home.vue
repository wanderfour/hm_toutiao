<template>
  <div class="home-container">
    <!-- Navbar -->
    <van-nav-bar fixed>
      <template #left>
        <!-- 在 .vue 文件中通过相对路径引用本地图片时，需要在图片的链接外包上一层 require()，将图片 URL 转换为 webpack 模块请求，并结合 file-loader 或者 url-loader 进行处理。 -->
        <van-image
          height=".986667rem"
          alt="logo"
          :src="require('../../assets/toutiao_logo.png')"
          class="logo"
        />
      </template>
      <template #right>
        <van-icon name="search" size="18" @click="$router.push('/search')" />
      </template>
    </van-nav-bar>
    <!-- Tab -->
    <!-- offset-top 采用rem单位，增加不同尺寸下的适配性，46px / (375/10) =1.22666667rem -->
    <van-tabs
      v-model="activeName"
      sticky
      offset-top="1.22666667rem"
      ellipsis
      lazy-render
      :before-change="beforeTabChange"
      @change="onTabChange"
    >
      <van-tab
        v-for="item in channelList"
        :key="item.id"
        :title="item.name"
        :name="item.id"
      >
        <!-- 文章列表组件 -->
        <art-list :channel-id="item.id"></art-list>
      </van-tab>
    </van-tabs>
    <!-- 管理频道的小图片 + -->
    <van-icon name="plus" @click="showPopup" class="channel-icon-plus" />
    <!-- 频道管理弹出层 -->
    <van-popup
      v-model="show"
      :style="{ height: '100%', width: '100%' }"
      get-container="body"
      class="channel-popup"
      @closed="isDel = false"
    >
      <!-- navbar -->
      <van-nav-bar title="频道管理">
        <template #right>
          <van-icon name="cross" size="18" @click="show = false" />
        </template>
      </van-nav-bar>
      <!-- 已添加频道 -->
      <div class="my-channal">
        <div class="channal-hd">
          <div class="left">
            已添加频道：<span class="desc">{{
              isDel ? '点击移除频道' : '点击进入频道'
            }}</span>
          </div>
          <div class="right" @click="isDel = !isDel">
            {{ isDel ? '完成' : '编辑' }}
          </div>
        </div>
        <van-row type="flex" class="channel-content">
          <van-col span="6" v-for="item in channelList" :key="item.id">
            <div class="channel-item" @click="removeChannel(item)">
              {{ item.name }}
              <!-- 删除图标 -->
              <van-badge
                color="transparent"
                class="remove-item"
                v-if="isDel && item.name !== '推荐' && channelList.length > 2"
              >
                <div class="child" />
                <template #content>
                  <van-icon name="cross" class="badge-icon" />
                </template>
              </van-badge>
            </div>
          </van-col>
        </van-row>
      </div>
      <!-- 分隔线 -->
      <van-divider class="sp-line"></van-divider>
      <!-- 可添加频道 -->
      <div class="other-channel">
        <div class="channal-hd">
          <div class="left">
            已添加频道：<span class="desc">点击进入频道</span>
          </div>
        </div>
        <van-row type="flex" class="channel-content">
          <van-col span="6" v-for="item in moreChannels" :key="item.id">
            <div class="channel-item" @click="addChannel(item)">
              {{ item.name }}
            </div>
          </van-col>
        </van-row>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  getUserChannelAPI,
  getAllChannelAPI,
  updateUserChannelAPI
} from '@/api/homeAPI.js'
import ArtList from '@/components/ArtList/ArtList.vue'

export default {
  name: 'Home',
  data() {
    return {
      activeName: '',
      // 用户的频道列表
      channelList: [],
      // 排除用户频道的其他频道列表
      allChannel: [],
      show: false,
      isDel: false,
      // 记录频道id和滚动条位置之间的对应关系
      nameToTop: {}
    }
  },
  components: {
    ArtList
  },
  computed: {
    // 更多频道的数据
    moreChannels() {
      return this.allChannel.filter(item => {
        // 判断当前循环项，是否在”我的频道“列表中
        const index = this.channelList.findIndex(x => x.id === item.id)
        // 如果不再，则 return true ，表示需要把这一项存储到返回的新数组中
        if (index === -1) return true
      })
    }
  },
  methods: {
    async initUserChannel() {
      const { data: res } = await getUserChannelAPI()
      if (res.message === 'OK') {
        this.channelList = res.data.channels
      } else {
        this.$toast({ message: '导航数据获取失败' }, { position: top })
      }
    },
    async initAllChannel() {
      const { data: res } = await getAllChannelAPI()
      if (res.message === 'OK') {
        this.allChannel = res.data.channels
      } else {
        this.$toast({ message: '全部导航数据获取失败' }, { position: top })
      }
    },
    showPopup() {
      this.show = true
    },
    removeChannel(channel) {
      if (channel.name === '推荐' || this.channelList.length <= 2) return
      if (this.isDel) {
        this.channelList = this.channelList.filter(
          item => item.id !== channel.id
        )
        this.updateUserChannel()
      } else {
        this.show = false
        this.isDel = false
        this.activeName = channel.id
      }
    },
    addChannel(channel) {
      this.channelList.push(channel)
      this.updateUserChannel()
    },
    async updateUserChannel() {
      // 准备要提交到服务器的数据
      // filter 剔除 推荐频道
      // map 返回一个处理过的符合接口要求的数组
      const channels = this.channelList
        .filter(item => item.name !== '推荐')
        .map((item, index) => {
          return {
            id: item.id,
            seq: index + 1
          }
        })
      // 调用接口 put 数据
      const { data: res } = await updateUserChannelAPI(channels)
      if (res.message === '更新用户频道成功') {
        this.$toast({ message: '更新用户频道成功' }, { position: top })
      } else {
        this.$toast({ message: '更新用户频道失败' }, { position: top })
      }
    },
    beforeTabChange() {
      // 用于记录每个tab下的滚动条位置
      const channelId = this.channelList[this.activeName].id
      this.nameToTop[channelId] = window.scrollY
      // return true 表示允许进行标签页的切换
      return true
    },
    onTabChange() {
      this.$nextTick(() => {
        const channelId = this.channelList[this.activeName].id
        window.scrollTo(0, this.nameToTop[channelId] || 0)
      })
    }
  },
  created() {
    this.initUserChannel()
    this.initAllChannel()
  },
  // 通过组件内守卫，记录页面纵向滚动位置
  // 导航离开该组件的对应路由时调用
  // 可以访问组件实例 `this`
  beforeRouteLeave(to, from, next) {
    from.meta.top = window.scrollY
    next()
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding: 1.226667rem 0 1.333333rem 0;
  /deep/ .van-tabs__wrap {
    position: relative;
    padding-right: 0.96rem;
    background-color: #fff;
  }
  .channel-icon-plus {
    position: fixed;
    top: 1.6rem;
    right: 0.266667rem;
    z-index: 999;
    font-size: 0.426667rem;
  }
}
.other-channel,
.my-channal {
  padding: 0.213333rem;
  .channal-hd {
    display: flex;
    padding: 0 0.16rem;
    justify-content: space-between;
    .left {
      font-weight: 700;
      font-size: 0.373333rem;
      .desc {
        font-weight: 400;
        font-size: 0.32rem;
        color: #666;
      }
    }
    .right {
      padding: 0.266667rem 0.266667rem;
      border: 0.026667rem solid #999;
      font-size: 0.32rem;
      border-radius: 0.106667rem;
    }
  }
  .channel-content {
    display: flex;
    padding: 0.16rem 0;
    // flex-direction: column;
    .channel-item {
      position: relative;
      flex: 1;
      margin: 0.16rem;
      line-height: 0.96rem;
      font-size: 0.32rem;
      text-align: center;
      border: 0.026667rem solid #ebedf0;
      background-color: #fafafa;
      .remove-item {
        position: absolute;
        top: 0.16rem;
        right: 0.16rem;
        .badge-icon {
          color: #bbb;
        }
      }
    }
  }
}
.sp-line {
  border-color: #dadada;
  padding: 0 0.373333rem;
  margin: 0 0 0.266667rem 0;
}
</style>
