import { http } from '@renderer/utils'

export const getBanner = () => http.get('/banner?type=0')

export const getNewSongs = () => http.get('/personalized/newsong')

export const getPersonalized = params =>
  http.get(`/personalized`, { params })

export const getPersonalizedMv = () => http.get(`/personalized/mv`)