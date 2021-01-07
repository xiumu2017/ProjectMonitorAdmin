import request from '@/utils/request'

// 分页查询
export function getPage(params) {
  return request({
    url: '/project/s',
    method: 'get',
    params
  })
}

// 新增记录
export function create(data) {
  return request({
    url: '/project',
    method: 'post',
    data
  })
}

// 修改记录
export function update(id, data) {
  return request({
    url: '/project/' + id,
    method: 'put',
    data
  })
}

// 删除记录
export function del(id) {
  return request({
    url: '/project/' + id,
    method: 'delete'
  })
}

// 记录详情
export function detail(id) {
  return request({
    url: '/project/' + id,
    method: 'get'
  })
}

// 获取类别列表
export function getTypeList() {
  return request({
    url: '/project/types',
    method: 'get'
  })
}

// 导出excel
export function excelExport() {
  return request({
    url: '/project/excel',
    method: 'get'
  })
}
