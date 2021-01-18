import request from '@/utils/request'

// 分页查询
export function getPage() {
  return request({
    url: '/minio/oss/list',
    method: 'get'
  })
}

// 新增记录
export function create(data) {
  return request({
    url: '/minio/oss/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

// 删除记录
export function del(key) {
  return request({
    url: '/minio/oss/' + key,
    method: 'delete'
  })
}

