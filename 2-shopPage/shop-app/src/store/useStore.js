import { create } from 'zustand';

const useStore = create((set, get) => ({
  // 商品列表数据
  products: [],
  filteredProducts: [],
  
  // 筛选条件
  filters: {
    category: 'all',
    priceRange: [0, 10000],
    sortBy: 'default', // default, priceAsc, priceDesc, salesDesc
  },
  
  // 分页
  pagination: {
    current: 1,
    pageSize: 12,
    total: 0,
  },
  
  // 购物车
  cart: [],
  
  // 设置商品列表
  setProducts: (products) => set({ products }),
  
  // 设置筛选条件
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, current: 1 }, // 重置到第一页
    }));
    get().applyFilters();
  },
  
  // 应用筛选和排序
  applyFilters: () => {
    const { products, filters } = get();
    let filtered = [...products];
    
    // 分类筛选
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    
    // 价格筛选
    filtered = filtered.filter(
      p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );
    
    // 排序
    switch (filters.sortBy) {
      case 'priceAsc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'salesDesc':
        filtered.sort((a, b) => b.sales - a.sales);
        break;
      default:
        break;
    }
    
    set({
      filteredProducts: filtered,
      pagination: {
        ...get().pagination,
        total: filtered.length,
      },
    });
  },
  
  // 设置分页
  setPagination: (pagination) => {
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    }));
  },
  
  // 添加到购物车
  addToCart: (item) => {
    set((state) => {
      const existingItem = state.cart.find(
        i => i.id === item.id && 
        i.selectedSize === item.selectedSize && 
        i.selectedColor === item.selectedColor
      );
      
      if (existingItem) {
        return {
          cart: state.cart.map(i =>
            i.id === item.id && 
            i.selectedSize === item.selectedSize && 
            i.selectedColor === item.selectedColor
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      } else {
        return {
          cart: [...state.cart, { ...item, cartId: Date.now() }],
        };
      }
    });
  },
  
  // 从购物车移除
  removeFromCart: (cartId) => {
    set((state) => ({
      cart: state.cart.filter(item => item.cartId !== cartId),
    }));
  },
  
  // 更新购物车商品数量
  updateCartQuantity: (cartId, quantity) => {
    set((state) => ({
      cart: state.cart.map(item =>
        item.cartId === cartId ? { ...item, quantity } : item
      ),
    }));
  },
}));

export default useStore;

