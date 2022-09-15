<template>
  <div class="app-container">
    <div class="head-container">
      <div>
        <el-form ref="searchForm" :inline="true" size="small">
          <el-input v-model="filters.username" clearable placeholder="用户名" style="width: 150px" class="filter-item" @keyup.enter.native="search" />
          <el-input v-model="filters.nickname" clearable placeholder="用户昵称" style="width: 150px" class="filter-item" @keyup.enter.native="search" />
          <el-select v-model="filters.enabled" clearable placeholder="角色状态" style="width: 120px" class="filter-item">
            <el-option label="启用" value="true" />
            <el-option label="禁用" value="false" />
          </el-select>
          <el-form-item>
            <el-button class="filter-item" size="small" type="success" icon="el-icon-search" @click="search">查询</el-button>
            <el-button class="filter-item" size="small" type="warning" icon="el-icon-refresh-left" @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button size="small" type="primary" @click="addUser()">
          新增
        </el-button>
      </div>
    </div>
    <div class="components-container">
      <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%">
        <el-table-column :show-overflow-tooltip="true" prop="username" label="头像" align="center">
          <template slot-scope="scope">
            <el-avatar v-if="scope.row['headImgUrl'] == null || scope.row['headImgUrl'] === ''" icon="el-icon-user-solid" />
            <el-avatar v-else :src="scope.row['headImgUrl']" />
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="username" label="用户名" align="center" />
        <el-table-column :show-overflow-tooltip="true" prop="nickname" label="用户昵称" align="center" />
        <el-table-column :show-overflow-tooltip="true" prop="email" label="邮箱" align="center" />
        <el-table-column :show-overflow-tooltip="true" prop="gender" label="性别" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.gender === 1">男</span>
            <span v-else-if="scope.row.gender === 2">女</span>
            <span v-else>隐藏</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="loginTime" label="登录时间" align="center" />
        <el-table-column :show-overflow-tooltip="true" prop="enabled" label="用户状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              :disabled="user.id === scope.row.id"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              @change="changeEnabled(scope.row, scope.row.enabled)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="info" size="mini" @click="showUserDetail(scope.row)">详情</el-button>
              <el-button type="success" size="mini" @click="editUser(scope.row)">编辑</el-button>
              <el-popconfirm title="操作不可撤销，确定删除吗？" @confirm="deleteUser(scope.row)">
                <el-button slot="reference" type="danger" size="mini">删除</el-button>
              </el-popconfirm>
            </el-button-group>
          </template>
        </el-table-column>
        <div slot="empty">
          <el-empty />
        </div>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        :total="total"
        :current-page="page"
        :page-size="pageSize"
        style="margin-top: 8px;"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"
      />
    </div>

    <!-- 新增 / 编辑 -->
    <addOrEditDialog
      ref="addOrEditDialogRef"
      :dialog-visible="addOrEditDialogVisible"
      :dialog-title="addOrEditDialogTitle"
      :user-info="userInfo"
      @addOrEditDone="addOrEditDone"
    />
    <!-- 查看详情 -->
    <showDetailDialog
      ref="showDetailDialogRef"
      :dialog-visible="showDetailDialogVisible"
      :data-id="dataId"
      @showDetailDone="showDetailDone"
    />
  </div>
</template>

<script>
import addOrEditDialog from '@/views/admin/system/user/template/addOrEditDialog'
import showDetailDialog from '@/views/admin/system/user/template/showDetailDialog'
import { mapGetters } from 'vuex'
export default {
  name: 'User',
  components: {
    addOrEditDialog,
    showDetailDialog
  },
  data() {
    return {
      filters: {
        username: '',
        nickname: '',
        enabled: ''
      },
      tableData: [],
      tableLoading: false,
      total: 0,
      page: 1,
      pageSize: 10,
      dataId: null,
      userInfo: null,
      addOrEditDialogTitle: '',
      addOrEditDialogVisible: false,
      showDetailDialogVisible: false,
      enabledStatus: {
        true: '启用',
        false: '禁用'
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  mounted() {
    this.listTableData()
  },
  methods: {
    search() {
      this.listTableData()
    },
    resetSearch() {
      this.filters.username = ''
      this.filters.nickname = ''
      this.filters.enabled = ''
      this.listTableData()
    },
    listTableData() {
      const param = {
        ... this.filters,
        page: this.page,
        pageSize: this.pageSize
      }
      this.tableLoading = true
      this.$mapi.user.pageList(param).then(res => {
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
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.enabledStatus[val] + '"' + data.username + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: data.id,
          enabled: val
        }
        this.$mapi.user.updateUserStatus(param).then(_ => {
          this.$message.success(this.enabledStatus[val] + '成功')
        }).catch(() => {
          data.enabled = !data.enabled
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    addUser() {
      this.userInfo = null
      this.addOrEditDialogVisible = true
      this.addOrEditDialogTitle = '新增用户'
      this.$refs.addOrEditDialogRef.initData()
    },
    editUser(row) {
      this.userInfo = row
      this.addOrEditDialogVisible = true
      this.addOrEditDialogTitle = '编辑用户'
      this.$refs.addOrEditDialogRef.initData()
    },
    addOrEditDone(result = false) {
      this.userInfo = null
      this.addOrEditDialogVisible = false
      this.addOrEditDialogTitle = ''
      if (result) {
        this.listTableData()
      }
    },
    showUserDetail(row) {
      this.dataId = row.id.toString()
      this.showDetailDialogVisible = true
      this.$refs.showDetailDialogRef.initData()
    },
    showDetailDone() {
      this.dataId = null
      this.showDetailDialogVisible = false
    },
    deleteUser(row) {
      this.$mapi.user.deleteUser({ userId: row.id }).then(res => {
        this.$message.success(res.message)
        this.listTableData()
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
