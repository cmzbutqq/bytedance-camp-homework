# Hybrid Chat Application

一个基于 Web 技术和 Android 原生能力的混合聊天应用。

## 项目结构

```
3-chat/
├── frontend/          # 前端项目 (Vue 3 + Tailwind CSS + Socket.io)
├── server/            # 服务端项目 (Node.js + Express + Socket.io)
├── android/           # Android 项目 (Kotlin + WebView)
├── docs/              # 项目文档
└── documents/         # 需求文档（只读）
```

## 技术栈

### 前端

- **Vue 3** - 渐进式 JavaScript 框架
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Socket.io-client** - WebSocket 通信客户端
- **Vite** - 快速的前端构建工具

### 服务端

- **Node.js** - JavaScript 运行时
- **Express** - Web 应用框架
- **Socket.io** - WebSocket 服务端

### Android

- **Kotlin** - 现代 Android 开发语言
- **WebView** - 系统 WebView 组件
- **@JavascriptInterface** - 原生能力桥接
- **AndroidX** - Android 扩展库

## 快速开始

### 1. 启动服务端

```bash
cd server
npm install
npm start
```

服务端将在 `http://localhost:3000` 启动。

### 2. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端将在 `http://localhost:5173` 启动。

### 3. 运行 Android 应用

1. 使用 Android Studio 打开 `android/` 目录
2. 连接 Android 设备或启动模拟器
3. 修改 `MainActivity.kt` 中的 URL（真机需要改为电脑 IP 地址）
4. 运行应用

## 功能特性

### 基本功能

- ✅ 用户身份识别（ID 输入）
- ✅ 实时消息收发（WebSocket）
- ✅ 聊天记录展示
- ✅ 连接状态显示

### 原生能力

- ✅ 获取设备信息
- ✅ 权限管理（麦克风、相机）
- ✅ App 消息推送（简化版）

## 开发说明

### 前端开发

- 开发服务器支持热重载
- 修改代码后自动刷新

### 服务端开发

- 使用 `npm run dev` 启动开发模式（自动重启）
- 支持 CORS，可跨域访问

### Android 开发

- 开发环境：使用 `http://10.0.2.2:5173`（模拟器）或电脑 IP 地址（真机）
- 生产环境：将前端资源打包到 `assets` 目录

## 注意事项

1. **网络配置**

   - Android 模拟器访问 localhost 使用 `10.0.2.2`
   - 真机测试需要确保手机和电脑在同一网络
   - 修改防火墙设置允许端口访问
2. **权限管理**

   - Android 应用首次启动会请求必要权限
   - 麦克风和相机权限需要用户手动授予
3. **JavaScript 桥接**

   - 前端通过 `window.AndroidBridge` 调用原生方法
   - 示例：`AndroidBridge.getDeviceInfo()`

## 进阶功能（待实现）

- [ ] 音视频发送
- [ ] 多人群聊
- [ ] 聊天记录懒加载
- [ ] 持久化存储
- [ ] 其他创意功能
