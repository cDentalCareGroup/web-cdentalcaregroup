import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const UnAuthorized: React.FC = () => (
    <Result
        status="403"
        title="403"
        subTitle="Lo sentimos no tienes permisos para esta página"
        extra={
            <Link to={'/'}>
                <Button type="primary">Regresar</Button>
            </Link>
        }
    />
);

export default UnAuthorized;