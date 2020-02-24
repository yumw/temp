import request from '@/utils/request'

export function channelQuery(data) {
  return request({
    url: '/channel/query',
    method: 'post',
    data
  })
}
export function channelInsert(data) {
  return request({
    url: '/channel/insert',
    method: 'post',
    data
  })
}
export function channelUpdate(data) {
  return request({
    url: '/channel/update',
    method: 'post',
    data
  })
}
export function channelDelete(id) {
  return request({
    url: `/channel/delete/${id}`,
    method: 'get'
  })
}
export function getEncryptMethods() {
  return request({
    url: '/channel/getEncryptMethods',
    method: 'get'
  })
}
export function getChannelStatus() {
  return request({
    url: '/channel/getChannelStatus',
    method: 'get'
  })
}
export function getChannelInfo() {
  return request({
    url: '/channel/getChannelInfo',
    method: 'post'
  })
}
export function getChannelTypes() {
  return request({
    url: '/channel/getChannelTypes',
    method: 'get'
  })
}
export function merchantQuery(data) {
  return request({
    url: '/merchant/query',
    method: 'post',
    data
  })
}
export function merchantInsert(data) {
  return request({
    url: '/merchant/insert',
    method: 'post',
    data
  })
}
export function merchantUpdate(data) {
  return request({
    url: '/merchant/update',
    method: 'post',
    data
  })
}
export function merchantDelete(id) {
  return request({
    url: `/merchant/delete/${id}`,
    method: 'get'
  })
}
export function loanControlQry(data) {
  return request({
    url: '/loanControl/query',
    method: 'post',
    data
  })
}
export function loanControlInsert(data) {
  return request({
    url: '/loanControl/insert',
    method: 'post',
    data
  })
}
export function loanControlUpdate(data) {
  return request({
    url: '/loanControl/update',
    method: 'post',
    data
  })
}
export function loanControlDelete(id) {
  return request({
    url: `/loanControl/delete/${id}`,
    method: 'get'
  })
}
export function getStatusList() {
  return request({
    url: '/loanControl/getStatusList',
    method: 'get'
  })
}
export function getControlTypeList() {
  return request({
    url: '/loanControl/getControlTypeList',
    method: 'get'
  })
}
export function getMerchantCodes() {
  return request({
    url: '/merchant/getMerchantCodes',
    method: 'post'
  })
}
export function loanControlQryById(id) {
  return request({
    url: `/loanControl/query${id}`,
    method: 'get'
  })
}

export function getChannelMerchantCodes(data) {
  return request({
    url: '/merchant/getChannelMerchantCodes',
    method: 'post',
    data
  })
}

// 短信校验管理
export function messageControlQry(data) {
  return request({
    url: '/messageControl/query',
    method: 'post',
    data
  })
}

export function messageControlInsert(data) {
  return request({
    url: '/messageControl/insert',
    method: 'post',
    data
  })
}

export function messageControlQryDetail(id) {
  return request({
    url: `messageControl/query/${id}`,
    method: 'get'
  })
}

export function messageControlDelete(id) {
  return request({
    url: `messageControl/delete/${id}`,
    method: 'get'
  })
}

export function messageControlUpdate(data) {
  return request({
    url: '/messageControl/update',
    method: 'post',
    data
  })
}
