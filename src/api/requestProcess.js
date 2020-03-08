import request from '@/utils/request'

export function findRequestProcess(data) {
  return request({
    url: '/bg/requestProcess/findRequestProcessByPagination',
    method: 'post',
    data
  })
}

export function findDetailById(data) {
  return request({
    //url: '/bg/requestProcessLog/findByProcessId',
    url: '/bg/requestProcess/findDetailById',
    method: 'post',
    data
  })
}

export function retryRequestProcess(data) {
  return request({
    url: '/bg/requestProcess/retryRequestProcess',
    method: 'post',
    data
  })
}