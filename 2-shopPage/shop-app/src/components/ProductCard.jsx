import { Card, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { formatPrice, formatSales } from '../utils/format';
import './ProductCard.css';

const { Text, Title } = Typography;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };
  
  return (
    <Card
      hoverable
      className="product-card"
      cover={
        <div className="product-card-image-wrapper">
          <img
            alt={product.title}
            src={product.thumbnail}
            className="product-card-image"
          />
          {product.tag && (
            <Tag color={getTagColor(product.tag)} className="product-card-tag">
              {product.tag}
            </Tag>
          )}
        </div>
      }
      onClick={handleClick}
    >
      <div className="product-card-content">
        <Title level={5} ellipsis={{ rows: 2 }} className="product-card-title">
          {product.title}
        </Title>
        
        <Text type="secondary" ellipsis className="product-card-subtitle">
          {product.subtitle}
        </Text>
        
        <div className="product-card-price-section">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="product-card-original-price">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        
        <div className="product-card-sales">
          销量 {formatSales(product.sales)}
        </div>
      </div>
    </Card>
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

export default ProductCard;

