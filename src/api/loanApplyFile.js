import request from '@/utils/request'

export function findLoanApplyFile(data) {
  return request({
    url: '/bg/loanApplyFile/findLoanApplyFileByPagination',
    method: 'post',
    data
  })
}

export function downloadLoanApplyFile(data) {
  return request({
    url: '/bg/loanApplyFile/downloadLoanApplyFile',
    method: 'post',
    data
  })
}

export function previewLoanApplyFile(data) {
  return request({
    url: '/bg/loanApplyFile/previewLoanApplyFile',
    method: 'post',
    data
  })
}
