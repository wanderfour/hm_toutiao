import instance from '@/utils/request.js'

// 登录 API 接口
export const loginAPI = data => {
  return instance.post('/v1_0/authorizations', data)
}
