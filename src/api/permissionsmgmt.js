import request from '@/utils/request'

export function findRole(data) {
  return request({
    url: '/bg/role/findRoleByPagination',
    method: 'post',
    data
  })
}
// 根据角色id查询资源权限
export function query(id) {
  return request({
    url: `/roleResource/query/${id}`,
    method: 'get'
  })
}
// 角色资源信息更新
export function update(data) {
  return request({
    url: '/roleResource/update',
    method: 'post',
    data
  })
}

// 根据角色获取菜单和权限
export function getMenuPrivilegeList(data) {
  return request({
    url: '/bg/role/getMenuPrivilegeList',
    method: 'post',
    data
  })
}
// 保存角色的菜单和权限
export function saveMenuPrivilege(data) {
  return request({
    url: '/bg/role/saveMenuPrivilege',
    method: 'post',
    data
  })
}
// 手动同步角色
export function manualSycn() {
  return request({
    url: '/bg/role/manualSyncRole',
    method: 'get',
  })
}

