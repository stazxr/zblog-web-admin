<template>
  <div>
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="handleClose" :visible.sync="dialogVisible" :title="dialogTitle" width="640px">
      <el-form ref="addForm" :inline="true" :model="addForm" :rules="addRules" size="small" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="addForm.name" style="width: 178px" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="上级分类" prop="pid">
          <el-select v-model="addForm.pid" placeholder="上级分类" clearable style="width: 178px">
            <el-option v-for="item in firstCategoryList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类状态" prop="enabled">
          <el-select v-model="addForm.enabled" placeholder="角色状态" style="width: 178px">
            <el-option v-for="item in enabledEnums" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类排序" prop="sort">
          <el-input-number v-model.number="addForm.sort" :min="0" :max="99999" step-strictly controls-position="right" style="width: 178px" />
        </el-form-item>
        <el-form-item label="分类略缩图">
          <img :src="addForm.imageUrl && addForm.imageUrl !== '' ? addForm.imageUrl : NoImg" title="点击上传" class="avatar" alt="" @click="toggleShow">
          <img-upload
            ref="imgUploadRef"
            v-model="showImgUpload"
            field="file"
            :headers="headers"
            :url="$store.state.api.fileUploadApi"
            :lang-ext="langExt"
            @crop-upload-success="cropUploadSuccess"
          />
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input v-model="addForm.desc" type="textarea" rows="4" maxlength="1000" show-word-limit style="width: 470px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="submit">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import NoImg from '@/assets/images/no-img.jpg'
import ImgUpload from 'vue-image-crop-upload'
import { getToken } from '@/utils/token'
export default {
  components: { ImgUpload },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      firstCategoryList: [],
      submitLoading: false,
      enabledEnums: [
        { name: '启用', value: true },
        { name: '禁用', value: false }
      ],
      addForm: {
        id: '',
        pid: '',
        name: '',
        imageUrl: '',
        desc: '',
        sort: 99999,
        enabled: true
      },
      addRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入分类排序', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '请选择分类状态', trigger: 'blur' }
        ]
      },
      NoImg: NoImg,
      showImgUpload: false,
      langExt: {
        success: '上传成功!',
        fail: '上传失败!'
      },
      headers: {
        Authorization: ''
      }
    }
  },
  methods: {
    initData(dataId) {
      this.addForm.id = dataId
      this.getFirstCategoryList()
      this.$nextTick(() => {
        this.getCategoryDetail()
      })
    },
    getFirstCategoryList() {
      this.firstCategoryList = []
      this.$mapi.category.queryFirstCategoryList().then(res => {
        this.firstCategoryList = res.data ? res.data : []
      })
    },
    getCategoryDetail() {
      if (this.addForm.id != null && this.addForm.id !== '') {
        this.$mapi.category.queryCategoryDetail({ categoryId: this.addForm.id }).then(res => {
          const { data } = res
          Object.keys(this.addForm).forEach(key => {
            this.addForm[key] = data[key]
          })
        }).catch(_ => {
          this.doClose()
        })
      }
    },
    toggleShow() {
      this.headers.Authorization = getToken()

      this.$refs.imgUploadRef.step = 1
      this.showImgUpload = !this.showImgUpload
    },
    cropUploadSuccess(jsonData) {
      const { code, data, message } = jsonData
      if (code === 200) {
        // success
        this.addForm.imageUrl = data[0]['downloadUrl']
        this.$refs.imgUploadRef.off()
      } else {
        // error
        this.$refs.imgUploadRef.loading = 3
        this.$refs.imgUploadRef.hasError = true
        this.$refs.imgUploadRef.errorMsg = message
      }
    },
    doClose(result = false) {
      this.addForm = {
        id: '',
        pid: '',
        name: '',
        imageUrl: '',
        desc: '',
        sort: 99999,
        enabled: true
      }
      this.$refs['addForm'].resetFields()
      this.showImgUpload = false
      this.submitLoading = false
      this.$emit('addOrEditDone', result)
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
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          if (this.addForm.id == null || this.addForm.id === '') {
            // add
            this.$mapi.category.addCategory(this.addForm).then(res => {
              this.$message.success(res.message)
              this.doClose(true)
            }).finally(_ => {
              this.submitLoading = false
            })
          } else {
            // edit
            this.$mapi.category.editCategory(this.addForm).then(res => {
              this.$message.success(res.message)
              this.doClose(true)
            }).finally(_ => {
              this.submitLoading = false
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.avatar {
  width: 120px;
  height: 120px;
  // border-radius: 50%;
}
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
