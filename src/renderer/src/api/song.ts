import { http } from '@renderer/utils'

// 获取音乐url
export const getSongUrl = id => http.get(`/song/url?id=${id}`)

// 获取音乐详情
export const getSongDetail = ids => http.get(`/song/detail?ids=${ids}`)

// 新歌速递
export const getTopSongs = type => http.get(`/top/song?type=${type}`)

// 相似音乐
export const getSimiSongs = (id, option) =>
http.get(`/simi/song?id=${id}`, option)

// 歌词
export const getLyric = id => http.get(`/lyric?id=${id}`)
