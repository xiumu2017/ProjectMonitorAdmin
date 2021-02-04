import request from '@/utils/request'

// 分页查询
export function getPage(params) {
  return request({
    url: '/dayMealRecord/s',
    method: 'get',
    params
  })
}

// 新增
export function create(data) {
  return request({
    url: '/dayMealRecord',
    method: 'post',
    data
  })
}

// 修改
export function update(id, data) {
  return request({
    url: '/dayMealRecord/' + id,
    method: 'put',
    data
  })
}

// 删除
export function del(id) {
  return request({
    url: '/dayMealRecord/' + id,
    method: 'delete'
  })
}

// 详情
export function detail(id) {
  return request({
    url: '/dayMealRecord/' + id,
    method: 'get'
  })
}

// excel 导出
export function excelExport() {
  return request({
    url: '/dayMealRecord/excel',
    method: 'get'
  })
}

export function types() {
  return request({
    url: '/dayMealRecord/types',
    method: 'get'
  })
}

export function payTypes() {
  return request({
    url: '/dayMealRecord/payTypes',
    method: 'get'
  })
}

export function statistics(params) {
  return request({
    url: '/dayMealRecord/statistics',
    method: 'get',
    params
  })
}
