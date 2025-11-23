# 技术规范文档

## 项目概述

这是一个基于 React + Vite + Zustand + Ant Design 的电商平台前端项目，实现商品列表页和详情页的核心功能。

### 作业要求

- ✅ 实现商品列表页（支持商品筛选、排序、分页）
- ✅ 实现商品详情页（展示商品信息、规格选择、加入购物车）
- ✅ 组件化拆分合理、状态管理清晰、支持响应式

## 技术架构

### 技术栈

| 技术 | 版本 | 用途 |
|-----|------|-----|
| React | 18.x | 前端框架，使用函数式组件 + Hooks |
| Vite | 5.x | 构建工具，快速的 HMR 和优化的生产构建 |
| Zustand | 4.x | 轻量级状态管理，替代 Redux |
| Ant Design | 5.x | UI 组件库，企业级设计规范 |
| React Router | 6.x | 客户端路由管理 |
| Mock.js | 1.x | 生成模拟数据 |

### 目录结构

```
shop-app/
├── src/
│   ├── components/          # 通用组件
│   │   ├── Header.jsx       # 导航栏
│   │   ├── FilterSidebar.jsx    # 筛选侧边栏
│   │   └── ProductCard.jsx      # 商品卡片
│   ├── pages/              # 页面组件
│   │   ├── ProductList.jsx     # 商品列表页
│   │   └── ProductDetail.jsx   # 商品详情页
│   ├── store/              # 状态管理
│   │   └── useStore.js     # Zustand store
│   ├── mock/               # Mock 数据
│   │   └── products.js     # 商品数据生成器
│   ├── utils/              # 工具函数
│   │   └── format.js       # 格式化函数
│   ├── App.jsx             # 根组件
│   └── main.jsx            # 入口文件
└── package.json
```

## 组件设计

### 组件架构

```
App (路由配置)
├── Header (导航栏)
└── Routes
    ├── ProductList (商品列表页)
    │   ├── FilterSidebar (筛选侧边栏)
    │   └── ProductCard × N (商品卡片)
    └── ProductDetail (商品详情页)
        └── ProductCard × N (推荐商品)
```

### 通用组件

#### Header - 导航栏

**职责**：全局导航和购物车状态展示

**Props**：无（从 store 读取状态）

**功能**：
- 显示网站标题
- 返回列表按钮
- 购物车徽章（显示商品数量）

**实现要点**：
```jsx
const cart = useStore((state) => state.cart);
const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
```

#### FilterSidebar - 筛选侧边栏

**职责**：商品筛选功能

**Props**：无（从 store 读取和更新状态）

**功能**：
- 分类筛选（单选 Radio）
- 价格区间筛选（Slider）

**状态更新**：
```jsx
const setFilters = useStore((state) => state.setFilters);
setFilters({ category: value }); // 自动触发 applyFilters
```

#### ProductCard - 商品卡片

**职责**：展示单个商品信息

**Props**：
```typescript
interface Props {
  product: {
    id: number;
    title: string;
    subtitle: string;
    price: number;
    originalPrice?: number;
    thumbnail: string;
    tag: string;
    sales: number;
  }
}
```

**特点**：
- 高度可复用（列表页和详情页推荐区）
- 点击跳转到详情页
- 悬停效果

### 页面组件

#### ProductList - 商品列表页

**职责**：协调筛选、排序、分页和商品展示

**状态**：
- `loading` - 加载状态
- 从 store 订阅：`filteredProducts`, `pagination`, `filters`

**布局**：
- 使用 Ant Design Grid 系统
- 左侧筛选区（md: 6列，xs: 24列）
- 右侧商品区（md: 18列，xs: 24列）

**核心逻辑**：
```jsx
// 获取当前页商品
const currentProducts = filteredProducts.slice(
  (pagination.current - 1) * pagination.pageSize,
  pagination.current * pagination.pageSize
);
```

#### ProductDetail - 商品详情页

**职责**：展示商品详情和处理购物车操作

**状态**：
- `product` - 当前商品
- `selectedSize` - 选中尺码
- `selectedColor` - 选中颜色
- `quantity` - 购买数量

**核心逻辑**：
```jsx
const handleAddToCart = () => {
  if (!selectedSize || !selectedColor) {
    message.warning('请选择商品规格');
    return;
  }
  addToCart({
    id: product.id,
    title: product.title,
    price: product.price,
    thumbnail: product.thumbnail,
    selectedSize,
    selectedColor,
    quantity,
  });
  message.success('已添加到购物车');
};
```

## 状态管理

### Store 设计

使用 Zustand 创建全局 store：

```javascript
const useStore = create((set, get) => ({
  // 数据状态
  products: [],           // 所有商品
  filteredProducts: [],   // 筛选后的商品
  cart: [],              // 购物车
  
  // UI 状态
  filters: {
    category: 'all',
    priceRange: [0, 10000],
    sortBy: 'default'
  },
  pagination: {
    current: 1,
    pageSize: 12,
    total: 0
  },
  
  // 操作方法
  setProducts: (products) => set({ products }),
  setFilters: (filters) => { /* ... */ },
  applyFilters: () => { /* ... */ },
  setPagination: (pagination) => { /* ... */ },
  addToCart: (item) => { /* ... */ },
  removeFromCart: (cartId) => { /* ... */ },
  updateCartQuantity: (cartId, quantity) => { /* ... */ }
}));
```

### 状态流转

#### 筛选流程

```
用户修改筛选条件
  ↓
setFilters({ category: 'value' })
  ↓
更新 filters 状态
  ↓
自动调用 applyFilters()
  ↓
计算 filteredProducts
  ↓
重置 pagination.current = 1
  ↓
组件重新渲染
```

#### 购物车流程

```
用户点击加入购物车
  ↓
验证规格是否选择
  ↓
addToCart({ id, size, color, quantity })
  ↓
检查是否已存在相同规格商品
  ↓
存在：累加数量 / 不存在：添加新项
  ↓
更新 cart 数组
  ↓
Header 组件显示新徽章数量
```

## 数据模型

### Product 商品数据

```typescript
interface Product {
  id: number;              // 商品ID
  title: string;           // 商品标题
  subtitle: string;        // 副标题
  price: number;           // 现价
  originalPrice: number;   // 原价
  category: string;        // 分类：男装/女装/鞋靴/配饰
  sales: number;           // 销量
  tag: string;             // 标签：新品/热销/折扣/限量
  rating: number;          // 评分 (1-5)
  images: string[];        // 商品图片列表
  thumbnail: string;       // 缩略图
  description: string;     // 商品描述
  sizes: string[];         // 可选尺码
  colors: string[];        // 可选颜色
  stock: number;           // 库存
  details: string[];       // 商品详情列表
}
```

### CartItem 购物车项

```typescript
interface CartItem {
  cartId: number;          // 购物车唯一ID (Date.now())
  id: number;              // 商品ID
  title: string;           // 商品标题
  price: number;           // 价格
  thumbnail: string;       // 缩略图
  selectedSize: string;    // 选中的尺码
  selectedColor: string;   // 选中的颜色
  quantity: number;        // 数量
}
```

## 工具函数

### format.js - 格式化工具

```javascript
// 格式化价格：123 -> "¥123.00"
export const formatPrice = (price) => `¥${price.toFixed(2)}`;

// 格式化销量：15000 -> "1.5万", 1200 -> "1.2k"
export const formatSales = (sales) => {
  if (sales >= 10000) return `${(sales / 10000).toFixed(1)}万`;
  if (sales >= 1000) return `${(sales / 1000).toFixed(1)}k`;
  return sales.toString();
};

// 获取价格区间标签
export const getPriceRangeLabel = (range) => {
  const [min, max] = range;
  if (max >= 10000) return `¥${min}以上`;
  return `¥${min} - ¥${max}`;
};
```

## 设计原则

### 高内聚、低耦合

- **模块内高内聚**：每个组件职责单一明确
- **模块间低耦合**：通过 props 和 Zustand 通信，避免直接依赖

### 控制层数

- 组件嵌套不超过 3 层
- 避免深层组件树导致的性能问题

### 控制个数

- 通用组件：3 个（Header, FilterSidebar, ProductCard）
- 页面组件：2 个（ProductList, ProductDetail）
- 总计：5 个组件，数量合理

## 响应式设计

### 断点策略

```css
/* 移动端优先 */
.component { /* 默认移动端样式 */ }

/* 平板 */
@media (min-width: 768px) { /* 平板样式 */ }

/* 桌面 */
@media (min-width: 992px) { /* 桌面样式 */ }
```

### 布局适配

| 设备 | 宽度 | 筛选区 | 商品列数 | 特殊处理 |
|-----|------|-------|---------|---------|
| 手机 | < 768px | 顶部 | 2 | 隐藏按钮文字 |
| 平板 | 768-992px | 左侧 | 3 | - |
| 桌面 | > 992px | 左侧 | 4 | - |

### Grid 配置

```jsx
// 商品卡片响应式列数
<Col xs={12} sm={12} md={8} lg={8} xl={6}>
  <ProductCard product={product} />
</Col>
```

## 性能优化

### 已实现

1. **分页加载** - 避免一次渲染大量商品
2. **状态局部订阅** - 只订阅需要的状态
   ```jsx
   // ❌ 不好
   const state = useStore();
   
   // ✅ 好
   const products = useStore((state) => state.products);
   ```
3. **列表 key 优化** - 使用稳定的 product.id

### 可优化

1. **虚拟列表** - 长列表使用 react-window
2. **图片懒加载** - 使用 Intersection Observer
3. **代码分割** - React.lazy 和 Suspense
4. **组件 memo** - 使用 React.memo 避免不必要渲染

## 扩展指南

### 添加新的筛选条件

1. 更新 store 中的 filters：
   ```javascript
   filters: {
     category: 'all',
     priceRange: [0, 10000],
     sortBy: 'default',
     newFilter: 'defaultValue', // 新增
   }
   ```

2. 在 applyFilters 中添加筛选逻辑：
   ```javascript
   if (filters.newFilter !== 'defaultValue') {
     filtered = filtered.filter(p => p.field === filters.newFilter);
   }
   ```

3. 在 FilterSidebar 中添加 UI 控件

### 添加新的排序方式

在 applyFilters 的 switch 中添加 case：
```javascript
switch (filters.sortBy) {
  case 'newSort':
    filtered.sort((a, b) => /* 自定义排序 */);
    break;
  // ...
}
```

### 对接真实 API

1. 安装 axios：`npm install axios`
2. 创建 API 服务：
   ```javascript
   // src/services/api.js
   import axios from 'axios';
   
   const api = axios.create({
     baseURL: 'https://your-api.com',
   });
   
   export const getProducts = async () => {
     const response = await api.get('/products');
     return response.data;
   };
   ```
3. 替换 Mock 数据调用

## 代码规范

### 命名规范

- 组件文件：`PascalCase` (ProductCard.jsx)
- 函数/变量：`camelCase` (formatPrice)
- 常量：`UPPER_SNAKE_CASE` (MAX_PRICE)
- CSS 类名：`kebab-case` (product-card)

### 文件组织

- 每个组件对应一个 CSS 文件
- 工具函数按功能分类（format.js, validate.js）
- 组件内部按顺序：imports → component → styles → export



## 构建和部署

### 开发环境

```bash
npm run dev  # 启动开发服务器
```

### 生产构建

```bash
npm run build    # 构建到 dist/
npm run preview  # 预览生产版本
```


## Mock 数据说明

### 图片服务

项目使用 [Picsum Photos](https://picsum.photos) 提供真实的商品图片：

```javascript
// 使用 seed 参数确保图片稳定
`https://picsum.photos/seed/${seed}/800/800`
```

优势：
- ✅ 真实照片，视觉效果好
- ✅ 免费无限制使用
- ✅ 使用 seed 确保图片一致性
- ✅ 支持自定义尺寸

### 商品数据

使用 Mock.js 生成 50 条模拟商品数据，包含：
- 商品基本信息（标题、价格、分类）
- 商品图片（4张轮播图 + 1张缩略图）
- 商品规格（尺码、颜色）
- 商品详情（描述、参数）

## 已知限制

1. 购物车功能仅有状态管理，未实现独立页面
2. 使用 Mock 数据和第三方图片服务
3. 未实现用户认证和支付功能
4. 未添加单元测试

## 参考资源

- [React 官方文档](https://react.dev/)
- [Zustand 文档](https://github.com/pmndrs/zustand)
- [Ant Design 组件](https://ant.design/)
- [Vite 文档](https://vitejs.dev/)



