import request from '@/utils/request'

export function downloadQuery(data) {
  return request({
    url: '/file/query',
    method: 'post',
    data
  })
}
export function downloadResultQuery(data) {
  return request({
    url: '/sendFile/query',
    method: 'post',
    data
  })
}
export function sendFileRetry(id) {
  return request({
    url: `/sendFile/retry/${id}`,
    method: 'get'
  })
}
export function sendFileRetryPull(data) {
  return request({
    url: '/sendFile/retryPull',
    method: 'post',
    data
  })
}
export function fileRetry(data) {
  return request({
    url: '/file/retry',
    method: 'post',
    data
  })
}
