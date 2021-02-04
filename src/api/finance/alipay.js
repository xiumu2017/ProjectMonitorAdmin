import request from '@/utils/request'

// 分页查询
export function getList(params) {
  return request({
    url: '/finance/alipay/record/page',
    method: 'get',
    params
  })
}

// 分页查询
export function getPage(params) {
  return request({
    url: '/finance/alipay/record/s',
    method: 'get',
    params
  })
}

// 新增记录
export function create(data) {
  return request({
    url: '/finance/alipay/record',
    method: 'post',
    data
  })
}

// 修改记录
export function update(id, data) {
  return request({
    url: '/finance/alipay/record/' + id,
    method: 'put',
    data
  })
}

// 删除记录
export function del(id) {
  return request({
    url: '/finance/alipay/record/' + id,
    method: 'delete'
  })
}

// 记录详情
export function detail(id) {
  return request({
    url: '/finance/alipay/record/' + id,
    method: 'get'
  })
}

// 获取类别列表
export function getTypeList() {
  return request({
    url: '/finance/alipay/record/types',
    method: 'get'
  })
}

// 导出excel
export function excelExport() {
  return request({
    url: '/finance/alipay/record/excel',
    method: 'get'
  })
}
