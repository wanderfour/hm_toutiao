<template>
  <div class="search-container">
    <div class="search-header">
      <!-- 返回图标 -->
      <van-icon
        name="arrow-left"
        size="18"
        color="#fff"
        class="goback"
        maxlength="300"
        @click="$router.back()"
      />
      <!-- 搜索框 -->
      <van-search
        v-model.trim="kw"
        shape="round"
        placeholder="请输入搜索关键词"
        @input="onInput"
      />
    </div>
    <!-- 搜索建议 -->
    <div class="search-suggest" v-if="suggestList.length > 0">
      <div
        class="suggest-item"
        v-for="(item, index) in suggestList"
        :key="index"
        v-html="item"
        @click="gotoSearchResult"
      ></div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="delete-icon" @click="removeHistory" />
        </template>
      </van-cell>
      <!-- 历史列表 -->
      <div class="history-list">
        <span
          class="history-item"
          v-for="(item, i) in history"
          :key="i"
          @click="gotoSearchResult"
          >{{ item }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { searchSuggestListAPI } from '@/api/searchAPI.js'

export default {
  name: 'Search',
  data() {
    return {
      // 搜索输入内容
      kw: '',
      // 延时器的 id
      timerId: null,
      suggestList: [],
      // 搜索历史
      history: JSON.parse(localStorage.getItem('history')) || []
    }
  },
  methods: {
    onInput() {
      // 清除上次的延时器
      clearTimeout(this.timerId)

      // 如果输入内容为空不开启延时器
      if (this.kw.length === 0) {
        // 输入内容为空时，清空搜索建议列表
        this.suggestList = []
        return
      }

      // 开启延时器
      this.timerId = setTimeout(() => {
        // 请求建议列表的数据
        this.getSuggest()
      }, 500)
    },
    async getSuggest() {
      const { data: res } = await searchSuggestListAPI(this.kw)
      if (res.message === 'OK') {
        this.hlightKW(res.data.options)
        this.suggestList = res.data.options

        // 将搜索关键词加入到搜索历史中
        if (this.kw === 0) return
        const newHistory = this.history.filter(item => item !== this.kw)
        newHistory.unshift(this.kw)
        this.history = newHistory
      }
    },
    // 搜索词高亮方法
    hlightKW(arr) {
      // 根据用户输入创建动态正则表达式，匹配模式为 全局匹配、忽略大小写
      const reg = new RegExp(this.kw, 'gi')

      arr.forEach((item, index) => {
        arr[index] = item.replace(reg, val => {
          return `<span style="color: red; font-weight: 700;">${val}</span>`
        })
      })
    },
    removeHistory() {
      this.history = []
      localStorage.removeItem('history')
    },
    gotoSearchResult(e) {
      // 后去当前用户点击的搜索建议项内容
      const kw = e.currentTarget.innerText
      // 跳转到相应搜索结果页面
      this.$router.push('/search/' + kw)
    }
  },
  watch: {
    // 监听历史记录的变化
    history(newVal) {
      if (this.history.length === 0) return
      localStorage.setItem('history', JSON.stringify(newVal))
    }
  },
  mounted() {
    // 搜索框自动获得焦点
    const ipt = document.querySelector('input[type=search]')
    ipt && ipt.focus()
  }
}
</script>

<style lang="less" scoped>
.search-header {
  display: flex;
  // position: fixed;
  // z-index: 999;
  background-color: #007bff;
  height: 1.226667rem;
  width: 100%;
  padding: 0 0.373333rem;
  align-items: center;
  .van-search {
    flex: 1;
    margin-right: 0.373333rem;
    height: 1.226667rem;
    background-color: #007bff;
  }
}
.search-suggest {
  background-color: #fff;
  .suggest-item {
    height: 1.226667rem;
    margin: 0 0.373333rem;
    border-bottom: 0.026667rem solid #efefef;
    background-color: #fff;
    line-height: 1.226667rem;
    font-size: 0.373333rem;
    // 超出一行用省略号代替
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.delete-icon {
  font-size: 0.426667rem;
  line-height: inherit;
}
.history-list {
  padding: 0.373333rem;
  font-size: 0.32rem;
  .history-item {
    display: inline-block;
    padding: 0.213333rem 0.373333rem;
    margin: 0.16rem 0.32rem 0.16rem 0;
    background-color: #efefef;
    border-radius: 0.213333rem;
  }
}
</style>
