import request from '@/utils/request'

// 分页查询
export function getPage(params) {
  return request({
    url: '/progress/s',
    method: 'get',
    params
  })
}

// 新增记录
export function create(data) {
  return request({
    url: '/progress',
    method: 'post',
    data
  })
}

// 修改记录
export function update(id, data) {
  return request({
    url: '/progress/' + id,
    method: 'put',
    data
  })
}

// 删除记录
export function del(id) {
  return request({
    url: '/progress/' + id,
    method: 'delete'
  })
}

// 记录详情
export function detail(id) {
  return request({
    url: '/progress/' + id,
    method: 'get'
  })
}
