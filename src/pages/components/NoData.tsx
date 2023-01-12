import { Empty } from "antd";

const NoData: React.FC = () => (
  <div className="flex items-center justify-center mt-[20%]">
    <Empty description="Sin datos"
    />
  </div>
);

export default NoData;