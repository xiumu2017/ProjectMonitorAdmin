import request from '@/utils/request'

// 分页查询
export function getPage(params) {
  return request({
    url: '/finance/shopping-list/s',
    method: 'get',
    params
  })
}

// 新增记录
export function create(data) {
  return request({
    url: '/finance/shopping-list',
    method: 'post',
    data
  })
}

// 修改记录
export function update(id, data) {
  return request({
    url: '/finance/shopping-list/' + id,
    method: 'put',
    data
  })
}

// 删除记录
export function del(id) {
  return request({
    url: '/finance/shopping-list/' + id,
    method: 'delete'
  })
}

// 记录详情
export function detail(id) {
  return request({
    url: '/finance/shopping-list/' + id,
    method: 'get'
  })
}

// 获取类别列表
export function payTypes() {
  return request({
    url: '/finance/shopping-list/payTypes',
    method: 'get'
  })
}

// 获取类别列表
export function sources() {
  return request({
    url: '/finance/shopping-list/sources',
    method: 'get'
  })
}

// 导出excel
export function excelExport() {
  return request({
    url: '/finance/shopping-list/excel',
    method: 'get'
  })
}
