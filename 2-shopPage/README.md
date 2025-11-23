# 电商平台 - 商品列表与详情页

一个现代化的电商平台前端项目，基于 React + Vite + Zustand + Ant Design 构建。

## 快速开始

### 安装和运行

```bash
# 进入项目目录
cd shop-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173 查看应用

### 构建生产版本

```bash
npm run build    # 构建
npm run preview  # 预览
```

## 功能特性

### 商品列表页
- 🏷️ **商品筛选** - 按分类（男装/女装/鞋靴/配饰）和价格区间筛选
- 📊 **商品排序** - 支持价格升序/降序、销量排序
- 📄 **分页加载** - 可自定义每页显示数量（12/24/36/48）
- 🎴 **商品展示** - 卡片式展示，包含图片、价格、销量、标签

### 商品详情页
- 🖼️ **图片轮播** - 多图展示，自动播放
- 📝 **详细信息** - 标题、价格、评分、描述
- 👕 **规格选择** - 尺码、颜色选择器
- 🛒 **加入购物车** - 支持数量调整和库存限制
- 💡 **推荐商品** - 相关商品推荐

### 响应式设计
- 💻 桌面端（> 992px）- 4列网格布局
- 📱 平板端（768px - 992px）- 3列网格布局
- 📱 移动端（< 768px）- 2列网格布局

## 技术栈

- **React 18** - 前端框架
- **Vite 5** - 构建工具
- **Zustand** - 状态管理
- **Ant Design** - UI 组件库
- **React Router** - 路由管理
- **Mock.js** - 数据模拟
- **Picsum Photos** - 图片服务（提供真实照片）

## 项目结构

```
shop-app/
├── src/
│   ├── components/      # 通用组件（Header, FilterSidebar, ProductCard）
│   ├── pages/          # 页面组件（ProductList, ProductDetail）
│   ├── store/          # Zustand 状态管理
│   ├── mock/           # Mock 数据生成
│   └── utils/          # 工具函数
├── package.json
└── vite.config.js
```

## 使用指南

### 浏览商品

1. 打开首页，查看商品列表
2. 使用左侧筛选区选择分类和价格区间
3. 使用右上角排序功能调整商品顺序
4. 点击商品卡片进入详情页

### 购买商品

1. 在详情页选择商品规格（尺码、颜色）
2. 调整购买数量
3. 点击"加入购物车"按钮
4. 导航栏购物车图标显示商品数量

### 响应式体验

- **桌面端** - 打开浏览器全屏查看完整布局
- **移动端** - 调整浏览器窗口或使用开发者工具切换到移动设备视图

## 常见问题

### 端口被占用

修改 `shop-app/vite.config.js` 中的端口号：

```javascript
export default defineConfig({
  server: {
    port: 3000,  // 改为其他端口
  },
});
```

### 依赖安装失败

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 使用国内镜像

```bash
npm install --registry=https://registry.npmmirror.com
```



## 开发文档

技术规范和架构设计请参考 [spec.md](./spec.md)


