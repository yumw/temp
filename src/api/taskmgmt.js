import request from '@/utils/request'

export function requestMgmtQry(data) {
  return request({
    url: '/request/query',
    method: 'post',
    data
  })
}
export function requestMgmtQryDetail(data) {
  return request({
    url: '/request/query/detail',
    method: 'post',
    data
  })
}
export function replyMgmtQry(data) {
  return request({
    url: '/reply/query',
    method: 'post',
    data
  })
}
export function replyMgmtQryDetail(data) {
  return request({
    url: '/reply/query/detail',
    method: 'post',
    data
  })
}
export function exceptionMgmtQry(data) {
  return request({
    url: '/exception/query',
    method: 'post',
    data
  })
}
export function exceptionProcessStates() {
  return request({
    url: '/exception/processStateEnum',
    method: 'post'
  })
}
export function retryExceptions(data) {
  return request({
    url: '/exception/retryExceptions',
    method: 'post',
    data
  })
}
export function requestRetry(data) {
  return request({
    url: '/request/retry',
    method: 'post',
    data
  })
}
export function replyRetry(data) {
  return request({
    url: '/reply/retry',
    method: 'post',
    data
  })
}

