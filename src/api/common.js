import request from '@/utils/request'

export function optionsQuery(key) {
  return request({
    url: `/common/query/${key}`,
    method: 'get'
  })
}
//查询所有进件渠道
export function findAllChannel(data) {
  return request({
    url: '/bg/channel/findAllChannel',
    method: 'get',
    data
  })
}
//查询所有产品号签接口
export function findAllProduct(data) {
  return request({
    url: '/bg/product/findAllProduct',
    method: 'get',
    data
  })
}
//查询所有资产标签
export function findAllLabel(data) {
  return request({
    //url: '/bg/label/findAllLabel',
    url: '/bg/caseLabel/findAllCaseLabel',
    method: 'get',
    data
  })
}

//查询所有资方
export function findAllPartner(data) {
  return request({
    url: '/bg/partner/findAllPartner',
    method: 'post',
    data
  })
}

//查询所有服务名
export function findAllService(data) {
  return request({
    url: '/bg/service/findAllService',
    method: 'get',
    data
  })
}

//查询所有文件类型
export function findAllFileType(data) {
  return request({
    url: '/bg/fileType/findAllFileType',
    method: 'get',
    data
  })
}
export function findUserName() {
  return request({
    url: '/bg/user/findUserName',
    method: 'get'
  })
}

export function exit() {
  return request({
    url: '/bg/sso/exit',
    method: 'get'
  })
}
      