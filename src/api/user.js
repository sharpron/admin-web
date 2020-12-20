import request from '@/utils/request'

function create(data) {
  return request({
    url: 'users',
    method: 'post',
    data
  })
}
function update(data) {
  return request({
    url: 'users',
    method: 'put',
    data
  })
}
function query(params) {
  return request({
    url: 'users',
    method: 'get',
    params
  })
}
function deleteById(id) {
  return request({
    url: `users/${id}`,
    method: 'delete'
  })
}
export default {
  create, update, query, deleteById
}
