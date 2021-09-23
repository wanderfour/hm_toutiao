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

// 获取文章评论列表的 API
export const getCmtListAPI = (artId, offset) => {
  return request.get('/v1_0/comments', {
    params: {
      type: 'a',
      source: artId,
      offset
    }
  })
}

// 评论点赞 API
export const cmtLikeAPI = cmtId => {
  return request.post('/v1_0/comment/likings', {
    target: cmtId
  })
}

// 取消评论点赞 API
export const cancelCmtLikeAPI = cmtId => {
  return request.delete(`/v1_0/comment/likings/${cmtId}`)
}

// 发表文章评论 API
export const pubCmtAPI = (artId, cmt) => {
  return request.post('/v1_0/comments', {
    target: artId,
    content: cmt
  })
}
