import Mock from 'mockjs';

// 商品分类
const categories = ['男装', '女装', '鞋靴', '配饰'];

// 商品标签
const tags = ['新品', '热销', '折扣', '限量'];

// 尺码选项
const sizes = ['S', 'M', 'L', 'XL'];

// 颜色选项
const colors = ['黑色', '白色', '灰色', '蓝色', '红色', '绿色'];

// 为不同分类准备真实图片ID（使用 Picsum Photos 服务）
const categoryImageSets = {
  '男装': [1, 2, 3, 15, 22, 25, 28, 29, 33, 40, 42, 49, 52, 64, 65, 91, 177, 213, 287, 342],
  '女装': [10, 64, 65, 73, 90, 110, 152, 177, 200, 210, 229, 237, 288, 338, 399, 445, 550, 582, 593, 659],
  '鞋靴': [21, 42, 61, 62, 70, 111, 152, 164, 180, 201, 225, 250, 292, 367, 403, 433, 478, 511, 582, 661],
  '配饰': [13, 18, 30, 48, 54, 89, 103, 129, 167, 188, 201, 239, 250, 277, 292, 367, 403, 478, 511, 582]
};

// 获取商品图片
const getProductImages = (category, index) => {
  const imageIds = categoryImageSets[category];
  const baseId = imageIds[index % imageIds.length];
  const seed = index;
  
  // 使用 Picsum Photos 提供的真实图片
  return {
    images: [
      `https://picsum.photos/seed/${seed}-1/800/800`,
      `https://picsum.photos/seed/${seed}-2/800/800`,
      `https://picsum.photos/seed/${seed}-3/800/800`,
      `https://picsum.photos/seed/${seed}-4/800/800`,
    ],
    thumbnail: `https://picsum.photos/seed/${seed}/400/400`
  };
};

// 生成 Mock 商品数据
export const generateProducts = (count = 50) => {
  const products = [];
  
  for (let i = 1; i <= count; i++) {
    const category = Mock.Random.pick(categories);
    const price = Mock.Random.integer(99, 999);
    const sales = Mock.Random.integer(100, 10000);
    const tag = Mock.Random.pick(tags);
    const productImages = getProductImages(category, i);
    
    products.push({
      id: i,
      title: `${category}商品${i}`,
      subtitle: Mock.Random.ctitle(10, 20),
      price: price,
      originalPrice: Math.floor(price * Mock.Random.float(1.2, 1.8)),
      category: category,
      sales: sales,
      tag: tag,
      rating: Mock.Random.float(4, 5, 1, 1),
      images: productImages.images,
      thumbnail: productImages.thumbnail,
      description: Mock.Random.cparagraph(3, 7),
      sizes: Mock.Random.shuffle(sizes).slice(0, Mock.Random.integer(2, 4)),
      colors: Mock.Random.shuffle(colors).slice(0, Mock.Random.integer(2, 4)),
      stock: Mock.Random.integer(10, 500),
      details: [
        `材质：${Mock.Random.pick(['纯棉', '涤纶', '混纺', '羊毛'])}`,
        `产地：${Mock.Random.pick(['中国', '意大利', '法国', '日本'])}`,
        `适用季节：${Mock.Random.pick(['春季', '夏季', '秋季', '冬季', '四季'])}`,
        `风格：${Mock.Random.pick(['休闲', '商务', '运动', '时尚'])}`,
      ],
    });
  }
  
  return products;
};

// 生成推荐商品
export const getRecommendedProducts = (products, currentId, count = 4) => {
  return products
    .filter(p => p.id !== currentId)
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
};

export default generateProducts;

