<template>
  <div class="artitem-container">
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
          <van-icon name="cross" class="cross-icon" />
        </div>
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'ArtItem',
  props: {
    article: {
      type: Object,
      required: true,
      default: function() {
        return {}
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-cell {
  padding: 10px 16px;
  .thumb {
    height: 70px;
    width: 113px;
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
</style>
