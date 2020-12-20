import request from '@/utils/request'

const CACHE_KEY = 'cache-key'

export function login(data) {
  return request({
    url: '/authenticate',
    method: 'post',
    headers: {
      [CACHE_KEY]: data.cacheKey
    },
    data: {
      username: data.username,
      password: data.password,
      rememberMe: data.rememberMe,
      captcha: data.captcha
    }
  })
}

export function getCaptcha() {
  return request({
    url: '/captchas',
    method: 'get',
    responseType: 'arraybuffer'
  }).then(res => {
    console.log(res)
    return {
      img: 'data:image/png;base64,' + btoa(
        new Uint8Array(res.data).reduce((data, byte) =>
          data + String.fromCharCode(byte), '')),
      cacheKey: res.headers[CACHE_KEY]
    }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
