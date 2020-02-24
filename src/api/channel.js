import request from '@/utils/request'

export function addChannel(data) {
  return request({
    url: '/bg/channel/addChannel',
    method: 'post',
    data
  })
}

export function updateChannel(data) {
  return request({
    url: '/bg/channel/updateChannel',
    method: 'post',
    data
  })
}

export function deleteChannel(data) {
  return request({
    url: '/bg/channel/deleteChannel',
    method: 'post',
    data
  })
}