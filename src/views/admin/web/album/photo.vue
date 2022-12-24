<template>
  <div class="card-container">
    <el-card class="main-card">
      <div class="card-title">{{ this.$route.meta.title || this.$route.name }}</div>
      <div class="album-info">
        <el-image fit="cover" class="album-cover" :src="albumData.albumCover" />
        <div class="album-detail">
          <div style="margin-bottom:0.6rem">
            <span class="album-name">{{ albumData.albumName }}</span>
            <span class="photo-count">{{ albumData.photoCount }}张</span>
          </div>
          <div>
            <span v-if="albumData.albumDesc" class="album-desc">
              {{ albumData.albumDesc }}
            </span>
            <el-button icon="el-icon-picture" type="primary" size="small" @click="uploadPhotoDialogVisible = true">
              上传照片
            </el-button>
          </div>
        </div>
        <div class="operation">
          <div class="all-check">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
              全选
            </el-checkbox>
            <div class="check-count">已选择{{ selectedItem.length }}张</div>
          </div>
          <el-button :disabled="selectedItem.length === 0" icon="el-icon-deleteItem" size="small" type="success" @click="movePhoto = true">
            移动到
          </el-button>
          <el-button :disabled="selectedItem.length === 0" icon="el-icon-deleteItem" size="small" type="danger" @click="batchDeletePhoto = true">
            批量删除
          </el-button>
        </div>
      </div>
      <el-row v-loading="tableLoading" class="photo-container" :gutter="10">
        <!-- 空状态 -->
        <el-empty v-if="tableData.length === 0" description="暂无照片" />
        <el-checkbox-group v-model="selectedItem" @change="handleCheckedPhotoChange">
          <el-col v-for="item of tableData" :key="item.id" :md="4">
            <el-checkbox :label="item.id">
              <div class="photo-item">
                <!-- 照片操作 -->
                <div class="photo-opreation">
                  <el-dropdown @command="handleCommand">
                    <i class="el-icon-more" style="color:#fff" />
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :command="item.id">
                        <i class="el-icon-edit" />编辑
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <el-image fit="cover" class="photo-img" :src="item['photoLink']" />
                <div class="photo-name">{{ item['photoName'] }}</div>
              </div>
            </el-checkbox>
          </el-col>
        </el-checkbox-group>
      </el-row>
      <el-pagination
        :hide-on-single-page="true"
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        class="photo-opreation"
        @size-change="sizeChange"
        @current-change="pageChange"
      />
    </el-card>

    <!-- 照片上传 -->
    <uploadPhotoDialog
      ref="uploadPhotoDialogRef"
      :dialog-visible="uploadPhotoDialogVisible"
      @uploadPhotoDone="uploadPhotoDone"
    />
  </div>
</template>

<script>
import uploadPhotoDialog from '@/views/admin/web/album/template/uploadPhotoDialog'
export default {
  name: 'AlbumPhoto',
  components: {
    uploadPhotoDialog
  },
  data() {
    return {
      albumId: '',
      albumData: {
        id: '',
        albumName: '',
        albumDesc: '',
        albumCover: '',
        photoCount: '',
        status: ''
      },
      checkAll: false,
      isIndeterminate: true,
      selectedItem: [],
      tableData: [],
      tableLoading: false,
      total: 0,
      page: 1,
      pageSize: 18,
      uploadPhotoDialogVisible: false
    }
  },
  created() {
    this.albumId = this.$route.query.albumId
    this.getAlbumInfo()
    this.listTableData()
  },
  methods: {
    getAlbumInfo() {
      this.$mapi.album.queryAlbumDetail({ albumId: this.albumId }).then(res => {
        const { data } = res
        Object.keys(this.albumData).forEach(key => {
          this.albumData[key] = data[key]
        })
      })
    },
    listTableData() {
      const param = {
        albumId: this.albumId,
        page: this.page,
        pageSize: this.pageSize
      }
      this.tableLoading = true
      this.$mapi.album.pagePhotoList(param).then(res => {
        const { data } = res
        this.tableData = data.list
        this.total = data.total
        console.log('this.tableData', this.tableData)
        console.log('this.total', this.total)
      }).catch(_ => {
        this.tableData = []
        this.total = 0
      }).finally(() => {
        this.tableLoading = false
      })
    },
    handleCheckAllChange(value) {
      this.selectedItem = value ? this.selectedItem : []
      this.isIndeterminate = false
    },
    handleCheckedPhotoChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.selectedItem.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.selectedItem.length
    },
    handleCommand(command) {

    },
    uploadPhotoDone(result) {
      this.uploadPhotoDialogVisible = false
      if (result) {
        this.listTableData()
      }
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
.album-info {
  display: flex;
  margin-top: 2.25rem;
  margin-bottom: 2rem;
}
.album-cover {
  border-radius: 4px;
  width: 5rem;
  height: 5rem;
}
.album-check-cover {
  border-radius: 4px;
  width: 4rem;
  height: 4rem;
}
.album-detail {
  padding-top: 0.4rem;
  margin-left: 0.8rem;
}
.album-desc {
  font-size: 14px;
  margin-right: 0.8rem;
}
.operation {
  padding-top: 1.5rem;
  margin-left: auto;
}
.all-check {
  display: inline-flex;
  align-items: center;
  margin-right: 1rem;
}
.check-count {
  margin-left: 1rem;
  font-size: 12px;
}
.album-name {
  font-size: 1.25rem;
}
.photo-count {
  font-size: 12px;
  margin-left: 0.5rem;
}
.photo-item {
  width: 100%;
  position: relative;
  cursor: pointer;
  margin-bottom: 1rem;
}
.photo-img {
  width: 100%;
  height: 7rem;
  border-radius: 4px;
}
.photo-name {
  font-size: 14px;
  margin-top: 0.3rem;
  text-align: center;
}
.photo-opreation {
  position: absolute;
  z-index: 1000;
  top: 0.3rem;
  right: 0.5rem;
}
.album-check {
  display: flex;
  align-items: center;
}
</style>
