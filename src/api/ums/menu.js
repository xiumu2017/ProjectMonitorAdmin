import request from '@/utils/request'

// 分页查询
export function getPage(params) {
  return request({
    url: '/menu/s',
    method: 'get',
    params
  })
}

// 新增记录
export function create(data) {
  return request({
    url: '/menu',
    method: 'post',
    data
  })
}

// 修改记录
export function update(id, data) {
  return request({
    url: '/menu/' + id,
    method: 'put',
    data
  })
}

// 删除记录
export function del(id) {
  return request({
    url: '/menu/' + id,
    method: 'delete'
  })
}

// 记录详情
export function detail(id) {
  return request({
    url: '/menu/' + id,
    method: 'get'
  })
}

// 获取类别列表
export function getAllMenus() {
  return request({
    url: '/menu/all',
    method: 'get'
  })
}

