<template>
  <div>
    <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%;">
      <el-table-column :show-overflow-tooltip="true" prop="uri" label="请求地址" />
      <el-table-column :show-overflow-tooltip="true" prop="method" label="请求方式" />
      <el-table-column :show-overflow-tooltip="true" prop="type" label="接口状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row['type'] === 1" size="small">正常</el-tag>
          <el-tag v-else-if="scope.row['type'] === 2" size="small" type="danger">禁止访问</el-tag>
          <span v-else> - </span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="right">
        <template slot="header">
          <div style="display:inline-block;float: right;cursor: pointer;white-space: nowrap" @click="listTableData">
            刷新时间<i class="el-icon-refresh" style="margin-left: 40px" />
          </div>
        </template>
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row['createTime'] }}</span>
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
  name: 'PermInterfaceList',
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
      this.$mapi.interfaces.queryPermInterface(param).then(res => {
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
