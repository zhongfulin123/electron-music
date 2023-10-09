import axios from 'axios'
export const http = axios.create({
  baseURL: 'https://mu-api.yuk0.com/', // 本地地址
  timeout: 10000
})

http.interceptors.request.use(
  (conifg) => {
    return conifg
  },
  (err) => {
    return Promise.reject(err)
  }
)

http.interceptors.response.use(
  (response) => {
    return response.data
  },
  (err) => {
    return Promise.reject(err)
  }
)

