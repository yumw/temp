import request from '@/utils/request'

export function findRequestReceive(data) {
  return request({
    url: '/bg/requestReceive/findRequestReceiveByPagination',
    method: 'post',
    data
  })
}

export function getRequestReceiveDetail(data) {
  return request({
    url: '/bg/requestReceive/getRequestReceiveDetail',
    method: 'post',
    data
  })
}