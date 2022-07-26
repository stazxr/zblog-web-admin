import { constantRouterMap } from '@/router/routers'

const state = {
  routers: constantRouterMap,
  addRouters: [],
  sidebarRouters: []
}

const mutations = {
  SET_ROUTERS: (state, routers) => {
    state.addRouters = routers
    state.routers = constantRouterMap.concat(routers)
  },
  SET_SIDEBAR_ROUTERS: (state, routers) => {
    state.sidebarRouters = constantRouterMap.concat(routers)
  }
}

const actions = {
  GenerateRoutes({ commit }, asyncRouter) {
    commit('SET_ROUTERS', asyncRouter)
  },
  SetSidebarRouters({ commit }, sidebarRouter) {
    commit('SET_SIDEBAR_ROUTERS', sidebarRouter)
  }
}

const getters = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
