import axios from 'axios'
import { Notification, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

const cancelSource = axios.CancelToken.source()

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.cancelToken = cancelSource.token
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    return response
  },
  error => {
    if (axios.isCancel(error)) {
      return
    }
    console.log('err' + error) // for debug
    const { response } = error
    if (response) {
      switch (response.status) {
        case 401:
          cancelSource.cancel()
          Notification({
            title: '错误',
            message: response.data.message,
            type: 'error',
            duration: 3 * 1000
          })
          break
        default:
          Notification({
            title: '操作失败',
            message: response.data.message,
            type: 'error',
            duration: 3 * 1000
          })
      }
    } else {
      Notification({
        title: '操作失败',
        message: '服务器没有任何响应',
        type: 'error',
        duration: 3 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
