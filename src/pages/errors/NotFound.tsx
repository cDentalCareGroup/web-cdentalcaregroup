import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
    <Result
        status="404"
        title="404"
        subTitle="Lo sentimos, la pagina que visitaste no existe."
        extra={<Link to={'/'}>
            <Button type="primary">Regresar</Button>
        </Link>}
    />
);

export default NotFound;