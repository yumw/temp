import request from '@/utils/request'

export function findRule(data) {
  return request({
    url: '/bg/rule/findRuleByPagination',
    method: 'post',
    data
  })
}

export function addRule(data) {
  return request({
    url: '/bg/rule/addRule',
    method: 'post',
    data
  })
}

export function updateRule(data) {
  return request({
    url: '/bg/rule/updateRule',
    method: 'post',
    data
  })
}