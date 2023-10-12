import { http } from '@renderer/utils'

export const getArtists = (id): any => http.get(`/artists?id=${id}`)
