import request from '@/utils/request'

function create(data) {
  return request({
    url: 'roles',
    method: 'post',
    data
  })
}
function update(data) {
  return request({
    url: 'roles',
    method: 'put',
    data
  })
}
function query(params) {
  return request({
    url: 'roles',
    method: 'get',
    params
  })
}
function deleteById(id) {
  return request({
    url: `roles/${id}`,
    method: 'delete'
  })
}
export default {
  create, update, query, deleteById
}
