import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/server/list',
    method: 'get',
    params
  })
}

export function getServerTypeList(params) {
  return request({
    url: '/server/serverTypeList',
    method: 'get',
    params
  })
}

export function getServerOsList(params) {
  return request({
    url: '/server/serverOsList',
    method: 'get',
    params
  })
}

