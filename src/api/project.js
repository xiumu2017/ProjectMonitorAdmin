import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/project/list',
    method: 'get',
    params
  })
}

export function getMasTypeList() {
  return request({
    url: '/project/masTypeList',
    method: 'get'
  })
}

export function getProjectTypeList() {
  return request({
    url: '/project/projectTypeList',
    method: 'get'
  })
}

export function saveProject(params) {
  return request({
    url: '/project/saveProject',
    method: 'post',
    params
  })
}

export function saveServer(params) {
  return request({
    url: '/project/saveServer',
    method: 'post',
    params
  })
}

export function saveDb(params) {
  return request({
    url: '/project/saveDb',
    method: 'post',
    params
  })
}

export function changeEnable(params) {
  return request({
    url: '/project/changeEnable',
    method: 'post',
    params
  })
}

export function getServer(params) {
  return request({
    url: '/project/server',
    method: 'get',
    params
  })
}

export function getDb(params) {
  return request({
    url: '/project/db',
    method: 'get',
    params
  })
}

export function dbConnectTest(params) {
  return request({
    url: '/project/dbConnectTest',
    method: 'get',
    params
  })
}

export function serverConnectTest(params) {
  return request({
    url: '/project/serverConnectTest',
    method: 'get',
    params
  })
}

export function transitCheck(params) {
  return request({
    url: '/project/transitCheck',
    method: 'get',
    params
  })
}

export function webLoginCheck(params) {
  return request({
    url: '/project/webLoginCheck',
    method: 'get',
    params
  })
}

export function startCheck(params) {
  return request({
    url: '/project/startCheck',
    method: 'get',
    params
  })
}

export function deleteProject(params) {
  return request({
    url: '/project/delete',
    method: 'get',
    params
  })
}

export function pushToDing(params) {
  return request({
    url: '/project/pushToDing',
    method: 'get',
    params
  })
}

export function check(params) {
  return request({
    url: '/project/check',
    method: 'get',
    params
  })
}

export function excelExport(params) {
  return request({
    url: '/project/excelExport',
    method: 'get',
    responseType: 'blob',
    params
  })
}
