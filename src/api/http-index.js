// communal
import communal from '@/api/communal.js'
import home from '@/api/home.js'

// base
import perm from '@/api/base/perm.js'
import user from '@/api/base/user.js'
import log from '@/api/base/log.js'
import router from '@/api/base/router.js'
import role from '@/api/base/role.js'
import dict from '@/api/base/dict.js'
import server from '@/api/base/server.js'
import version from '@/api/base/version.js'
import file from '@/api/base/file.js'
import node from '@/api/base/node.js'

// service
import category from '@/api/service/category.js'
import tag from '@/api/service/tag.js'
import article from '@/api/service/article.js'
import webSetting from '@/api/service/webSetting.js'
import friendLink from '@/api/service/friendLink.js'
import talk from '@/api/service/talk.js'
import page from '@/api/service/page.js'

export default {
  communal, home, perm, user, log, router, role, dict, server, version, file, node,
  category, tag, article, webSetting, friendLink, talk, page
}
