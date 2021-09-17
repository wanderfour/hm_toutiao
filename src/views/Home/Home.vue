<template>
  <div class="home-container">
    <!-- Navbar -->
    <van-nav-bar fixed>
      <template #left>
        <!-- 在 .vue 文件中通过相对路径引用本地图片时，需要在图片的链接外包上一层 require()，将图片 URL 转换为 webpack 模块请求，并结合 file-loader 或者 url-loader 进行处理。 -->
        <van-image
          height="36px"
          alt="logo"
          :src="require('../../assets/toutiao_logo.png')"
          class="logo"
        />
      </template>
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <!-- Tab -->
    <!-- offset-top 采用rem单位，增加不同尺寸下的适配性，46px / (375/10) =1.22666667rem -->
    <!-- TODO:亲测，设置为rem会让tab与navbar重叠，暂不设置rem -->
    <van-tabs v-model="active" sticky offset-top="46px" ellipsis lazy-render>
      <van-tab v-for="item in channelList" :key="item.id" :title="item.name">
        <art-list :channel-id="item.id"></art-list>
      </van-tab>
    </van-tabs>
    <!-- 管理频道的小图片 + -->
    <van-icon name="plus" />
  </div>
</template>

<script>
import { getUserChannelAPI } from '@/api/homeAPI.js'
import ArtList from '@/components/ArtList/ArtList.vue'

export default {
  name: 'Home',
  data() {
    return {
      active: 0,
      channelList: []
    }
  },
  components: {
    ArtList
  },
  methods: {
    async initUserChannel() {
      const { data: res } = await getUserChannelAPI()
      if (res.message === 'OK') {
        this.channelList = res.data.channels
      } else {
        this.$toast({ message: '导航数据获取失败' }, { position: top })
      }
    }
  },
  created() {
    this.initUserChannel()
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding: 46px 0 50px 0;
  /deep/ .van-tabs__wrap {
    padding-right: 36px;
    background-color: #fff;
  }
  .van-icon-plus {
    position: fixed;
    top: 58px;
    right: 10px;
    z-index: 999;
  }
}
</style>
