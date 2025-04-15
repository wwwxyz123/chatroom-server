const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')

const app = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*', // 允许所有前端访问
    methods: ['GET', 'POST']
  }
})


// ✅ 在线人数统计
let onlineCount = 0


io.on('connection', (socket) => {
  onlineCount++
  console.log('🔗 有用户连接，当前在线人数：', onlineCount)

  // ✅ 广播在线人数
  io.emit('update-user-count', onlineCount)

  // ✅ 接收消息并广播
  socket.on('send-message', (msg) => {
    console.log('📩 收到消息：', msg)
    io.emit('receive-message', msg)
  })

  // ✅ 用户断开连接时更新人数
  socket.on('disconnect', () => {
    onlineCount--
    console.log('❌ 用户断开，当前在线人数：', onlineCount)
    io.emit('update-user-count', onlineCount)
  })
})
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`✅ 服务器正在运行: http://localhost:${PORT}`)
})
