import request from '@/utils/request'

export function findPackage(data) {
  return request({
    url: '/bg/package/findPackageByPagination',
    method: 'post',
    data
  })
}

export function addPackage(data) {
  return request({
    url: '/bg/package/addPackage',
    method: 'post',
    data
  })
}

export function updatePackage(data) {
  return request({
    url: '/bg/package/updatePackage',
    method: 'post',
    data
  })
}