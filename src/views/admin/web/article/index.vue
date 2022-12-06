<template>
  <div class="app-container">
    <div class="head-container">
      <div>
        <el-input v-model="filters.title" clearable placeholder="文章标题" style="width: 200px" class="filter-item" @keyup.enter.native="search" />
        <span>
          <el-button class="filter-item" size="small" type="success" icon="el-icon-search" @click="search">查询</el-button>
          <el-button class="filter-item" size="small" type="warning" icon="el-icon-refresh-left" @click="resetSearch">重置</el-button>
        </span>
      </div>
      <div class="crud-opts">
        <span class="crud-opts-left">
          <el-button v-perm="['addArticle']" size="small" type="primary" @click="addArticle()">
            写文章
          </el-button>
        </span>
      </div>
    </div>

    <div class="components-container">
      <el-table ref="articleTable" v-loading="tableLoading" :data="tableData" border style="width: 100%">
        <el-table-column :show-overflow-tooltip="true" prop="title" label="文章标题" align="left" width="300" fixed="left" />
        <el-table-column :show-overflow-tooltip="true" prop="categoryName" label="文章分类" width="100" align="center" />
        <el-table-column :show-overflow-tooltip="true" prop="articleType" label="文章类型" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row['articleType'] === 1">原创</el-tag>
            <el-tag v-else-if="scope.row['articleType'] === 2">转载</el-tag>
            <el-tag v-else-if="scope.row['articleType'] === 3">翻译</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="tagList" label="文章标签" width="250" align="center">
          <template slot-scope="scope">
            <el-tag v-for="item of scope.row['tagList']" :key="item.id" style="margin-right:0.2rem;margin-top:0.2rem;">
              {{ item.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="viewCount" label="浏览量" width="80" align="center" />
        <el-table-column :show-overflow-tooltip="true" prop="likeCount" label="点赞量" width="80" align="center" />
        <el-table-column :show-overflow-tooltip="true" prop="tagList" label="评论状态" width="200" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row['commentFlag']">开启评论</el-tag>
            <el-tag v-else>关闭评论</el-tag>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="commentCount" label="评论数" width="80" align="center" />
        <el-table-column :show-overflow-tooltip="true" prop="articleStatus" label="发布范围" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row['articlePerm'] === 1">全部可见</el-tag>
            <el-tag v-else-if="scope.row['articlePerm'] === 2">登录可见</el-tag>
            <el-tag v-else-if="scope.row['articlePerm'] === 3">作者可见</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="articleStatus" label="文章状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row['articleStatus'] === 1">草稿</el-tag>
            <el-tag v-else-if="scope.row['articleStatus'] === 2">审核中</el-tag>
            <el-tag v-else-if="scope.row['articleStatus'] === 3">审核中</el-tag>
            <el-tag v-else-if="scope.row['articleStatus'] === 4">审核拒绝</el-tag>
            <el-tag v-else-if="scope.row['articleStatus'] === 5">已发布</el-tag>
            <el-tag v-else-if="scope.row['articleStatus'] === 6">临时下线</el-tag>
            <el-tag v-else-if="scope.row['articleStatus'] === 7">待整改</el-tag>
            <el-tag v-else-if="scope.row['articleStatus'] === 8">回收站</el-tag>
            <el-tag v-else-if="scope.row['articleStatus'] === 9">待发布</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="authorNickname" label="作者" width="100" align="center" />
        <el-table-column :show-overflow-tooltip="true" prop="createTime" label="最后修改时间" width="150" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row['updateTime'] !== ''">{{ scope.row['updateTime'] }}</span>
            <span v-else>{{ scope.row['createTime'] }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="hasPerm(['queryArticleDetail', 'editArticle', 'deleteArticle'])" label="操作" align="center" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button-group>
              <el-button v-perm="['queryArticleDetail']" type="info" size="mini" @click="showArticleDetail(scope.row)">查看</el-button>
              <el-button v-perm="['editArticle']" type="success" size="mini" @click="editArticle(scope.row)">编辑</el-button>
              <el-popconfirm v-perm="['deleteArticle']" title="操作不可撤销，确定删除吗？" @confirm="deleteArticle(scope.row)">
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
        style="margin-top: 8px;"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Article',
  data() {
    return {
      filters: {
        title: ''
      },
      tableData: [],
      tableLoading: false,
      total: 0,
      page: 1,
      pageSize: 10
    }
  },
  mounted() {
    this.listTableData()
  },
  methods: {
    hasPerm(value) {
      return this.checkPerm(value)
    },
    search() {
      this.page = 1
      this.listTableData()
    },
    resetSearch() {
      this.filters.title = ''

      this.page = 1
      this.listTableData()
    },
    listTableData() {
      const param = {
        ... this.filters,
        page: this.page,
        pageSize: this.pageSize
      }
      this.tableLoading = true
      this.$mapi.article.pageArticleList(param).then(res => {
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
    addArticle() {

    },
    editArticle(row) {

    },
    showArticleDetail(row) {

    },
    deleteArticle(row) {
      this.$mapi.article.deleteArticle({ articleId: row.id }).then(res => {
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
