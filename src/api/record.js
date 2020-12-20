import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/record/list',
    method: 'get',
    params
  })
}
