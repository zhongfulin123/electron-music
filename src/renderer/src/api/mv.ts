import { http } from '@renderer/utils'

export const getMvDetail = id => http.get(`/mv/detail?mvid=${id}`)

export const getMvUrl = id => http.get(`/mv/url?id=${id}`)

export const getSimiMv = id => http.get(`/simi/mv?mvid=${id}`)

export const getAllMvs = (params) => http.get(`/mv/all`, {params}) 