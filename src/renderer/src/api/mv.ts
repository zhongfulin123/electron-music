import { http } from '@renderer/utils'

export const getMvDetail = (id): any => http.get(`/mv/detail?mvid=${id}`)

export const getMvUrl = (id): any => http.get(`/mv/url?id=${id}`)

export const getSimiMv = (id): any => http.get(`/simi/mv?mvid=${id}`)

export const getAllMvs = (params): any => http.get(`/mv/all`, { params })
