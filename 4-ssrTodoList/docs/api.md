# API 文档

## 基础信息

- **基础 URL**: `http://localhost:3000`
- **Content-Type**: `application/json`

## 接口列表

### 1. 获取所有 Todo 任务

**接口地址：** `GET /api/todos`

**描述：** 获取所有的 Todo 任务列表

**请求参数：** 无

**响应示例：**
```json
[
  {
    "id": "lxyz123abc",
    "title": "完成作业",
    "completed": false,
    "createdAt": "2024-01-01T12:00:00.000Z"
  },
  {
    "id": "lxyz456def",
    "title": "学习 Koa",
    "completed": true,
    "createdAt": "2024-01-01T13:00:00.000Z"
  }
]
```

**状态码：**
- `200 OK`: 成功

---

### 2. 创建新的 Todo 任务

**接口地址：** `POST /api/todos`

**描述：** 创建一个新的 Todo 任务

**请求体：**
```json
{
  "title": "任务标题",
  "completed": false
}
```

**字段说明：**
- `title` (string, 必填): 任务标题
- `completed` (boolean, 可选): 是否完成，默认为 `false`

**响应示例：**
```json
{
  "id": "lxyz789ghi",
  "title": "任务标题",
  "completed": false,
  "createdAt": "2024-01-01T14:00:00.000Z"
}
```

**状态码：**
- `201 Created`: 创建成功
- `400 Bad Request`: 请求参数错误（如缺少 title 或类型不正确）
- `500 Internal Server Error`: 服务器内部错误

**错误响应示例：**
```json
{
  "error": "title 字段是必填的，且必须是字符串类型"
}
```

---

### 3. 更新 Todo 任务

**接口地址：** `PUT /api/todos/:id`

**描述：** 根据 ID 更新一个已存在的 Todo 任务

**URL 参数：**
- `id` (string): 任务的唯一标识

**请求体：**
```json
{
  "title": "更新后的标题",
  "completed": true
}
```

**字段说明：**
- `title` (string, 可选): 任务标题
- `completed` (boolean, 可选): 是否完成
- 至少需要提供一个字段

**响应示例：**
```json
{
  "id": "lxyz789ghi",
  "title": "更新后的标题",
  "completed": true,
  "createdAt": "2024-01-01T14:00:00.000Z"
}
```

**状态码：**
- `200 OK`: 更新成功
- `400 Bad Request`: 请求参数错误（如类型不正确）
- `404 Not Found`: 任务未找到
- `500 Internal Server Error`: 服务器内部错误

**错误响应示例：**
```json
{
  "error": "任务未找到"
}
```

---

### 4. 删除 Todo 任务

**接口地址：** `DELETE /api/todos/:id`

**描述：** 根据 ID 删除一个 Todo 任务

**URL 参数：**
- `id` (string): 任务的唯一标识

**请求体：** 无

**响应：** 无响应体

**状态码：**
- `204 No Content`: 删除成功
- `404 Not Found`: 任务未找到
- `500 Internal Server Error`: 服务器内部错误

**错误响应示例：**
```json
{
  "error": "任务未找到"
}
```

---

## 数据模型

### Todo 对象

```typescript
interface Todo {
  id: string;              // 唯一标识，自动生成
  title: string;           // 任务标题
  completed: boolean;      // 是否完成
  createdAt: string;       // 创建时间（ISO 8601 格式）
}
```

## 错误处理

所有错误响应都遵循以下格式：

```json
{
  "error": "错误描述信息"
}
```

常见错误码：
- `400`: 请求参数错误
- `404`: 资源未找到
- `500`: 服务器内部错误

