<template>
  <el-form :model="socialInfo" size="small" label-width="100px" label-position="left">
    <el-form-item label="QQ">
      <el-input v-model="socialInfo.qq" style="width:400px" placeholder="QQ" />
    </el-form-item>
    <el-form-item label="Github">
      <el-input v-model="socialInfo.github" style="width:400px" placeholder="Github" />
    </el-form-item>
    <el-form-item label="Gitee">
      <el-input v-model="socialInfo.gitee" style="width:400px" placeholder="Gitee" />
    </el-form-item>
    <el-button type="primary" size="medium" style="margin-left:6.3rem" @click="updateSocialInfo">
      修改
    </el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      socialInfo: {
        qq: '',
        github: '',
        gitee: ''
      }
    }
  },
  methods: {
    initData() {
      this.$nextTick(() => {
        this.querySocialInfo()
      })
    },
    querySocialInfo() {
      this.$mapi.webSetting.querySocialInfo().then(res => {
        const { data } = res
        Object.keys(this.socialInfo).forEach(key => {
          this.socialInfo[key] = data[key]
        })
      })
    },
    updateSocialInfo() {
      this.$mapi.webSetting.updateSocialInfo(this.socialInfo).then(res => {
        this.$message.success(res.message)
      })
    },
    hasPerm(value) {
      return this.checkPerm(value)
    }
  }
}
</script>

<style scoped>

</style>
