import { http } from '@renderer/utils'

export const getListDetail = (params):any =>
  http.get('/playlist/detail', { params })
