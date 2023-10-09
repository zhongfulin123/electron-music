import { http } from '@renderer/utils'

export const getAlbum = id => http.get(`/album?id=${id}`)