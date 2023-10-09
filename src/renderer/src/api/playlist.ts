import { http } from '@renderer/utils'

// 获取歌单
export const getPlaylists = (params):any => http.get('/top/playlist', { params })
// 精品歌单
export const getTopPlaylists = (params):any => http.get('/top/playlist/highquality', { params })
// 获取相似歌单
export const getSimiPlaylists = (id, option):any => http.get(`/simi/playlist?id=${id}`, option)