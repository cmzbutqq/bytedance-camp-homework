# Todo List - SSR 任务管理应用

一个基于 Koa 框架的持久化 Todo List 应用，支持 SSR（服务端渲染）前端界面和 RESTful API。

## 技术栈

### 后端
- **Koa**: Node.js Web 框架
- **koa-router**: 路由处理
- **koa-bodyparser**: 请求体解析
- **fs**: 文件系统（数据持久化）

### 前端（SSR）
- **EJS**: 模板引擎，用于服务端渲染
- **koa-views**: Koa 视图渲染中间件
- **koa-static**: 静态资源服务中间件
- **原生 JavaScript**: 前端交互逻辑

## 项目结构

```
.
├── src/
│   ├── app.js              # 主服务器文件
│   ├── views/              # EJS 模板文件
│   │   └── index.ejs       # 首页模板
│   ├── routes/
│   │   ├── todos.js        # Todo API 路由
│   │   └── pages.js        # SSR 页面路由
│   └── utils/
│       └── storage.js      # 数据存储工具
├── public/                 # 静态资源目录
│   ├── css/
│   │   └── style.css      # 样式文件
│   └── js/
│       └── app.js         # 前端 JavaScript
├── tests/                  # 测试文件
├── docs/                   # 文档目录
├── package.json
└── README.md
```

## 安装依赖

```bash
npm install
```

## 运行服务

```bash
# 启动服务
npm start

# 开发模式（自动重启）
npm run dev
```

服务默认运行在 `http://localhost:3000`

## 功能特性

### 🌐 SSR 前端界面
- 访问 `http://localhost:3000` 查看美观的 Todo List 界面
- 服务端渲染，首屏加载速度快
- 响应式设计，支持移动端和桌面端
- 实时交互，支持添加、编辑、删除、完成任务

### 🔌 RESTful API
- 完整的 RESTful API 接口
- 支持 JSON 格式数据交互
- 详细的错误处理和状态码

## 使用方式

### 方式一：Web 界面（推荐）
1. 启动服务器：`npm start`
2. 在浏览器中访问：`http://localhost:3000`
3. 在界面中直接操作任务

### 方式二：API 接口
使用 curl、Postman 或其他 HTTP 客户端调用 API 接口

## API 接口

### 1. 获取所有 Todo 任务

**GET** `/api/todos`

**响应示例：**
```json
[
  {
    "id": "xxx",
    "title": "完成作业",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2. 创建新的 Todo 任务

**POST** `/api/todos`

**请求体：**
```json
{
  "title": "学习 Koa",
  "completed": false
}
```

**响应示例（201 Created）：**
```json
{
  "id": "xxx",
  "title": "学习 Koa",
  "completed": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 3. 更新 Todo 任务

**PUT** `/api/todos/:id`

**请求体：**
```json
{
  "title": "学习 Koa 框架",
  "completed": true
}
```

**响应示例：**
```json
{
  "id": "xxx",
  "title": "学习 Koa 框架",
  "completed": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**错误响应（404 Not Found）：**
```json
{
  "error": "任务未找到"
}
```

### 4. 删除 Todo 任务

**DELETE** `/api/todos/:id`

**响应：** 204 No Content（无响应体）

**错误响应（404 Not Found）：**
```json
{
  "error": "任务未找到"
}
```

## 数据存储

所有 Todo 数据保存在项目根目录的 `todos.json` 文件中，服务器重启后数据不会丢失。

## 测试

使用 curl 或 Postman 等工具测试 API：

```bash
# 获取所有任务
curl http://localhost:3000/api/todos

# 创建任务
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "测试任务", "completed": false}'

# 更新任务
curl -X PUT http://localhost:3000/api/todos/{id} \
  -H "Content-Type: application/json" \
  -d '{"title": "更新后的任务", "completed": true}'

# 删除任务
curl -X DELETE http://localhost:3000/api/todos/{id}
```

