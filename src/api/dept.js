import request from '@/utils/request'

function create(data) {
  return request({
    url: 'depts',
    method: 'post',
    data
  })
}
function update(data) {
  return request({
    url: 'depts',
    method: 'put',
    data
  })
}
function query(params) {
  return request({
    url: 'depts?type=full',
    method: 'get',
    params
  })
}
function deleteById(id) {
  return request({
    url: `depts/${id}`,
    method: 'delete'
  })
}
export default {
  create, update, query, deleteById
}
