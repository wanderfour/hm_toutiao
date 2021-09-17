import instance from '@/utils/request.js'

export const getUserChannelAPI = () => {
  return instance.get('/v1_0/user/channels')
}
