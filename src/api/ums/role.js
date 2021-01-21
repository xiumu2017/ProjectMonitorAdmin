import request from '@/utils/request'

// 分页查询
export function getPage(params) {
  return request({
    url: '/role/s',
    method: 'get',
    params
  })
}

// 新增记录
export function create(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

// 修改记录
export function update(id, data) {
  return request({
    url: '/role/' + id,
    method: 'put',
    data
  })
}

// 删除记录
export function delBatch(params) {
  return request({
    url: '/role/',
    method: 'delete',
    params
  })
}

// 获取角色权限
export function getRolePermission(roleId) {
  return request({
    url: 'role/permission/' + roleId,
    method: 'get'
  })
}

// 获取角色菜单
export function getRoleMenu(roleId) {
  return request({
    url: 'role/menu/' + roleId,
    method: 'get'
  })
}

// 获取角色资源
export function getRoleResource(roleId) {
  return request({
    url: 'role/resource/' + roleId,
    method: 'get'
  })
}

// 修改角色权限
export function updateRolePermission(roleId, params) {
  return request({
    url: 'role/permission/' + roleId,
    method: 'put',
    params
  })
}
// 修改角色菜单
export function updateRoleMenu(roleId, params) {
  return request({
    url: 'role/menu/' + roleId,
    method: 'put',
    params
  })
}
// 修改角色资源
export function updateRoleResource(roleId, params) {
  return request({
    url: 'role/resource/' + roleId,
    method: 'put',
    params
  })
}

// 修改角色权限
export function updateStatus(roleId, params) {
  return request({
    url: 'role/status/' + roleId,
    method: 'put',
    params
  })
}

// 记录详情
export function detail(id) {
  return request({
    url: '/role/' + id,
    method: 'get'
  })
}

// 记录详情
export function allRoles() {
  return request({
    url: '/role/all',
    method: 'get'
  })
}

