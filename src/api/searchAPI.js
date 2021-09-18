import request from '@/utils/request.js'

export const searchSuggestListAPI = kw => {
  return request.get('/v1_0/suggestion', {
    params: {
      q: kw
    }
  })
}

export const getSearchResultAPI = (kw, page) => {
  return request.get('/v1_0/search', {
    params: {
      q: kw,
      page
    }
  })
}
