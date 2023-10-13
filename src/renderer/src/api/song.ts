import { http } from '@renderer/utils'

// 获取音乐url
export const getSongUrl = (id):any => http.get(`/song/url?id=${id}`)

// 音乐是否可用
export const checkMusic = (id):any => http.get(`/check/music?id=${id}`)

// 获取音乐详情
export const getSongDetail = (ids):any => http.get(`/song/detail?ids=${ids}`)

// 新歌速递
export const getTopSongs = (type):any => http.get(`/top/song?type=${type}`)

// 相似音乐
export const getSimiSongs = (id, option):any =>
http.get(`/simi/song?id=${id}`, option)

// 歌词
export const getLyric = (id):any => http.get(`/lyric?id=${id}`)
