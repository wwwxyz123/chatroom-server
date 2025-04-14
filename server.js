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

io.on('connection', (socket) => {
  console.log('🔗 用户已连接')

  socket.on('send-message', (msg) => {
    console.log('📩 收到消息：', msg)
    io.emit('receive-message', msg) // 广播消息给所有人
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`✅ 服务器正在运行: http://localhost:${PORT}`)
})
