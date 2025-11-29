import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
const httpServer = createServer(app)

// 配置 CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}))

// Socket.io 配置
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// 存储在线用户
const onlineUsers = new Map()

// Socket.io 连接处理
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId || 'anonymous'
  
  console.log(`用户 ${userId} 已连接 (Socket ID: ${socket.id})`)
  
  // 存储用户信息
  onlineUsers.set(socket.id, {
    userId,
    socketId: socket.id,
    connectedAt: new Date()
  })

  // 广播用户上线
  io.emit('userOnline', {
    userId,
    onlineCount: onlineUsers.size
  })

  // 处理消息
  socket.on('message', (data) => {
    console.log(`收到消息 from ${data.userId}: ${data.text}`)
    
    // 广播消息给所有客户端
    io.emit('message', {
      userId: data.userId,
      text: data.text,
      timestamp: data.timestamp || Date.now()
    })
  })

  // 处理断开连接
  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id)
    if (user) {
      console.log(`用户 ${user.userId} 已断开连接`)
      onlineUsers.delete(socket.id)
      
      // 广播用户下线
      io.emit('userOffline', {
        userId: user.userId,
        onlineCount: onlineUsers.size
      })
    }
  })

  // 错误处理
  socket.on('error', (error) => {
    console.error('Socket 错误:', error)
  })
})

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    onlineUsers: onlineUsers.size,
    timestamp: new Date().toISOString()
  })
})

// 启动服务器
const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`)
  console.log(`📡 WebSocket 服务已启动`)
})

