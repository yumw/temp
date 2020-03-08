import request from '@/utils/request'

export function lists(data) {
  return request({
    url: '/bg/file/lists',
    method: 'post',
    data
  })
}
export function download(data) {
  return request({
    url: '/bg/file/download',
    method: 'post',
    data
  })
}

export function retry(data) {
  return request({
    url: `/bg/file/retry/${data.id}`,
    method: 'get'
  })
}