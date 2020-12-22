import request from '@/utils/request'

// 分页查询
export function getPage(params) {
  return request({
    url: '/server/page',
    method: 'get',
    params
  })
}

// 新增服务器信息
export function create(params) {
  return request({
    url: '/serve',
    method: 'post',
    params
  })
}

// 修改服务器信息
export function update(id, params) {
  return request({
    url: '/serve/' + id,
    method: 'put',
    params
  })
}

// 删除服务器信息
export function del(id) {
  return request({
    url: '/serve/' + id,
    method: 'delete'
  })
}

export function connect(id) {
  return request({
    url: '/serve/test-conect/' + id,
    method: 'get'
  })
}

export function getServerTypeList() {
  return request({
    url: '/server/types',
    method: 'get'
  })
}

export function excelExport() {
  return request({
    url: '/server/excel',
    method: 'get'
  })
}
