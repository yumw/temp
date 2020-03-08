import request from '@/utils/request'

export function findAdvance(data) {
  return request({
    url: '/bg/advance/findAdvanceByPagination',
    method: 'post',
    data
  })
}