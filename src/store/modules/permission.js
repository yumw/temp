import { constantMenu } from '@/router'

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param permissionList
 */
function findId(permissionList, id) {
  for (var i = 0; i < permissionList.length; i++) {
    if (permissionList[i] === id) {
      return true
    }
  }
  return false
}

export function filterMenu(asyncRouterMap, permissionList) {
  for (var i = 0; i < asyncRouterMap.length; i++) {
    if (asyncRouterMap[i].children != null) {
      if (filterMenu(asyncRouterMap[i].children, permissionList)) {
        asyncRouterMap.splice(i--, 1)
      }
    } else {
      if (!findId(permissionList, asyncRouterMap[i].id)) {
        asyncRouterMap.splice(i--, 1)
      }
    }
  }
  return asyncRouterMap.length === 0
}

const permission = {
  state: {
    routers: [],
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      // state.addRouters = routers
      state.routers = constantMenu.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise((resolve) => {
        const { permissionList } = data
        // filterMenu(asyncRouterMap, permissionList)
        commit('SET_ROUTERS', permissionList)
        resolve()
      })
    }
  }
}

export default permission
