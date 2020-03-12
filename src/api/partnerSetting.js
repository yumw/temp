import request from '@/utils/request'

export function findAllPartnerSetting(data) {
  return request({
    url: '/bg/partnerSetting/findAllPartnerSetting',
    method: 'post',
    data
  })
}

export function addPartnerSetting(data) {
  return request({
    url: '/bg/partnerSetting/addPartnerSetting',
    method: 'post',
    data
  })
}

export function findPartnerSettingByCode(data) {
  return request({
    url: '/bg/partnerSetting/findPartnerSettingByCode',
    method: 'post',
    data
  })
}

export function deletePartnerSetting(data) {
  return request({
    url: '/bg/partnerSetting/deletePartnerSetting',
    method: 'post',
    data
  })
}