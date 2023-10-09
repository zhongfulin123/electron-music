import { http } from '@renderer/utils'

export const getSearchHot = () => http.get('/search/hot')

export const getSearchSuggest = (keywords) => http.get('/search/suggest', { params: { keywords } })

export const getSearch = (params) => http.get(`/search`, { params })