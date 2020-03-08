import request from '@/utils/request'

//获取相应枚举名称
export function getEnumByType(data) {
  return request({
    url: `/bg/configEnum/getEnumByType/${data}`,
    method: 'get'
  })
}
//获取所有枚举类型
export function getTypeInfo(data) {
  return request({
    url: '/bg/configEnum/getTypeInfo',
    method: 'get',
    data
  })
}
//新增枚举类型
export function insertType(data) {
  return request({
    url: '/bg/configEnum/insertType',
    method: 'post',
    data
  })
}
//更新枚举类型
export function updateType(data) {
  return request({
    url: '/bg/configEnum/updateType',
    method: 'post',
    data
  })
}
//删除枚举类型及相应枚举值
export function deleteType(data) {
  return request({
    url: `/bg/configEnum/deleteType/${data.id}`,
    method: 'get'
  })
}

//新增枚举
export function insertEnum(data) {
  return request({
    url: '/bg/configEnum/insertEnum',
    method: 'post',
    data
  })
}
//更新枚举
export function updateEnum(data) {
  return request({
    url: '/bg/configEnum/updateEnum',
    method: 'post',
    data
  })
}
//删除枚举
export function deleteEnum(data) {
  return request({
    url: `/bg/configEnum/delete/${data.id}`,
    method: 'get'
  })
}