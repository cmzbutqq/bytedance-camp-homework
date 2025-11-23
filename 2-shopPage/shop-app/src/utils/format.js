// 格式化价格
export const formatPrice = (price) => {
  return `¥${price.toFixed(2)}`;
};

// 格式化销量
export const formatSales = (sales) => {
  if (sales >= 10000) {
    return `${(sales / 10000).toFixed(1)}万`;
  }
  if (sales >= 1000) {
    return `${(sales / 1000).toFixed(1)}k`;
  }
  return sales.toString();
};

// 获取价格区间标签
export const getPriceRangeLabel = (range) => {
  const [min, max] = range;
  if (max >= 10000) {
    return `¥${min}以上`;
  }
  return `¥${min} - ¥${max}`;
};

