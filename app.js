const express = require('express')
// 创建 express 的服务器实例
const app = express()

// 导入网络传输压缩的中间件
const compression = require('express-compression')
// 必须在托管静态资源前，配置此中间件
app.use(compression())

// 将 dist 目录托管为静态资源服务器
app.use(express.static('./dist'))

// 启动web服务器
app.listen(3001, () => {
  console.log('Express server running at http://127.0.0.1:3001')
})
