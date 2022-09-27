const baseUrl = process.env.VUE_APP_BASE_API === '/' ? '' : process.env.VUE_APP_BASE_API
const api = {
  state: {
    // baseUrl
    baseApi: baseUrl,
    // 文件上传
    fileUploadApi: baseUrl + '/api/file/uploadFile',
    // Druid
    sqlApi: baseUrl + '/druid/index.html'
  }
}

export default api
