<template>
  <div>
    <el-drawer :title="dialogTitle" :visible.sync="dialogVisible" destroy-on-close :before-close="handleClose" size="40%" @opened="initData" @closed="doClose">
      <div class="demo-drawer__content">
        <el-tree
          ref="permTree"
          :data="permissions"
          show-checkbox
          node-key="id"
          default-expand-all
          :props="defaultProps"
        />
        <div class="demo-drawer__footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="submit">{{ submitLoading ? '提交中 ...' : '确 认' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: ''
    },
    dataId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      submitLoading: false,
      permissions: [],
      defaultProps: {
        children: 'children',
        label: 'permName'
      }
    }
  },
  methods: {
    initData() {
      this.getPermission()
    },
    getPermission() {
      this.$mapi.perm.queryPermTree().then(res => {
        this.permissions = res.data
        this.$nextTick(() => {
          this.queryRolePerm()
        })
      }).catch(_ => {
        this.permissions = []
      })
    },
    queryRolePerm() {
      this.$mapi.role.queryPermIdsByRoleId({ roleId: this.dataId }).then(res => {
        const nodes = []
        res.data.forEach(item => {
          const node = this.$refs.permTree.getNode(item)
          if (node != null && node.isLeaf) {
            nodes.push(item)
          }
        })
        this.$refs.permTree.setCheckedKeys(nodes, true)
      }).catch(e => {
        console.log('set checked keys catch eor', e)
        this.doClose()
      })
    },
    doClose() {
      this.permissions = []
      this.checkedKeys = []
      this.submitLoading = false
      this.$emit('authRoleDone')
    },
    handleClose() {
      if (!this.submitLoading) {
        this.$confirm('确认关闭？').then(_ => {
          this.doClose()
        }).catch(_ => {})
      }
    },
    cancel() {
      this.handleClose()
    },
    submit() {
      this.$confirm('确定要提交表单吗？').then(_ => {
        const param = {
          roleId: this.dataId,
          permIds: this.$refs.permTree.getCheckedKeys().concat(this.$refs.permTree.getHalfCheckedKeys())
        }
        this.submitLoading = true
        this.$mapi.role.authRole(param).then(res => {
          this.$message.success(res.message)
          this.doClose()
        }).finally(_ => {
          this.submitLoading = false
        })
      })
    }
  }
}
</script>

<style scoped>
.demo-drawer__content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.demo-drawer__footer {
  margin-top: 10px;
  display: flex;
}
.demo-drawer__footer button {
  flex: 1;
  margin: 5px 20px;
}
</style>
