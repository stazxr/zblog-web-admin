let proxyObj = {

}

proxyObj['/'] = {
    // websocket
    ws: false,
    // targetHost
    target: "http://localhost:31943",
    // 发送请求头Host 会被修改为 target
    changeOrigin: true,
    // 不重写请求地址
    pathRewrite: {
        '^/': '/'
    }
}

module.exports = {
    devServer: {
        host: "localhost",
        port: "8080",
        proxy: proxyObj
    }
}
