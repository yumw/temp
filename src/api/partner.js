import request from '@/utils/request'

export function findPartner(data) {
  return request({
    url: '/bg/partner/findPartnerByPagination',
    method: 'post',
    data
  })
}

export function addPartner(data) {
  return request({
    url: '/bg/partner/addPartner',
    method: 'post',
    data
  })
}

export function updatePartner(data) {
  return request({
    url: '/bg/partner/updatePartner',
    method: 'post',
    data
  })
}

export function updatePartnerIsUrgeRepay(data) {
  return request({
    url: '/bg/partner/updatePartnerIsUrgeRepay',
    method: 'post',
    data
  })
}

export function updatePartnerIsReportCredit(data) {
  return request({
    url: '/bg/partner/updatePartnerIsReportCredit',
    method: 'post',
    data
  })
}