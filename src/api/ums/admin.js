import request from '@/utils/request'

// 分页查询
export function getPage(params) {
  return request({
    url: '/admin/list',
    method: 'get',
    params
  })
}

// 新增记录
export function create(data) {
  return request({
    url: '/admin',
    method: 'post',
    data
  })
}

// 修改记录
export function update(id, data) {
  return request({
    url: '/admin/' + id,
    method: 'put',
    data
  })
}

// 删除记录
export function del(id) {
  return request({
    url: '/admin/' + id,
    method: 'delete'
  })
}

// 记录详情
export function detail(id) {
  return request({
    url: '/admin/' + id,
    method: 'get'
  })
}

// 获取角色列表
export function getRoleList(id) {
  return request({
    url: '/admin/role/' + id,
    method: 'get'
  })
}
