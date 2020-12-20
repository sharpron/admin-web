import request from '@/utils/request'

export function getDict(url) {
  return request({
    url: url,
    method: 'get'
  })
}
