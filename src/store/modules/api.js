const baseUrl = process.env.VUE_APP_BASE_API === '/' ? '' : process.env.VUE_APP_BASE_API
const api = {
  state: {
    // baseUrl
    baseApi: baseUrl,
    // 通用文件上传
    fileUploadApi: baseUrl + '/api/file/uploadFile',
    // 文件上传测试接口
    testUploadFile: baseUrl + '/api/file/testUploadFile',
    // Druid
    sqlApi: baseUrl + '/druid/index.html',
    // Swagger
    swaggerApi: baseUrl + '/swagger-ui.html'
  }
}

export default api
