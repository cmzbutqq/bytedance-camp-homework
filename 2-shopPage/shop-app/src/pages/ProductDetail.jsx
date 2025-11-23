import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Carousel,
  Button,
  InputNumber,
  Tag,
  Space,
  Typography,
  Divider,
  message,
  Rate,
  Spin,
} from 'antd';
import { ShoppingCartOutlined, LeftOutlined } from '@ant-design/icons';
import ProductCard from '../components/ProductCard';
import useStore from '../store/useStore';
import { generateProducts, getRecommendedProducts } from '../mock/products';
import { formatPrice } from '../utils/format';
import './ProductDetail.css';

const { Title, Text, Paragraph } = Typography;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const addToCart = useStore((state) => state.addToCart);
  const products = useStore((state) => state.products);
  
  useEffect(() => {
    setLoading(true);
    
    // 模拟加载数据
    setTimeout(() => {
      let allProducts = products;
      if (allProducts.length === 0) {
        allProducts = generateProducts(50);
      }
      
      const foundProduct = allProducts.find((p) => p.id === parseInt(id));
      setProduct(foundProduct);
      
      if (foundProduct) {
        const recommended = getRecommendedProducts(allProducts, foundProduct.id, 4);
        setRecommendedProducts(recommended);
        setSelectedSize(foundProduct.sizes[0]);
        setSelectedColor(foundProduct.colors[0]);
      }
      
      setLoading(false);
    }, 500);
  }, [id, products]);
  
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
  
  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-container">
          <Text>商品不存在</Text>
          <Button onClick={() => navigate('/')}>返回列表</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <Button
          icon={<LeftOutlined />}
          onClick={() => navigate('/')}
          className="back-button"
        >
          返回列表
        </Button>
        
        <Row gutter={[32, 32]} className="product-detail-main">
          <Col xs={24} sm={24} md={12} lg={12}>
            <div className="product-images">
              <Carousel autoplay>
                {product.images.map((img, index) => (
                  <div key={index} className="carousel-image-wrapper">
                    <img src={img} alt={`${product.title} ${index + 1}`} />
                  </div>
                ))}
              </Carousel>
            </div>
          </Col>
          
          <Col xs={24} sm={24} md={12} lg={12}>
            <div className="product-info">
              <div className="product-header">
                {product.tag && (
                  <Tag color={getTagColor(product.tag)} className="product-tag">
                    {product.tag}
                  </Tag>
                )}
                <Title level={2} className="product-title">
                  {product.title}
                </Title>
                <Text type="secondary" className="product-subtitle">
                  {product.subtitle}
                </Text>
              </div>
              
              <div className="product-rating">
                <Rate disabled defaultValue={product.rating} allowHalf />
                <Text type="secondary" style={{ marginLeft: 8 }}>
                  ({product.rating})
                </Text>
              </div>
              
              <Divider />
              
              <div className="product-price-section">
                <div className="price-row">
                  <Text type="secondary">价格：</Text>
                  <Space>
                    <span className="current-price">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="original-price">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </Space>
                </div>
              </div>
              
              <Divider />
              
              <div className="product-specs">
                <div className="spec-item">
                  <Text className="spec-label">尺码</Text>
                  <Space wrap>
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        type={selectedSize === size ? 'primary' : 'default'}
                        onClick={() => setSelectedSize(size)}
                        className="spec-button"
                      >
                        {size}
                      </Button>
                    ))}
                  </Space>
                </div>
                
                <div className="spec-item">
                  <Text className="spec-label">颜色</Text>
                  <Space wrap>
                    {product.colors.map((color) => (
                      <Button
                        key={color}
                        type={selectedColor === color ? 'primary' : 'default'}
                        onClick={() => setSelectedColor(color)}
                        className="spec-button"
                      >
                        {color}
                      </Button>
                    ))}
                  </Space>
                </div>
                
                <div className="spec-item">
                  <Text className="spec-label">数量</Text>
                  <InputNumber
                    min={1}
                    max={product.stock}
                    value={quantity}
                    onChange={setQuantity}
                    style={{ width: 120 }}
                  />
                  <Text type="secondary" style={{ marginLeft: 12 }}>
                    库存：{product.stock} 件
                  </Text>
                </div>
              </div>
              
              <Divider />
              
              <div className="product-actions">
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  block
                >
                  加入购物车
                </Button>
              </div>
              
              <Divider />
              
              <div className="product-description">
                <Title level={4}>商品描述</Title>
                <Paragraph>{product.description}</Paragraph>
                
                <Title level={5}>商品详情</Title>
                <ul>
                  {product.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Col>
        </Row>
        
        <Divider style={{ margin: '48px 0' }} />
        
        <div className="recommended-section">
          <Title level={3} className="section-title">
            推荐商品
          </Title>
          <Row gutter={[16, 16]}>
            {recommendedProducts.map((prod) => (
              <Col key={prod.id} xs={12} sm={12} md={6} lg={6} xl={6}>
                <ProductCard product={prod} />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

const getTagColor = (tag) => {
  const colorMap = {
    '新品': 'green',
    '热销': 'red',
    '折扣': 'orange',
    '限量': 'purple',
  };
  return colorMap[tag] || 'blue';
};

export default ProductDetail;

