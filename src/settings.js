module.exports = {
  // 网站标题
  title: 'Z-BLOG',

  // 记住密码状态下的密码在Cookie中存储的天数
  passCookieExpires: 1,

  // 记住密码状态下的密码在Cookie中存储的username
  passCookieOfUname: 'ZBW001',

  // 记住密码状态下的密码在Cookie中存储的username
  passCookieOfPwd: 'ZBW002',

  // 记住密码状态下的密码在Cookie中存储的rememberMe
  passCookieOfRm: 'ZBW003',

  // token key
  tokenKey: 'usrToken',

  // refresh token key
  refTokenKey: 'usrRefToken',

  // 请求超时时间，毫秒（默认2分钟）
  timeout: 1200000,

  // 是否显示 tagsView
  tagsView: true,

  // 固定头部
  fixedHeader: true,

  // 是否显示logo
  sidebarLogo: true,

  // 是否显示设置的底部信息
  showFooter: true,

  // 底部文字，支持html语法
  footerTxt: '© 2022 Sun Tao <a href="https://mit-license.org" target="_blank">MIT License</a>',

  // 备案号
  caseNumber: '陕ICP备2021003044号-1'
}
