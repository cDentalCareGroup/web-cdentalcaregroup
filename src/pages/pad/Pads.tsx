import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import LayoutCard from "../layouts/LayoutCard";

const Pads = () => {
    const navigate = useNavigate();
    return (
        <LayoutCard
            isLoading={false}
            content={
                <div>
                    <Button onClick={() => navigate('/admin/pad/reigster')}>Registrar pad</Button>
                </div>
            }
        />
    );
}

export default Pads;