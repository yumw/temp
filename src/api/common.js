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
      