import { http } from '@renderer/utils'

export const getSearchHot = ():any => http.get('/search/hot')

export const getSearchSuggest = (keywords):any => http.get('/search/suggest', { params: { keywords } })

export const getSearch = (params):any => http.get(`/search`, { params })