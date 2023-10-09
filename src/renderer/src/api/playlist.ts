import { http } from '@renderer/utils'

// 获取歌单
export const getPlaylists = (params) => http.get('/top/playlist', { params })
// 精品歌单
export const getTopPlaylists = (params) => http.get('/top/playlist/highquality', { params })
// 获取相似歌单
export const getSimiPlaylists = (id, option) => http.get(`/simi/playlist?id=${id}`, option)