<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-if="hasPerm(['queryRouterListByPage'])" v-perm="['queryRouterListByPage']" label="接口管理" name="apiList">
        <api-list ref="apiList" />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['pageBlackOrWhiteList'])" label="白名单管理" name="routerWhiteList">
        <black-or-white-list ref="routerWhiteList" dict-key="routerWhiteList" />
      </el-tab-pane>
      <el-tab-pane v-if="hasPerm(['pageBlackOrWhiteList'])" label="黑名单管理" name="routerBlackList">
        <black-or-white-list ref="routerBlackList" dict-key="routerBlackList" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ApiList from '@/views/admin/system/router/template/apiList'
import blackOrWhiteList from '@/views/admin/system/router/template/blackOrWhiteList'
export default {
  name: 'Router',
  components: {
    ApiList,
    blackOrWhiteList
  },
  data() {
    return {
      activeName: 'apiList'
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    handleClick(tab) {
      this.initData(tab.name)
    },
    initData(name) {
      name = name == null || name === '' ? this.activeName : name
      switch (name) {
        case 'apiList':
          this.$nextTick(() => {
            this.$refs['apiList'].initData()
          })
          break
        case 'routerWhiteList':
          this.$nextTick(() => {
            this.$refs['routerWhiteList'].initData()
          })
          break
        case 'routerBlackList':
          this.$nextTick(() => {
            this.$refs['routerBlackList'].initData()
          })
          break
        default:
          console.log('error tab name', name)
      }
    },
    hasPerm(value) {
      return this.checkPerm(value)
    }
  }
}
</script>

<style scoped>

</style>
