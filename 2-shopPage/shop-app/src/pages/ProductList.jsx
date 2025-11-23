import { useEffect, useState } from 'react';
import { Row, Col, Select, Pagination, Spin, Empty } from 'antd';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import useStore from '../store/useStore';
import { generateProducts } from '../mock/products';
import './ProductList.css';

const { Option } = Select;

const ProductList = () => {
  const [loading, setLoading] = useState(true);
  
  const filteredProducts = useStore((state) => state.filteredProducts);
  const pagination = useStore((state) => state.pagination);
  const filters = useStore((state) => state.filters);
  const setProducts = useStore((state) => state.setProducts);
  const setFilters = useStore((state) => state.setFilters);
  const setPagination = useStore((state) => state.setPagination);
  const applyFilters = useStore((state) => state.applyFilters);
  
  useEffect(() => {
    // 模拟加载数据
    setLoading(true);
    setTimeout(() => {
      const products = generateProducts(50);
      setProducts(products);
      applyFilters();
      setLoading(false);
    }, 500);
  }, [setProducts, applyFilters]);
  
  const handleSortChange = (value) => {
    setFilters({ sortBy: value });
  };
  
  const handlePageChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // 获取当前页的商品
  const currentProducts = filteredProducts.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );
  
  return (
    <div className="product-list-page">
      <div className="product-list-container">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={6} lg={6} xl={5}>
            <FilterSidebar />
          </Col>
          
          <Col xs={24} sm={24} md={18} lg={18} xl={19}>
            <div className="product-list-header">
              <div className="product-list-info">
                共 <span className="highlight">{pagination.total}</span> 件商品
              </div>
              
              <div className="product-list-sort">
                <span className="sort-label">排序：</span>
                <Select
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  style={{ width: 150 }}
                >
                  <Option value="default">默认</Option>
                  <Option value="priceAsc">价格从低到高</Option>
                  <Option value="priceDesc">价格从高到低</Option>
                  <Option value="salesDesc">销量从高到低</Option>
                </Select>
              </div>
            </div>
            
            {loading ? (
              <div className="loading-container">
                <Spin size="large" tip="加载中..." />
              </div>
            ) : currentProducts.length > 0 ? (
              <>
                <Row gutter={[16, 16]} className="product-grid">
                  {currentProducts.map((product) => (
                    <Col
                      key={product.id}
                      xs={12}
                      sm={12}
                      md={8}
                      lg={8}
                      xl={6}
                    >
                      <ProductCard product={product} />
                    </Col>
                  ))}
                </Row>
                
                <div className="pagination-container">
                  <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={handlePageChange}
                    showSizeChanger
                    showTotal={(total) => `共 ${total} 件商品`}
                    pageSizeOptions={[12, 24, 36, 48]}
                  />
                </div>
              </>
            ) : (
              <Empty
                description="没有找到符合条件的商品"
                style={{ marginTop: 60 }}
              />
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProductList;

