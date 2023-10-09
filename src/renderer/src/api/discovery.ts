import { http } from '@renderer/utils'

export const getBanner = ():any => http.get('/banner?type=0')

export const getNewSongs = ():any => http.get('/personalized/newsong')

export const getPersonalized = (params):any =>
  http.get(`/personalized`, { params })

export const getPersonalizedMv = ():any => http.get(`/personalized/mv`)