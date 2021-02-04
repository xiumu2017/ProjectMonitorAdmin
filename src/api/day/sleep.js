import request from '@/utils/request'

// 分页查询
export function getPage(params) {
  return request({
    url: '/daySleepRecord/s',
    method: 'get',
    params
  })
}

export function sleepStatistics(params) {
  return request({
    url: '/daySleepRecord/statistics',
    method: 'get',
    params
  })
}

// 新增睡眠记录
export function create(data) {
  return request({
    url: '/daySleepRecord',
    method: 'post',
    data
  })
}

// 修改睡眠记录
export function update(id, data) {
  return request({
    url: '/daySleepRecord/' + id,
    method: 'put',
    data
  })
}

// 删除睡眠记录
export function del(id) {
  return request({
    url: '/daySleepRecord/' + id,
    method: 'delete'
  })
}

// 睡眠记录详情
export function detail(id) {
  return request({
    url: '/daySleepRecord/' + id,
    method: 'get'
  })
}

export function getdaySleepRecordTypeList() {
  return request({
    url: '/daySleepRecord/types',
    method: 'get'
  })
}

export function excelExport() {
  return request({
    url: '/daySleepRecord/excel',
    method: 'get'
  })
}
