# SSR 服务端渲染文档

## 技术选型

本项目采用 **EJS + koa-views + koa-static** 实现 SSR 服务端渲染。

### 为什么选择这个技术栈？

1. **EJS（Embedded JavaScript）**
   - ✅ 语法简单，类似 HTML，学习成本低
   - ✅ 支持 JavaScript 逻辑，灵活强大
   - ✅ 社区成熟，文档完善
   - ✅ 适合快速开发

2. **koa-views**
   - ✅ 专为 Koa 设计的视图渲染中间件
   - ✅ 支持多种模板引擎（EJS、Pug、Nunjucks 等）
   - ✅ 配置简单，使用方便

3. **koa-static**
   - ✅ 高效的静态资源服务
   - ✅ 支持缓存和压缩
   - ✅ 配置简单

### 其他可选方案

#### 方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **EJS** | 简单易学，语法类似 HTML | 功能相对简单 | 中小型项目，快速开发 |
| **Nunjucks** | 功能强大，支持模板继承 | 学习曲线较陡 | 大型项目，需要复杂模板逻辑 |
| **Pug** | 语法简洁，代码量少 | 语法特殊，需要适应 | 喜欢简洁语法的项目 |
| **Handlebars** | 逻辑较少，模板清晰 | 功能有限 | 简单的展示型页面 |

## 架构设计

### 目录结构

```
src/
├── views/           # 模板文件目录
│   └── index.ejs   # 首页模板
├── routes/
│   ├── pages.js    # SSR 页面路由（渲染 HTML）
│   └── todos.js    # API 路由（返回 JSON）
└── app.js          # 主应用文件

public/             # 静态资源目录
├── css/
│   └── style.css  # 样式文件
└── js/
    └── app.js     # 前端交互脚本
```

### 工作流程

```
用户请求 → Koa 服务器
    ↓
路由匹配（pages.js）
    ↓
读取数据（storage.js）
    ↓
渲染模板（EJS）
    ↓
返回 HTML（包含初始数据）
    ↓
浏览器加载 HTML + CSS + JS
    ↓
前端 JS 处理用户交互
    ↓
调用 API（todos.js）
    ↓
更新界面
```

## 实现细节

### 1. 服务端渲染（SSR）

**路由配置** (`src/routes/pages.js`):
```javascript
router.get('/', async (ctx) => {
  const todos = await readTodos();
  await ctx.render('index', { todos });
});
```

**模板文件** (`src/views/index.ejs`):
```ejs
<% todos.forEach(todo => { %>
  <div class="todo-item">
    <span><%= todo.title %></span>
  </div>
<% }); %>
```

### 2. 静态资源服务

**配置** (`src/app.js`):
```javascript
app.use(serve(path.join(__dirname, '../public')));
```

访问路径：
- CSS: `http://localhost:3000/css/style.css`
- JS: `http://localhost:3000/js/app.js`

### 3. 前后端交互

**初始渲染**：服务端渲染包含初始数据的 HTML

**后续交互**：前端 JavaScript 通过 Fetch API 调用后端 RESTful API

```javascript
// 前端调用 API
const response = await fetch('/api/todos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: '新任务' })
});
```

## SSR vs CSR 对比

### SSR（服务端渲染）优势
- ✅ **首屏加载快**：HTML 直接包含数据，无需等待 JS 执行
- ✅ **SEO 友好**：搜索引擎可以直接抓取内容
- ✅ **低端设备友好**：减少客户端 JavaScript 执行负担

### CSR（客户端渲染）优势
- ✅ **交互流畅**：页面切换无需刷新
- ✅ **服务器压力小**：静态资源可以 CDN 加速
- ✅ **开发体验好**：前后端分离，开发更灵活

### 本项目采用混合方案
- **首屏 SSR**：快速展示初始数据
- **后续 CSR**：通过 API 实现动态交互

## 性能优化建议

1. **模板缓存**：生产环境启用模板缓存
2. **静态资源缓存**：设置合理的缓存策略
3. **代码分割**：大型项目可考虑按需加载
4. **CDN 加速**：静态资源使用 CDN

## 扩展方向

1. **添加更多页面**：详情页、设置页等
2. **模板继承**：使用 Nunjucks 实现布局继承
3. **国际化**：支持多语言
4. **服务端组件**：使用 React/Vue SSR 框架

