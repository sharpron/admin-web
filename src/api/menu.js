import request from '@/utils/request'

function create(data) {
  return request({
    url: 'menus',
    method: 'post',
    data
  })
}
function update(data) {
  return request({
    url: 'menus',
    method: 'put',
    data
  })
}
function query(params) {
  return request({
    url: 'menus',
    method: 'get',
    params
  })
}
function deleteById(id) {
  return request({
    url: `menus/${id}`,
    method: 'delete'
  })
}
export default {
  create, update, query, deleteById
}
