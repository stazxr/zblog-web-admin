const getters = {
  // user
  token: state => state.user.token,
  refToken: state => state.user.refToken,
  roles: state => state.user.roles,
  user: state => state.user.user,
  loadMenus: state => state.user.loadMenus,
  // permission
  permissionRouters: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  sidebarRouters: state => state.permission.sidebarRouters,
  // app
  size: state => state.app.size,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // tagsView
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews
}
export default getters
