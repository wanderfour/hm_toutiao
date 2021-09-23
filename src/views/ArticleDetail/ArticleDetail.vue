<template>
  <div class="detail-container">
    <!-- TODO:返回文章列表，列表不刷新且记住滚轮位置 -->
    <!-- header -->
    <van-nav-bar
      class="detail-navbar"
      title="文章详情"
      left-arrow
      fixed
      @click-left="$router.back()"
    />
    <!-- 文章区域 -->
    <div class="article-box">
      <!-- 文章标题 -->
      <h1 class="title">
        {{ artDetail.title }}
      </h1>
      <!-- 文章作者 -->
      <van-cell
        class="author-box"
        center
        :title="artDetail.aut_name"
        :label="artDetail.pubdate"
      >
        <!-- 使用插槽来自定义内容 -->
        <template #icon>
          <img class="avatar" :src="artDetail.aut_photo" alt="" />
        </template>
        <template #default>
          <van-button
            type="info"
            size="mini"
            @click="cancelFollowed"
            v-if="artDetail.is_followed"
            >已关注</van-button
          >
          <van-button
            plain
            type="info"
            icon="plus"
            size="mini"
            @click="follow"
            v-else
            >关注</van-button
          >
        </template>
      </van-cell>
      <!-- 分割线 -->
      <van-divider />
      <!-- 文章内容 -->
      <div class="art-content" v-html="artDetail.content"></div>
      <!-- 分割线 -->
      <van-divider>End</van-divider>
      <!-- 点赞 -->
      <div class="like-box">
        <van-button
          color="#ee0a24"
          type="info"
          size="small"
          v-if="artDetail.attitude === 1"
          @click="cancelLike"
        >
          已点赞
        </van-button>
        <van-button
          plain
          icon="good-job-o"
          color="#ee0a24"
          type="info"
          size="small"
          v-else
          @click="like"
        >
          点赞
        </van-button>
      </div>
    </div>
    <!-- 文章评论 -->
    <div class="cmt-box">
      <art-cmt :art-id="aid"></art-cmt>
    </div>
  </div>
</template>

<script>
import {
  getArticleDetailAPI,
  followAuthorAPI,
  cancelFollowAuthorAPI,
  likeArticleAPI,
  cancelLikeArticleAPI
} from '@/api/articleAPI.js'
import ArtCmt from '@/components/ArtCmt/ArtCmt.vue'

export default {
  name: 'ArticleDetail',
  components: {
    ArtCmt
  },
  props: ['aid'],
  data() {
    return {
      artDetail: ''
    }
  },
  methods: {
    async initArticleDetail() {
      const { data: res } = await getArticleDetailAPI(this.aid)
      if (res.message === 'OK') {
        this.artDetail = res.data
      } else {
        this.$toast('获取文章内容失败')
      }
    },
    async follow() {
      const { data: res } = await followAuthorAPI(this.artDetail.aut_id)
      if (res.message === 'OK') {
        // 手动更改关注的状态
        this.artDetail.is_followed = true
      }
    },
    async cancelFollowed() {
      const res = await cancelFollowAuthorAPI(this.artDetail.aut_id)
      if (res.status === 204) {
        this.artDetail.is_followed = false
      }
    },
    async like() {
      const { data: res } = await likeArticleAPI(this.aid)
      if (res.message === 'OK') {
        this.artDetail.attitude = 1
      }
    },
    async cancelLike() {
      const res = await cancelLikeArticleAPI(this.aid)
      if (res.status === 204) {
        this.artDetail.attitude = -1
      }
    }
  },
  created() {
    this.initArticleDetail()
  }
}
</script>

<style lang="less" scoped>
// TODO: http://localhost:8080/#/article/8125 样式问题
.detail-container {
  padding: 1.493333rem 0.266667rem 1.333333rem;
  .article-box {
    width: 100%;
    .title {
      font-size: 0.42667rem;
      margin: 0.266667rem 0;
    }
    .author-box {
      padding: 0.266667rem 0;
      .avatar {
        width: 1.6rem;
        border-radius: 50%;
        margin-right: 0.16rem;
      }
      &::after {
        display: none;
      }
    }
    .art-content {
      font-size: 0.32rem;
      width: 10rem;
      // 桌面浏览器总是显示滚动条，无论内容是否发生溢出。这可以避免滚动条的显示与消失所导致的元素尺寸不确定的问题。而打印机可能会打印溢出的内容。
      overflow-x: scroll;
      // 对于non-CJK (CJK 指中文/日文/韩文) 文本，可在任意字符间断行。
      word-break: break-all;
    }
    .like-box {
      text-align: center;
    }
  }
  .cmt-box {
    padding: 0.8rem 0;
  }
}
</style>
