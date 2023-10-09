import { http } from '@renderer/utils'

// 歌曲评论
export const getSongComment = (params):any =>
  http.get(`/comment/music`, { params })
// 歌单评论
export const getPlaylistComment = (params):any  =>
  http.get(`/comment/playlist`, { params })
// 热门评论
export const getHotComment = (params):any  =>
  http.get(`/comment/hot`, { params })
// mv评论
export const getMvComment = (params):any  =>
  http.get('/comment/mv', { params })
