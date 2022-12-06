<template>
  <div class="editor-container">
    <div class="editor-toolbar">
      <Toolbar
        :editor="editor"
        :default-config="toolbarConfig"
        :mode="mode"
      />
    </div>
    <div class="editor-content">
      <div class="editor-content-inner editor-content-core">
        <div class="editor-title">
          <input v-model="addForm.title" placeholder="请输入文章标题（最多 100 个字）" maxlength="100">
        </div>
        <div class="editor-text-area">
          <Editor
            v-model="html"
            :default-config="editorConfig"
            :mode="mode"
            @onCreated="onCreated"
            @onChange="onChange"
            @onDestroyed="onDestroyed"
            @onMaxLength="onMaxLength"
            @onFocus="onFocus"
            @onBlur="onBlur"
            @customAlert="customAlert"
          />
        </div>
      </div>
      <div class="editor-content-inner editor-content-config">
        <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="100px">
          <el-form-item label="文章封面：" prop="coverImageType">
            <el-radio-group v-model="addForm.coverImageType">
              <el-radio v-for="item in coverImageTypeEnums" :key="item.value" :label="item.value">{{ item.name }}</el-radio>
            </el-radio-group>
            <div v-if="addForm.coverImageType === 1" class="cover-img-box-flex cover-img-box-1">
              <!-- 单封面 -->
              <div v-if="addForm.articleImg.length < maxUploadSize" class="cover-img-box" @click="uploadCoverImg">
                <div class="cover-img">
                  <div class="cover_img_hover">
                    <img :src="addIcon" alt="" class="cover-img-add-icon">
                  </div>
                </div>
              </div>
              <div v-else class="cover-img-box">
                <div class="cover-img">
                  <div class="cover_img_over" @mouseenter="showCoverImgIcon(0)" @mouseleave="hideCoverImgIcon(0)">
                    <img :src="addForm.articleImg[0]['downloadUrl']" alt="" class="cover-img-img-icon">
                    <span class="cover-img-close-icon" @click="removeCoverImg(addForm.articleImg[0], 0)">X</span>
                    <span class="cover-img-replace-icon" @click="replaceCoverImg(addForm.articleImg[0], 0)">替换</span>
                  </div>
                </div>
              </div>
            </div>
            <span v-if="addForm.coverImageType === 1" style="display: block;">
              <strong>*支持 jpg、jpeg、png 格式，单张图片最大支持 5MB，建议图片尺寸 16:9</strong>
            </span>
            <div v-if="addForm.coverImageType === 2" class="cover-img-box-flex cover-img-box-more">
              <!-- 多封面 -->
              <div v-if="addForm.articleImg.length < maxUploadSize" class="cover-img-box" @click="uploadCoverImg">
                <div class="cover-img">
                  <div class="cover_img_hover">
                    <img :src="addIcon" alt="" class="cover-img-add-icon">
                  </div>
                </div>
              </div>
              <div v-for="(articleImg, index) in addForm.articleImg" :key="articleImg.id" class="cover-img-box">
                <div class="cover-img">
                  <div class="cover_img_over" @mouseenter="showCoverImgIcon(index)" @mouseleave="hideCoverImgIcon(index)">
                    <img :src="articleImg['downloadUrl']" alt="" class="cover-img-img-icon">
                    <span class="cover-img-close-icon" @click="removeCoverImg(articleImg, index)">X</span>
                    <span class="cover-img-replace-icon" @click="replaceCoverImg(articleImg, index)">替换</span>
                  </div>
                </div>
              </div>
            </div>
            <span v-if="addForm.coverImageType === 2" style="display: block;">
              <strong>*支持 jpg、jpeg、png 格式，单张图片最大支持 5MB，建议图片尺寸 16:9，最多支持 4 张图片</strong>
            </span>
            <img v-if="addForm.coverImageType === 3" :src="noImg" alt="" style="display: block;width: 160px; height: 90px;margin-top: 5px;">
            <span v-if="addForm.coverImageType === 4" style="display: block;margin-top: 5px;">
              <strong>*后台会根据文章标题自动生成文章封面</strong>
            </span>
          </el-form-item>
          <el-form-item label="文章摘要：" prop="remark">
            <el-input v-model="addForm.remark" type="textarea" resize="none" :autosize="{ minRows: 4, maxRows: 4 }" maxlength="250" show-word-limit />
          </el-form-item>
          <el-form-item label="文章类型：" prop="articleType">
            <el-radio-group v-model="addForm.articleType">
              <el-radio v-for="item in articleTypeEnums" :key="item.value" :label="item.value">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="addForm.articleType !== 1" label="原文链接：" prop="reprintLink">
            <el-input v-model="addForm.reprintLink" placeholder="请填写原文链接" maxlength="1000" show-word-limit />
          </el-form-item>
          <el-form-item label="文章分类：" prop="categoryId">
            <el-select v-model="addForm.categoryId" placeholder="请选择文章分类" clearable filterable style="width: 300px">
              <el-option-group v-for="group in articleCategoryOptions" :key="group.id" :label="group.name">
                <el-option v-for="item in group.children" :key="item.id" :value="item.id" :label="item.name" :disabled="!group.enabled || !item.enabled" />
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="文章标签：" prop="articleTag">
            <el-select
              v-model="addForm.articleTag"
              placeholder="请选择文章标签"
              multiple
              :multiple-limit="3"
              filterable
              :remote-method="customTagSearchWithoutCase"
              :loading="tagSearchLoading"
              allow-create
              default-first-option
              clearable
              style="width: 300px"
            >
              <el-option v-for="item in articleTagOptions" :key="item.id" :value="item.id" :label="item.name" />
            </el-select>
            <span style="margin-left: 5px;color: gray;">输入文字可搜索，按回车可添加自定义标签</span>
          </el-form-item>
          <el-form-item label="发布范围：" prop="articlePerm">
            <el-radio-group v-model="addForm.articlePerm">
              <el-radio v-for="item in articlePermEnums" :key="item.value" :label="item.value">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="评论设置：" prop="commentFlag">
            <el-radio-group v-model="addForm.commentFlag">
              <el-radio v-for="item in commentEnums" :key="item.value" :label="item.value">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="editor-content-config-opt">
          <div class="editor-content-config-opt-left">
            <span>共 {{ totalCount }} 字</span>
          </div>
          <div class="editor-content-config-opt-right">
            <el-button round>保存草稿</el-button>
            <el-button round>定时发布</el-button>
            <el-button type="danger" round :loading="submitLoading" @click="publishArticle">发布文章</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片上传 -->
    <uploadImgDialog
      ref="uploadImgDialogRef"
      :dialog-visible="uploadImgDialogVisible"
      :max-upload-size="maxUploadSize"
      @uploadImgDone="uploadImgDone"
    />
  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { Message } from 'element-ui'
import { getToken } from '@/utils/token'
import uploadImgDialog from '@/views/admin/web/article/template/uploadImgDialog'
import NoImg from '@/assets/images/no-img-4_3.jpg'
import AddIcon from '@/assets/images/add-icon.png'
export default {
  name: 'AddArticle',
  components: {
    uploadImgDialog, Editor, Toolbar
  },
  data() {
    return {
      editor: null,
      html: '<p><br></p>',
      toolbarConfig: {
        modalAppendToBody: false,
        // 获取 wangeditor 默认配置
        // import { DomEditor } from '@wangeditor/editor'
        // const toolbar = DomEditor.getToolbar(this.editor)
        // const defaultConfig = toolbar.getConfig().toolbarKeys
        // console.log('defaultConfig', defaultConfig)
        toolbarKeys: [
          'undo', 'redo', '|',
          'clearStyle', '|',
          'headerSelect', 'bold', 'color', 'bgColor',
          {
            'key': 'group-more-style',
            'title': '其他',
            'iconSvg': '<svg viewBox=\"0 0 1024 1024\"><path d=\"M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path><path d=\"M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path><path d=\"M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path></svg>',
            'menuKeys': [
              'italic', 'underline', 'through'
            ]
          }, 'fontSize', 'fontFamily', 'lineHeight', '|',
          'bulletedList', 'numberedList', 'todo',
          {
            'key': 'group-justify',
            'title': '对齐',
            'iconSvg': '<svg viewBox=\"0 0 1024 1024\"><path d=\"M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z\"></path></svg>',
            'menuKeys': [
              'justifyLeft',
              'justifyRight',
              'justifyCenter',
              'justifyJustify'
            ]
          },
          {
            'key': 'group-indent',
            'title': '缩进',
            'iconSvg': '<svg viewBox=\"0 0 1024 1024\"><path d=\"M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z\"></path></svg>',
            'menuKeys': [
              'indent',
              'delIndent'
            ]
          },
          'divider', 'blockquote', 'codeBlock', 'insertTable', '|',
          {
            'key': 'group-image',
            'title': '图片',
            'iconSvg': '<svg viewBox=\"0 0 1024 1024\"><path d=\"M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z\"></path></svg>',
            'menuKeys': [
              'insertImage',
              'uploadImage'
            ]
          },
          {
            'key': 'group-video',
            'title': '视频',
            'iconSvg': '<svg viewBox=\"0 0 1024 1024\"><path d=\"M981.184 160.096C837.568 139.456 678.848 128 512 128S186.432 139.456 42.816 160.096C15.296 267.808 0 386.848 0 512s15.264 244.16 42.816 351.904C186.464 884.544 345.152 896 512 896s325.568-11.456 469.184-32.096C1008.704 756.192 1024 637.152 1024 512s-15.264-244.16-42.816-351.904zM384 704V320l320 192-320 192z\"></path></svg>',
            'menuKeys': [
              'insertVideo',
              'uploadVideo'
            ]
          },
          'uploadAttachment', 'insertFormula', 'insertLink', 'emotion'
        ]
      },
      editorConfig: {
        placeholder: '请输入内容...',
        // editor.enable() or editor.disable()
        readOnly: false,
        autoFocus: false,
        scroll: false,
        hoverbarKeys: {
          attachment: {
            menuKeys: ['downloadAttachment']
          },
          formula: {
            menuKeys: ['editFormula']
          }
        },
        // editor.getAllMenuKeys()：获取所有的菜单默认配置信息
        MENU_CONF: {
          'uploadImage': {
            server: this.$store.state.api.fileUploadApi,
            timeout: 30 * 1000,
            fieldName: 'file',
            headers: {
              Authorization: getToken()
            },
            customInsert(res, insertFn) {
              const { code, data } = res
              if (code === 200) {
                if (data && Array.isArray(data) && data.length > 0) {
                  for (let i = 0; i < data.length; i++) {
                    // 从 res 中找到 url alt href ，然后插入图片
                    const { downloadUrl, originalFilename, fileType } = data[i]
                    if (fileType === '图片') {
                      insertFn(downloadUrl, originalFilename, downloadUrl)
                    } else {
                      Message.error('只能上传图片')
                    }
                  }
                } else {
                  Message.error('图片列表为空')
                }
              } else {
                Message.error(res.message)
              }
            }
          },
          'uploadVideo': {
            server: this.$store.state.api.fileUploadApi,
            timeout: 30 * 1000,
            fieldName: 'file',
            headers: {
              Authorization: getToken()
            },
            customInsert(res, insertFn) {
              const { code, data } = res
              if (code === 200) {
                if (data && Array.isArray(data) && data.length > 0) {
                  for (let i = 0; i < data.length; i++) {
                    // 从 res 中找到 url poster ，然后插入视频
                    const { downloadUrl, fileType } = data[i]
                    if (fileType === '视频') {
                      insertFn(downloadUrl, downloadUrl)
                    } else {
                      Message.error('只能上传视频')
                    }
                  }
                } else {
                  Message.error('视频列表为空')
                }
              } else {
                Message.error(res.message)
              }
            }
          },
          // <a data-w-e-type="attachment" data-w-e-is-void data-w-e-is-inline href="https://xxx.com/aaa/bbb/xxx.zip" download="xxx.zip">xxx.zip</a>
          'uploadAttachment': {
            server: this.$store.state.api.fileUploadApi,
            timeout: 30 * 1000,
            fieldName: 'file',
            headers: {
              Authorization: getToken()
            },
            maxFileSize: 10 * 1024 * 1024,
            customInsert(res, file, insertFn) {
              const { code, data } = res
              if (code === 200) {
                if (data && Array.isArray(data) && data.length > 0) {
                  for (let i = 0; i < data.length; i++) {
                    // 从 res 中找到 url ，然后插入附件
                    const { downloadUrl, originalFilename } = data[i]
                    insertFn(originalFilename, downloadUrl)
                  }
                } else {
                  Message.error('附件列表为空')
                }
              } else {
                Message.error(res.message)
              }
            }
          }
        }
      },
      // 默认模式
      mode: 'default',
      // 编辑器字数
      totalCount: 0,
      // 简单模式，取消悬浮菜单，检查工具栏菜单
      // mode: 'simple',
      noImg: NoImg,
      addIcon: AddIcon,
      submitLoading: false,
      uploadImgDialogVisible: false,
      coverImageTypeEnums: [
        { name: '单封面', value: 1 },
        { name: '多封面', value: 2 },
        { name: '系统默认', value: 3 },
        { name: '自动生成', value: 4 },
        { name: '无封面', value: 5 }
      ],
      articleTypeEnums: [
        { name: '原创', value: 1 },
        { name: '转载', value: 2 },
        { name: '翻译', value: 3 }
      ],
      articlePermEnums: [
        { name: '全部可见', value: 1 },
        { name: '登录可见', value: 2 },
        { name: '仅我可见', value: 3 }
      ],
      commentEnums: [
        { name: '开启评论', value: true },
        { name: '关闭评论', value: false }
      ],
      tagSearchLoading: false,
      articleTagOptions: [],
      articleTagFullOptions: [],
      articleCategoryOptions: [],
      addForm: {
        id: '',
        title: '',
        content: '',
        remark: '',
        categoryId: '',
        articleType: 1,
        coverImageType: 5,
        articlePerm: 1,
        reprintLink: '',
        commentFlag: true,
        articleTag: [],
        articleImg: []
      },
      addRules: {
        coverImageType: [
          { required: true, message: '请选择封面类型', trigger: 'blur' }
        ],
        articleType: [
          { required: true, message: '请选择文章类型', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请填写文章摘要', trigger: 'blur' }
        ],
        articlePerm: [
          { required: true, message: '请选择文章发布范围', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择文章分类', trigger: 'blur' }
        ],
        articleTag: [
          { required: true, message: '请选择文章标签', trigger: 'blur' }
        ],
        reprintLink: [
          { required: true, message: '请填写原文链接', trigger: 'blur' }
        ],
        commentFlag: [
          { required: true, message: '请选择评论设置', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    maxUploadSize() {
      if (this.addForm.coverImageType === 2) {
        // 多封面最多支持 4 个封面
        return 4
      }
      return 1
    }
  },
  mounted() {
    this.getArticleCategoryTree()
    this.getArticleTagList()
    this.getArticleDetail()
  },
  methods: {
    getArticleCategoryTree() {
      this.$mapi.article.queryCategoryTree().then(res => {
        const { data } = res
        if (data && data instanceof Array && data.length > 0) {
          this.articleCategoryOptions = data
        } else {
          this.$message.warning('文章分类列表为空, 请先维护文章分类信息')
        }
      }).catch(_ => {
        this.articleCategoryOptions = []
      })
    },
    getArticleTagList() {
      this.$mapi.article.queryTagList().then(res => {
        this.articleTagOptions = res.data
        this.articleTagFullOptions = res.data
      }).catch(_ => {
        this.articleTagOptions = []
        this.articleTagFullOptions = []
      })
    },
    customTagSearchWithoutCase(query) {
      if (query !== '') {
        this.tagSearchLoading = true
        setTimeout(() => {
          this.tagSearchLoading = false
          this.articleTagOptions = this.articleTagFullOptions.filter(item => {
            return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.articleTagOptions = this.articleTagFullOptions
      }
    },
    getArticleDetail() {
      const dataId = this.$route.query.dataId
      if (dataId != null && dataId !== '') {
        this.$mapi.article.queryArticleDetail({ articleId: dataId }).then(res => {
          const { data } = res
          Object.keys(this.addForm).forEach(key => {
            this.addForm[key] = data[key]
          })
        })
      }
    },
    publishArticle() {
      console.log('param', this.addForm)
      if (this.addForm.title === '') {
        this.$message.warning('请填写文章标题')
        return
      }

      if (this.editor.isEmpty()) {
        this.$message.warning('请填写文章内容')
        return
      }

      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          if (this.addForm.id == null || this.addForm.id === '') {
            // add
            this.$mapi.article.addArticle(this.addForm).then(res => {
              this.$message.success(res.message)
            }).finally(_ => {
              this.submitLoading = false
            })
          } else {
            // edit
            this.$mapi.article.editArticle(this.addForm).then(res => {
              this.$message.success(res.message)
            }).finally(_ => {
              this.submitLoading = false
            })
          }
        } else {
          return false
        }
      })
    },
    showCoverImgIcon(index) {
      const closeIconCss = document.getElementsByClassName('cover-img-close-icon')
      closeIconCss[index].style.display = 'block'
      const replaceIconCss = document.getElementsByClassName('cover-img-replace-icon')
      replaceIconCss[index].style.display = 'block'
    },
    hideCoverImgIcon(index) {
      const closeIconCss = document.getElementsByClassName('cover-img-close-icon')
      closeIconCss[index].style.display = 'none'
      const replaceIconCss = document.getElementsByClassName('cover-img-replace-icon')
      replaceIconCss[index].style.display = 'none'
    },
    removeCoverImg(file, index) {
      this.$confirm(`确定移除 ${file['originalFilename']} ？`).then(() => {
        const param = {
          fileId: file.id
        }
        this.$mapi.file.deleteFile(param).then(res => {
          this.addForm.articleImg.splice(index, 1)
          this.$message.success(res.message)
        })
      }).catch(() => { })
    },
    uploadCoverImg() {
      this.uploadImgDialogVisible = true
      this.$refs.uploadImgDialogRef.initData()
    },
    replaceCoverImg(file, index) {
      this.uploadImgDialogVisible = true
      this.$refs.uploadImgDialogRef.initData(true, index)
    },
    uploadImgDone(fileList, index) {
      this.uploadImgDialogVisible = false

      // set data
      fileList = fileList || []
      if (index != null && index >= 0 && fileList.length === 1 && this.addForm.articleImg.length >= index + 1) {
        this.addForm.articleImg[index] = fileList[0]
      } else {
        for (let i = 0; i < fileList.length; i++) {
          this.addForm.articleImg.push(fileList[i])
        }
      }

      if (this.addForm.articleImg.length > this.maxUploadSize) {
        this.addForm.articleImg = this.addForm.articleImg.splice(this.addForm.articleImg.length - this.maxUploadSize)
      }
    },
    // Editor
    onCreated(editor) {
      console.log('onCreated', editor)
      this.editor = Object.seal(editor)
    },
    onChange(editor) {
      // editor.getHtml() 获取 HTML 内容
      // editor.getText() 获取 TEXT 内容
      // editor.children  获取 JSON 内容
      const content = editor.getText()
      const contentNoSpace = content.replace(/\s+/g, '')
      this.totalCount = contentNoSpace.length
      this.addForm.content = editor.getHtml()
    },
    onDestroyed(editor) {
      console.log('onDestroyed', editor)
    },
    onMaxLength(editor) {
      console.log('onMaxLength', editor)
    },
    onFocus(editor) {
      console.log('onFocus', editor)
    },
    onBlur(editor) {
      console.log('onBlur', editor)
    },
    // customPaste(editor, event, callback) {
    //   console.log('ClipboardEvent 粘贴事件对象', event)
    //   const html = event.clipboardData.getData('text/html') // 获取粘贴的 html
    //   const text = event.clipboardData.getData('text/plain') // 获取粘贴的纯文本
    //   const rtf = event.clipboardData.getData('text/rtf') // 获取 rtf 数据（如从 word wsp 复制粘贴）
    //
    //   // 自定义插入内容
    //   editor.insertText(html)
    //
    //   // 返回 false ，阻止默认粘贴行为
    //   event.preventDefault()
    //   callback(false) // 返回值（注意，vue 事件的返回值，不能用 return）
    //
    //   // 返回 true ，继续默认的粘贴行为
    //   // callback(true)
    // },
    customAlert(message, type) {
      switch (type) {
        case 'success':
          this.$message.success(message)
          break
        case 'info':
          this.$message.info(message)
          break
        case 'warning':
          this.$message.warning(message)
          break
        case 'error':
          this.$message.error(message)
          break
        default:
          this.$message.info(message)
      }
    }
  }
}
</script>

<style src='@wangeditor/editor/dist/css/style.css'></style>

<style scoped>
.cover-img-box-flex {
  width: 100%;
  display: flex;
  box-sizing: border-box;
}

.cover-img-box-1 {
  padding: 0;
  margin: 5px 0 0 0;
}

.cover-img-box-more {
  padding: 0;
  margin: 5px 0 0 0;
  flex-wrap: wrap;
}

.cover-img-box {
  padding: 0;
  margin: 0;
}

.cover-img {
  position: relative;
  width: 160px;
  height: 90px;
  display: inline-block;
  border: none;
  vertical-align: top;
  text-align: center;
  line-height: 105px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-right: 24px;
  margin-bottom: 10px;
}

.cover_img_hover {
  width: 160px;
  height: 90px;
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
  background: #fff;
  border: 1px dashed #bfbfbf;
  border-radius: 4px;
}

.cover_img_over {
  position: absolute;
  width: 160px;
  height: 90px;
  z-index: 1;
  left: 0;
  top: 0;
  border-radius: 4px;
}

.cover-img-add-icon {
  color: #999;
  font-size: 24px;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.cover-img-img-icon {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  border-style: none;
}

.cover-img-close-icon {
  position: absolute;
  background: #999;
  color: #fff;
  line-height: 20px;
  right: -8px;
  top: -8px;
  display: none;
  width: 20px;
  height: 20px;
  font-size: 14px;
  text-align: center;
  background-size: contain;
  border-radius: 50%;
  cursor: pointer;
}

.cover-img-replace-icon {
  position: absolute;
  display: none;
  bottom: 12px;
  height: 32px;
  width: 56px;
  background-color: rgba(0,0,0,.4);
  font-size: 14px;
  line-height: 20px;
  padding: 6px 0;
  left: 50%;
  margin-left: -28px;
  border-radius: 4px;
  text-align: center;
  color: #fff;
  cursor: pointer;
}

.editor-container {
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  color: #333;
}

.editor-toolbar {
  width: 1350px;
  min-width: 1350px;
  margin: 0 auto;
  background-color: #FCFCFC;
  border-bottom: 1px solid #e8e8e8;
}

.editor-content {
  height: calc(100% - 140px);
  background-color: rgb(245, 245, 245);
  overflow-y: auto;
  position: relative;
}

.editor-content-inner {
  width: 850px;
  margin: 30px auto 150px auto;
  background-color: #fff;
  padding: 20px 50px 50px 50px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 10px rgb(0 0 70);
}

.editor-content-core {
  margin-bottom: 0;
}

.editor-content-config {
 padding-top: 50px;
 margin-bottom: 80px;
}

.editor-content-config-opt {
  width: 100%;
  height: 64px;
  position: relative;
}

.editor-content-config-opt-left {
  width: 30%;
  position: absolute;
  left: 0;
  bottom: 0;
  text-align: left;
}

.editor-content-config-opt-right {
  width: 70%;
  position: absolute;
  right: 0;
  bottom: 0;
  text-align: right;
}

.editor-title {
  padding: 20px 0;
  border-bottom: 1px solid #e8e8e8;
}

.editor-title input {
  font-size: 23px;
  font-weight: 600;
  color: #606266;
  border: 0;
  outline: none;
  width: 100%;
  line-height: 1;
}

.editor-text-area {
  min-height: 700px;
  margin-top: 20px;
}
</style>
