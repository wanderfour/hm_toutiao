<template>
  <div class="artlist-container">
    <van-pull-refresh
      v-model="refreshing"
      success-text="刷新成功"
      :disabled="finished"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="onLoad"
      >
        <art-item
          v-for="item in artlist"
          :key="item.art_id"
          :article="item"
          @remove-article="removeArt(item.art_id)"
        ></art-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArtListAPI } from '@/api/homeAPI.js'
import ArtItem from '../ArtItem/ArtItem.vue'

export default {
  name: 'ArtList',
  components: { ArtItem },
  props: {
    channelId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      artlist: [],
      timestamp: Date.now(),
      // 显示上拉加载请求状态
      loading: false,
      // 显示所有是否数据是否加载完毕
      finished: false,
      // 显示下拉刷新状态
      refreshing: false
    }
  },
  methods: {
    async initArtList() {
      const { data: res } = await getArtListAPI(this.channelId, this.timestamp)
      if (res.message === 'OK') {
        // 为时间戳重新赋值
        // 上拉加载或下拉刷新时的值必须为 pre_timestamp 的值
        this.timestamp = res.data.pre_timestamp
        // 拼接新请求回来的数据
        if (this.refreshing) {
          this.artlist = [...res.data.results, ...this.artlist]
          this.refreshing = false
        } else {
          this.artlist = [...this.artlist, ...res.data.results]
          // 修改loading状态为 false
          this.loading = false
        }
        // 如果服务器响应的 pre_timestamp 值为 null，则证明没有更多数据了
        if (res.data.pre_timestamp === null) {
          this.finished = true
        }
      } else {
        this.$toast({ message: '文章数据获取失败' }, { position: top })
      }
    },
    onLoad() {
      this.initArtList()
    },
    onRefresh() {
      this.initArtList()
    },
    removeArt(id) {
      // 移除被标记了不感兴趣的文章
      this.artlist = this.artlist.filter(item => item.art_id !== id)
      // 移除多篇文章后，会导致屏幕出现空白，且导致上拉、下拉加载不生效问题，需要判断小于10时主动请求下一页的数据
      if (this.artlist.length < 10) {
        this.initArtList()
      }
    }
  },
  created() {
    this.initArtList()
  }
}
</script>

<style lang="less" scoped></style>
