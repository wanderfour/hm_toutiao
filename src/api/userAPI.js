import request from '@/utils/request.js'

// 登录 API 接口
export const loginAPI = data => {
  return request.post('/v1_0/authorizations', data)
}

// 获取用户基本信息 API
export const getUserInfoAPI = () => {
  return request.get('/v1_0/user')
}

// 获取用户简介信息 API
export const getUserProfileAPI = () => {
  return request.get('/v1_0/user/profile')
}

// 修改用户名称和生日的 API
// { name: 'xxx' } 或 { birthday: '2012-12-12' } 参数非必传，任一即可
export const updateUserProfileAPI = obj => {
  return request.patch('/v1_0/user/profile', obj)
}

// 修改头像的 API
// 修改头像时，需要向服务器提交 FormData 格式的请求体。
export const updateUserPhotoAPI = photo => {
  return request.patch('/v1_0/user/photo', photo)
}

// 根据 refresh_token 换取新 token 的 API
export const exchangeTokenAPI = refreshToken => {
  return request.put('/v1_0/authorizations', {
    Headers: {
      Authorization: 'Bearer' + refreshToken
    }
  })
}
