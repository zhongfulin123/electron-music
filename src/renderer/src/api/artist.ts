import { http } from '@renderer/utils'

export const getArtists = id => http.get(`/artists?id=${id}`)
