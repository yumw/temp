import request from '@/utils/request'

// 获取枚举值类型
export function getTypeInfo() {
  return request({
    url: '/config/getTypeInfo',
    method: 'get'
  })
}

// 新增枚举值类型
export function insertType(data) {
  return request({
    url: '/config/insertType',
    method: 'post',
    data
  })
}

// 修改枚举值类型
export function updateType(data) {
  return request({
    url: '/config/updateType',
    method: 'post',
    data
  })
}

// 删除枚举值类型
export function deleteType(id) {
  return request({
    url: `/config/deleteType/${id}`,
    method: 'get'
  })
}

// 获取枚举值列表
export function getEnumByType(id) {
  return request({
    url: `/config/getEnumByType/${id}`,
    method: 'get'
  })
}

// 新增枚举值类型
export function insertKeyValue(data) {
  return request({
    url: '/config/insert',
    method: 'post',
    data
  })
}

// 修改枚举值类型
export function updateKeyValue(data) {
  return request({
    url: '/config/update',
    method: 'post',
    data
  })
}

// 删除枚举值类型列表某一项
export function deleteKeyValue(id) {
  return request({
    url: `/config/delete/${id}`,
    method: 'get'
  })
}
