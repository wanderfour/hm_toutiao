import request from '@/utils/request.js'

// 获取文章详情的 API
export const getArticleDetailAPI = aid => {
  return request.get(`/v1_0/articles/${aid}`)
}

// 关注作者接口
export const followAuthorAPI = autId => {
  return request.post('/v1_0/user/followings', {
    target: autId
  })
}

// 取消关注的接口
export const cancelFollowAuthorAPI = autId => {
  return request.delete(`/v1_0/user/followings/${autId}`)
}

// 文章点赞 API
export const likeArticleAPI = artId => {
  return request.post('/v1_0/article/likings', {
    target: artId
  })
}

// 取消文章点赞 API
export const cancelLikeArticleAPI = artId => {
  return request.delete(`/v1_0/article/likings/${artId}`)
}
