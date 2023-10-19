import axios from 'axios'
export const http = axios.create({
  baseURL: 'https://mu-api.yuk0.com/', // 线上
  // baseURL: 'http://127.0.0.1:3000/', // 本地地址
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
  (res) => {
    return Promise.reject(res.response ? res.response.data : res)
  }
)
