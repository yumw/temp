import request from '@/utils/request'

export function findCustomer(data) {
  return request({
    url: '/bg/customer/findCustomerByPagination',
    method: 'post',
    data
  })
}