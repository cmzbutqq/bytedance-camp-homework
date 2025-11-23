import { useNavigate } from 'react-router-dom';
import { Badge, Button } from 'antd';
import { ShoppingCartOutlined, HomeOutlined } from '@ant-design/icons';
import useStore from '../store/useStore';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const cart = useStore((state) => state.cart);
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Button
            type="text"
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
            className="header-btn"
          >
            商品列表
          </Button>
        </div>
        
        <div className="header-center">
          <h1 className="header-title">电商平台</h1>
        </div>
        
        <div className="header-right">
          <Badge count={cartCount} offset={[0, 4]}>
            <Button
              type="text"
              icon={<ShoppingCartOutlined />}
              className="header-btn"
            >
              购物车
            </Button>
          </Badge>
        </div>
      </div>
    </header>
  );
};

export default Header;

