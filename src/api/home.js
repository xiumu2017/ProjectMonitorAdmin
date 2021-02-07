import request from '@/utils/request'

// 分页查询
export function getList(params) {
  return request({
    url: '/table/page',
    method: 'get',
    params
  })
}

// 查询今日的壁纸
export function todayImage() {
  return request({
    url: '/home/bing/image',
    method: 'get'
  })
}

// 分页查询
export function getPage(params) {
  return request({
    url: '/table/s',
    method: 'get',
    params
  })
}

// 新增记录
export function create(data) {
  return request({
    url: '/table',
    method: 'post',
    data
  })
}

// 修改记录
export function update(id, data) {
  return request({
    url: '/table/' + id,
    method: 'put',
    data
  })
}

// 删除记录
export function del(id) {
  return request({
    url: '/table/' + id,
    method: 'delete'
  })
}

// 记录详情
export function detail(id) {
  return request({
    url: '/table/' + id,
    method: 'get'
  })
}

// 获取类别列表
export function getTypeList() {
  return request({
    url: '/table/types',
    method: 'get'
  })
}

// 导出excel
export function excelExport() {
  return request({
    url: '/table/excel',
    method: 'get'
  })
}
