import request from '@/utils/request.js'

// 获取用户文章频道列表的api
export const getUserChannelAPI = () => {
  return request.get('/v1_0/user/channels')
}

// 获取全部文章频道列表的api
export const getAllChannelAPI = () => {
  return request.get('/v1_0/channels')
}

// 获取文章列表的api
export const getArtListAPI = (id, time) => {
  return request.get('/v1_0/articles', {
    params: {
      channel_id: id,
      timestamp: time
    }
  })
}

// 设置文章为不感兴趣的 api，传入形参id，设置某文章为不感兴趣
export const dislikeArticleAPI = id => {
  return request.post('/v1_0/article/dislikes', {
    // data: {
    target: id
    // }
  })
}

// 举报文章 api
export const reportArticleAPI = (target, type) => {
  return request.post('/v1_0/article/reports', {
    target,
    type
  })
}

// 更新用户频道列表数据的 API
export const updateUserChannelAPI = channels => {
  return request.put('/v1_0/user/channels', {
    channels
  })
}
