import request from '@/utils/request'

export function loanapplyQuery(data) {
  return request({
    url: '/loanapply/query',
    method: 'post',
    data
  })
}

export function loanapplyQueryDetail(serialNumber) {
  return request({
    url: `/loanapply/query/${serialNumber}`,
    method: 'get'
  })
}

export function loanapplyQueryFile(data) {
  return request({
    url: '/loanapply/query/loanFile',
    method: 'post',
    data
  })
}

export function loadImage(fileUrl) {
  return request({
    url: `/loanapply/loadImage/?fileUrl=${fileUrl}`,
    method: 'get'
  })
}

export function retryLoanApplys(data) {
  return request({
    url: '/exception/retryLoanApplys',
    method: 'post',
    data
  })
}

export function advanceQuery(data) {
  return request({
    url: '/advance/query',
    method: 'post',
    data
  })
}

export function loanrepayQuery(data) {
  return request({
    url: '/loanrepay/query',
    method: 'post',
    data
  })
}
