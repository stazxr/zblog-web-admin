<template>
  <div>
    <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%;">
      <el-table-column :show-overflow-tooltip="true" prop="roleName" label="角色名称" />
      <el-table-column :show-overflow-tooltip="true" prop="roleCode" label="角色编码" />
      <el-table-column :show-overflow-tooltip="true" prop="desc" label="角色描述" />
      <el-table-column prop="enabled" label="角色状态" align="center" width="75px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enabled" size="small">启用</el-tag>
          <el-tag v-else size="small" type="warning">禁用</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :total="total"
      :current-page="page"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
export default {
  name: 'PermRoleList',
  data() {
    return {
      permId: '',
      tableData: [],
      tableLoading: false,
      total: 0,
      page: 1,
      pageSize: 10
    }
  },
  methods: {
    initData(permId) {
      this.permId = permId
      this.$nextTick(() => {
        this.listTableData()
      })
    },
    listTableData() {
      const param = {
        permId: this.permId,
        page: this.page,
        pageSize: this.pageSize
      }
      this.tableLoading = true
      this.$mapi.perm.queryPermRoles(param).then(res => {
        const { data } = res
        this.tableData = data.list
        this.total = data.total
      }).catch(_ => {
        this.tableData = []
        this.total = 0
      }).finally(() => {
        this.tableLoading = false
      })
    },
    sizeChange(size) {
      this.page = 1
      this.pageSize = size
      this.listTableData()
    },
    pageChange(page) {
      this.page = page
      this.listTableData()
    }
  }
}
</script>

<style scoped>

</style>
