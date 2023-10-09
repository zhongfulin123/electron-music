import { http } from '@renderer/utils'

export const getListDetail = params =>
  http.get('/playlist/detail', { params })
