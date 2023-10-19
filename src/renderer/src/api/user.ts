import { http } from '@renderer/utils'
export const loginUser = (form): any => {
  return http.get(`/login/cellphone`, {
    params: form
  })
}
export const captchaSent = (phone): any => {
  return http.get(`/captcha/sent?phone=${phone}`)
}
export const logoutUser = (): any => {
  return http.get(`/logout`)
}
export const createKey = (): any => {
  return http.get('/login/qr/key')
}
export const createQr = (key): any => {
  return http.get(`/login/qr/create?key=${key}&qrimg=true`)
}
export const checkQr = (key): any => {
  return http.get(`/login/qr/check?key=${key}`)
}
export const loginStatus = (data): any => {
  return http.post(`/login/status?timestamp=${Date.now()}`, data)
}

export const getUserDetail = (uid): any => http.get('/user/detail', { params: { uid } })

export const getUserPlaylist = (uid): any =>
  http.get('/user/playlist', { params: { uid, limit: 1000 } })
