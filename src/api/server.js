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
export function create(data) {
  return request({
    url: '/server',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

// 修改服务器信息
export function update(id, params) {
  return request({
    url: '/server/' + id,
    method: 'put',
    params
  })
}

// 删除服务器信息
export function del(id) {
  return request({
    url: '/server/' + id,
    method: 'delete'
  })
}

// 服务器信息详情
export function detail(id) {
  return request({
    url: '/server/' + id,
    method: 'get'
  })
}

export function connect(id) {
  return request({
    url: '/server/test-conect/' + id,
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
