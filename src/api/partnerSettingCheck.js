import request from '@/utils/request'

export function findPartnerSettingCheck(data) {
  return request({
    url: '/bg/partnerSettingCheck/findPartnerSettingCheckByPagination',
    method: 'post',
    data
  })
}

export function addPartnerSettingCheck(data) {
  return request({
    url: '/bg/partnerSettingCheck/addPartnerSettingCheck',
    method: 'post',
    data
  })
}

export function updatePartnerSettingCheck(data) {
  return request({
    url: '/bg/partnerSettingCheck/updatePartnerSettingCheck',
    method: 'post',
    data
  })
}