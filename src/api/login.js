import request from '@/utils/request'

export function login(userName, password) {
  return request({
    url: '/security/login',
    method: 'post',
    data: {
      userName,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: 'http://172.16.9.27:3000/mock/100/user/getInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: 'http://172.16.9.27:3000/mock/100/user/logout',
    method: 'post'
  })
}

export function firstData() {
  return request({
    url: '/first/data',
    method: 'post'
  })
}

export function getUserResourceInfo(){
  return request({
    url: '/roleResource/getUserResourceInfo',
    method: 'post'
  })
}

export function getMenu(){
  return request({
    url: '/bg/menu/getMenu',
    method: 'get'
  })
}