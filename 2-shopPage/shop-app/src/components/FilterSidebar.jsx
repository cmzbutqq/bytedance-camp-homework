import { Card, Radio, Slider, Space, Typography } from 'antd';
import useStore from '../store/useStore';
import './FilterSidebar.css';

const { Title } = Typography;

const FilterSidebar = () => {
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  
  const categories = [
    { label: '全部', value: 'all' },
    { label: '男装', value: '男装' },
    { label: '女装', value: '女装' },
    { label: '鞋靴', value: '鞋靴' },
    { label: '配饰', value: '配饰' },
  ];
  
  const priceMarks = {
    0: '¥0',
    2500: '¥2.5k',
    5000: '¥5k',
    7500: '¥7.5k',
    10000: '¥10k+',
  };
  
  return (
    <div className="filter-sidebar">
      <Card className="filter-card">
        <Title level={5}>分类</Title>
        <Radio.Group
          value={filters.category}
          onChange={(e) => setFilters({ category: e.target.value })}
        >
          <Space vertical>
            {categories.map((cat) => (
              <Radio key={cat.value} value={cat.value}>
                {cat.label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Card>
      
      <Card className="filter-card">
        <Title level={5}>价格区间</Title>
        <div className="price-slider-container">
          <Slider
            range
            min={0}
            max={10000}
            step={100}
            marks={priceMarks}
            value={filters.priceRange}
            onChange={(value) => setFilters({ priceRange: value })}
            tooltip={{
              formatter: (value) => `¥${value}`,
            }}
          />
        </div>
        <div className="price-range-display">
          ¥{filters.priceRange[0]} - ¥{filters.priceRange[1]}
        </div>
      </Card>
    </div>
  );
};

export default FilterSidebar;

