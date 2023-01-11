import React from 'react';
import { Alert, Space, Spin } from 'antd';

const Spinner = () => (
    <Space direction="vertical" className='flex items-center justify-center h-full'>
        <Space>
            <Spin tip="Cargando" size="large">
            </Spin>
        </Space>
    </Space>
);

export default Spinner;