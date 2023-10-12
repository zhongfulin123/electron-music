import { http } from '@renderer/utils'

export const getAlbum = (id): any => http.get(`/album?id=${id}`)
