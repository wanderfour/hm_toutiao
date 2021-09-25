<template>
  <div class="s-result-container">
    <van-nav-bar title="搜索结果" left-arrow @click-left="$router.back()" />
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
          v-for="item in searchResultList"
          :key="item.art_id"
          :article="item"
          :closable="false"
        ></art-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getSearchResultAPI } from '@/api/searchAPI.js'
import ArtItem from '@/components/ArtItem/ArtItem.vue'

export default {
  name: 'SearchResult',
  props: {
    kw: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 请求数据的页码
      page: 1,
      searchResultList: [],
      loading: false,
      finished: false,
      refreshing: false
    }
  },
  components: {
    ArtItem
  },
  watch: {
    kw() {
      // 重置关键数据，解决页面内容被缓存不更新问题
      this.page = 1
      this.searchResultList = []
      this.loading = false
      this.refreshing = false
      // 重新请求页面数据
      this.initSearchResult()
    }
  },
  methods: {
    async initSearchResult() {
      const { data: res } = await getSearchResultAPI(this.kw, this.page)
      if (res.message === 'OK') {
        // 下拉后，请求数据，并拼接新旧数据
        if (this.refreshing) {
          this.searchResultList = [
            ...res.data.results,
            ...this.searchResultList
          ]
          this.refreshing = false
        } else {
          this.searchResultList = [
            ...this.searchResultList,
            ...res.data.results
          ]
          this.loading = false
        }
        if (res.data.results.length <= 0) {
          this.finished = true
          return
        }
        this.page++
      } else {
        this.$toast('获取搜索结果失败')
      }
    },
    onLoad() {
      this.initSearchResult()
    },
    onRefresh() {
      this.initSearchResult()
    }
  },
  created() {
    this.initSearchResult()
  },
  beforeRouteLeave(to, from, next) {
    from.meta.top = window.scrollY
    setTimeout(() => {
      next()
    }, 0)
  }
}
</script>

<style lang="less" scoped></style>
