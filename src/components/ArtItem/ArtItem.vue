<template>
  <div
    class="artitem-container"
    @click="$router.push('/article/' + article.art_id)"
  >
    <van-cell>
      <!-- 使用 title 插槽来自定义标题 -->
      <template #title>
        <div class="title-box">
          <span class="custom-title">{{ article.title }}</span>
          <!-- 单张图片 -->
          <!-- lazy-load 为图片开启懒加载，搭配 Vant 中的 Lazyload 组件使用，修改 src 为 v-lazy -->
          <img
            v-if="article.cover.type === 1"
            v-lazy="article.cover.images[0]"
            alt=""
            class="thumb"
          />
        </div>
        <div v-if="article.cover.type === 3" class="thumb-box">
          <img
            v-for="(item, index) in article.cover.images"
            :key="index"
            v-lazy="item"
            alt=""
            class="thumb"
          />
        </div>
      </template>
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <template #label>
        <div class="label-box">
          <span
            >作者 {{ article.aut_name }}&nbsp;&nbsp;{{
              article.comm_count
            }}&nbsp;评论 &nbsp;&nbsp;发布日期&nbsp;{{
              article.pubdate | dateFormat
            }}</span
          >
          <van-icon
            name="cross"
            class="cross-icon"
            @click="show = true"
            v-if="closable"
          />
        </div>
      </template>
    </van-cell>
    <!-- 一级反馈面板 -->
    <!-- 解决动作面板上下滑动，引起 List 组件的下拉刷新，将ActionList 组件，通过get-container 属性挂载到 body 元素下（注：Chrome 浏览器测试没有遇到上诉问题） -->
    <van-action-sheet
      v-model="show"
      cancel-text="取消"
      get-container="body"
      v-if="isFirst"
    >
      <div class="content">
        <van-cell
          v-for="(item, index) in actions"
          :key="index"
          :title="item.name"
          clickable
          class="action-item"
          @click="onCellClick(item.name)"
        />
      </div>
    </van-action-sheet>
    <!-- 二级反馈面板 -->
    <van-action-sheet
      v-model="subShow"
      cancel-text="返回"
      @cancel="isFirst = true"
      get-container="body"
      v-else
    >
      <div class="content">
        <van-cell
          v-for="item in reports"
          :key="item.type"
          :title="item.label"
          clickable
          class="action-item"
          @click="report(item.type)"
        />
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
// 导入二级面板选项列表
import reports from '@/api/reports.js'
// 导入设置文章不感兴趣的 api
import { dislikeArticleAPI, reportArticleAPI } from '@/api/homeAPI.js'

export default {
  name: 'ArtItem',
  props: {
    article: {
      type: Object,
      required: true,
      default: function() {
        return {}
      }
    },
    // 控制不同父组件对关闭按钮的要求
    closable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: false,
      subShow: false,
      isFirst: true,
      // 一级面板选项数据
      actions: [
        { name: '不感兴趣' },
        { name: '反馈垃圾内容' },
        { name: '拉黑作者' }
      ],
      // 二级面板选项数据
      reports
    }
  },
  methods: {
    onCellClick(name) {
      if (name === '不感兴趣') {
        this.show = false
        this.dislike()
        // 将文章id发给父组件
        this.$emit('remove-article', this.article.art_id)
      } else if (name === '拉黑作者') {
        this.show = false
      } else if (name === '反馈垃圾内容') {
        this.isFirst = false
        this.subShow = true
      }
    },
    async dislike() {
      const { data: res } = await dislikeArticleAPI(this.article.art_id)
      if (res.message === 'OK') {
        this.$toast('反馈成功')
      } else {
        this.$toast('反馈没有成功')
      }
    },
    async report(type) {
      const { data: res } = await reportArticleAPI(this.article.art_id, type)
      if (res.message === 'OK') {
        this.$toast('反馈成功')
        this.$emit('remove-article', this.article.art_id)
        this.subShow = false
      } else {
        this.$toast('反馈没有成功')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-cell {
  padding: 0.266667rem 0.426667rem;
  .thumb {
    height: 1.866667rem;
    width: 3.013333rem;
    background-color: #f8f8f8;
    object-fit: cover;
  }
  .title-box {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .label-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .thumb-box {
    display: flex;
    justify-content: space-between;
  }
}
.content {
  .action-item {
    text-align: center;
  }
}
</style>
