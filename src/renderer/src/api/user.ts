import { http } from '@renderer/utils'
export const loginUser = (form):any=>{
    return http.get(`/login/cellphone?phone=${form.phone}&password=${form.password}`)
 }
 export const logoutUser = ():any=>{
    return http.get(`/logout`)
 }
export const getUserDetail = (uid):any => http.get("/user/detail", { params: { uid } })

const PLAYLIST_LIMIT = 1000
export const getUserPlaylist = (uid):any => http.get("/user/playlist", { params: { uid, limit: PLAYLIST_LIMIT } })