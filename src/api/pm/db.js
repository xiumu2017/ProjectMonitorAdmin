import request from '@/utils/request'

// 分页查询
export function getPage(params) {
  return request({
    url: '/db/s',
    method: 'get',
    params
  })
}

// 新增记录
export function create(data) {
  return request({
    url: '/db',
    method: 'post',
    data
  })
}

// 修改记录
export function update(id, data) {
  return request({
    url: '/db/' + id,
    method: 'put',
    data
  })
}

// 删除记录
export function del(id) {
  return request({
    url: '/db/' + id,
    method: 'delete'
  })
}

// 记录详情
export function detail(id) {
  return request({
    url: '/db/' + id,
    method: 'get'
  })
}

// 获取类别列表
export function getTypeList() {
  return request({
    url: '/db/types',
    method: 'get'
  })
}

// 导出excel
export function excelExport() {
  return request({
    url: '/db/excel',
    method: 'get'
  })
}
