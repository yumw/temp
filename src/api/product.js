import request from '@/utils/request'

export function addProduct(data) {
  return request({
    url: '/bg/product/addProduct',
    method: 'post',
    data
  })
}

export function updateProduct(data) {
  return request({
    url: '/bg/product/updateProduct',
    method: 'post',
    data
  })
}

export function deleteProduct(data) {
  return request({
    url: '/bg/product/deleteProduct',
    method: 'post',
    data
  })
}