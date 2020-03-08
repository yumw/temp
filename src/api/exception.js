import request from '@/utils/request'

export function findException(data) {
  return request({
    url: '/bg/exception/findExceptionByPagination',
    method: 'post',
    data
  })
}

export function findExceptionById(data) {
  return request({
    url: '/bg/exception/findExceptionById',
    method: 'post',
    data
  })
}

export function retryException(data) {
  return request({
    url: '/bg/exception/retryException',
    method: 'post',
    data
  })
}