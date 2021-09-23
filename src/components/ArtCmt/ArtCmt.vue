<template>
  <div class="artcmt-container">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      class="cmt-list"
      @load="onLoad"
    >
      <div class="cmt-item" v-for="item in cmtList" :key="item.com_id">
        <!-- 评论头部区域 -->
        <van-cell size="normal" center class="cmt-hd">
          <template #title>
            <span class="custom-title">{{ item.aut_name }}</span>
          </template>
          <template #right-icon>
            <van-icon
              name="like"
              color="red"
              size=".426667rem "
              class="like-icon"
              v-if="item.is_liking"
              @click="cancelCmtLike(item)"
            />
            <van-icon
              name="like-o"
              size=".426667rem"
              class="like-icon"
              v-else
              @click="cmtLike(item)"
            />
          </template>
          <template #icon>
            <van-image
              width="1.066667rem"
              height="1.066667rem"
              round
              :src="item.aut_photo"
              class="avatar"
            />
          </template>
        </van-cell>
        <!-- 评论内容区域 -->
        <div class="cmt-bd">
          {{ item.content }}
        </div>
        <!-- 发布时间 -->
        <div class="pubdate">{{ item.pubdate | dateFormat }}</div>
      </div>
    </van-list>
    <!-- 发布评论 -->
    <!-- 发布评论入口栏 -->
    <div class="add-cmt-box van-hairline--top" v-if="!isIpt">
      <van-icon name="arrow-left" @click="$router.back()" />
      <div class="ipt-cmt-div" @click="showIpt">发表评论</div>
      <div class="icon-box">
        <van-icon
          name="comment-o"
          :badge="cmtCount"
          :max="99"
          @click="scrollToCmtList"
        />
        <van-icon name="star-o" />
        <van-icon name="share-o" />
      </div>
    </div>
    <!-- 发布评论输入框 -->
    <van-form class="ipt-cmt-box van-hairline--top" v-else>
      <textarea
        class="ipt-area"
        placeholder="友善评论、理性发言、阳光心灵"
        ref="iptArea"
        v-model.trim="cmt"
        @blur="hideIpt"
      ></textarea>
      <van-button
        class="pub-button"
        ref="pubButton"
        type="default"
        :disabled="cmt.lenght === 0"
        @click="pubCmt"
        >发布</van-button
      >
    </van-form>
  </div>
</template>

<script>
import {
  getCmtListAPI,
  cmtLikeAPI,
  cancelCmtLikeAPI,
  pubCmtAPI
} from '@/api/articleAPI.js'

// 引入用于平滑动画的第三方包 popmotion
import { animate } from 'popmotion'

export default {
  name: 'ArtCmt',
  props: ['artId'],
  data() {
    return {
      offset: null,
      cmtList: [],
      loading: false,
      finished: false,
      cmtLiking: false,
      isIpt: false,
      cmtCount: 0,
      // 用户在输入框填写的评论内容
      cmt: ''
    }
  },
  methods: {
    async initCmtList() {
      const { data: res } = await getCmtListAPI(this.artId, this.offset)
      if (res.message === 'OK') {
        this.cmtList = [...this.cmtList, ...res.data.results]
        this.offset = res.data.last_id
        this.cmtCount = res.data.total_count
        this.loading = false
        if (res.data.results.length === 0) {
          this.finished = true
        }
      } else {
        this.$toast('获取评论数据失败')
      }
    },
    onLoad() {
      this.initCmtList()
    },
    async cmtLike(cmt) {
      const { data: res } = await cmtLikeAPI(cmt.com_id)
      if (res.message === 'OK') {
        cmt.is_liking = true
      }
    },
    async cancelCmtLike(cmt) {
      const res = await cancelCmtLikeAPI(cmt.com_id)
      if (res.status === 204) {
        cmt.is_liking = false
      }
    },
    showIpt() {
      this.isIpt = true
      // textarea 自动获得焦点
      this.$nextTick(() => {
        this.$refs.iptArea.focus()
      })
    },
    hideIpt() {
      // 延时隐藏，以便操作发布按钮
      setTimeout(() => {
        this.isIpt = false
        // 清空用户输入的评论内容
        this.cmt = ''
      }, 100)
    },
    async pubCmt() {
      const { data: res } = await pubCmtAPI(this.artId, this.cmt)
      console.log(res)
      if (res.message === 'OK') {
        // 评论数增加1
        this.cmtCount += 1
        // 将新内容添加到评论列表最前面
        this.cmtList.unshift(res.data.new_obj)
        // 提示用户发布成功
        this.$toast.success('发布评论成功')
        // 发布评论后页面平滑滚动到新评论的位置，借助 popmotion 第三方包
        this.scrollToCmtList()
      }
    },
    scrollToCmtList() {
      // 当前滚动条的位置
      const now = window.scrollY
      // 滚动目标位置（文章信息区域的高度）
      const dist = document.querySelector('.article-box').offsetHeight
      // 滚动动画
      animate({
        to: dist,
        from: now,
        onUpdate: latest => window.scrollTo(0, latest)
      })
    }
  },
  created() {
    this.initCmtList()
  }
}
</script>

<style lang="less" scoped>
.cmt-item {
  padding: 0.32rem 0;
  border-bottom: 0.026667rem solid #f6f6f6;
  .cmt-hd {
    padding: 0;
    .custom-title {
      font-size: 0.32rem;
    }
    .avatar {
      margin-right: 0.32rem;
    }
    &::after {
      display: none;
    }
  }
  .cmt-bd {
    padding: 0.32rem;
    font-size: 0.373333rem;
  }
  .pubdate {
    font-size: 0.32rem;
    color: #999;
  }
}
.add-cmt-box {
  position: fixed;
  display: flex;
  height: 1.226667rem;
  width: 100%;
  bottom: 0;
  background-color: #fff;
  align-items: center;
  justify-content: space-between;
  font-size: 0.48rem;
  .ipt-cmt-div {
    flex: 1;
    margin-left: 0.32rem;
    padding-left: 0.32rem;
    height: 0.853333rem;
    line-height: 0.853333rem;
    border: 0.02667rem solid #efefef;
    font-size: 0.32rem;
    background-color: #f6f6f6;
    border-radius: 0.48rem;
  }
  .icon-box {
    padding-right: 0.32rem;
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    font-size: 0.533333rem;
  }
}
.ipt-cmt-box {
  box-sizing: border-box;
  display: flex;
  height: 2.133333rem;
  width: 100%;
  position: fixed;
  padding-left: 0.266667rem;
  bottom: 0;
  left: 0;
  background-color: #fff;
  align-items: center;
  justify-content: space-between;
  .ipt-area {
    flex: 1;
    height: 66%;
    padding: 0.133333rem;
    border: 0.02667rem solid #efefef;
    font-size: 0.32rem;
    background-color: #f6f6f6;
    border-radius: 0.106667rem;
    resize: none;
  }
  .pub-button {
    height: 100%;
    border: none;
    color: #333;
  }
}
</style>
