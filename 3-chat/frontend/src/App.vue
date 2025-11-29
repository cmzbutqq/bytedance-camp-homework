<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- 用户身份输入区域 -->
    <div v-if="!userId" class="flex-1 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">聊天应用</h1>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">用户 ID</label>
            <input
              v-model="inputUserId"
              type="text"
              placeholder="请输入您的用户 ID"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @keyup.enter="connect"
            />
          </div>
          <button
            @click="connect"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            连接
          </button>
        </div>
      </div>
    </div>

    <!-- 聊天界面 -->
    <div v-else class="flex-1 flex flex-col h-screen">
      <!-- 顶部栏 -->
      <div class="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-800">聊天室</h2>
            <p class="text-sm text-gray-500">用户: {{ userId }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <span :class="[
              'w-2 h-2 rounded-full',
              connected ? 'bg-green-500' : 'bg-red-500'
            ]"></span>
            <span class="text-sm text-gray-600">
              {{ connected ? '已连接' : '未连接' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 消息列表 -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="[
            'flex',
            msg.userId === userId ? 'justify-end' : 'justify-start'
          ]"
        >
          <div
            :class="[
              'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
              msg.userId === userId
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-800 shadow-sm'
            ]"
          >
            <div class="text-xs opacity-75 mb-1">{{ msg.userId }}</div>
            <div class="break-words">{{ msg.text }}</div>
            <div class="text-xs opacity-75 mt-1">{{ formatTime(msg.timestamp) }}</div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="bg-white border-t border-gray-200 p-4">
        <div class="flex space-x-2">
          <input
            v-model="messageText"
            type="text"
            placeholder="输入消息..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @keyup.enter="sendMessage"
            :disabled="!connected"
          />
          <button
            @click="sendMessage"
            :disabled="!connected || !messageText.trim()"
            class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { io } from 'socket.io-client'

const userId = ref('')
const inputUserId = ref('')
const messageText = ref('')
const messages = ref([])
const connected = ref(false)
const messagesContainer = ref(null)
const socket = ref(null)

const connect = () => {
  if (!inputUserId.value.trim()) {
    alert('请输入用户 ID')
    return
  }
  
  userId.value = inputUserId.value.trim()
  
  // 连接到服务端（开发环境使用 localhost，生产环境需要配置实际地址）
  const serverUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'http://10.0.2.2:3000' // Android 模拟器使用此地址
  
  socket.value = io(serverUrl, {
    query: { userId: userId.value }
  })

  socket.value.on('connect', () => {
    connected.value = true
    console.log('已连接到服务器')
  })

  socket.value.on('disconnect', () => {
    connected.value = false
    console.log('已断开连接')
  })

  socket.value.on('message', (data) => {
    messages.value.push({
      userId: data.userId,
      text: data.text,
      timestamp: data.timestamp || Date.now()
    })
    scrollToBottom()
  })

  socket.value.on('error', (error) => {
    console.error('Socket 错误:', error)
    alert('连接错误: ' + error.message)
  })
}

const sendMessage = () => {
  if (!messageText.value.trim() || !connected.value) return

  const message = {
    userId: userId.value,
    text: messageText.value.trim(),
    timestamp: Date.now()
  }

  socket.value.emit('message', message)
  messageText.value = ''
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect()
  }
})
</script>

