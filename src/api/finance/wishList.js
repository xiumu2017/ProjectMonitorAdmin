import request from '@/utils/request'

// 分页查询
export function getList(params) {
  return request({
    url: '/wishList/page',
    method: 'get',
    params
  })
}

// 分页查询
export function getPage(params) {
  return request({
    url: '/wishList/s',
    method: 'get',
    params
  })
}

// 新增记录
export function create(data) {
  return request({
    url: '/wishList',
    method: 'post',
    data
  })
}

// 修改记录
export function update(id, data) {
  return request({
    url: '/wishList/' + id,
    method: 'put',
    data
  })
}

// 删除记录
export function del(id) {
  return request({
    url: '/wishList/' + id,
    method: 'delete'
  })
}

// 记录详情
export function detail(id) {
  return request({
    url: '/wishList/' + id,
    method: 'get'
  })
}

// 获取类别列表
export function getTypeList() {
  return request({
    url: '/wishList/types',
    method: 'get'
  })
}

// 导出excel
export function excelExport() {
  return request({
    url: '/wishList/excel',
    method: 'get'
  })
}
