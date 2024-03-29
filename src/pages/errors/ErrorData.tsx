import { CloseCircleOutlined } from '@ant-design/icons';
import { Result, Typography } from 'antd';

const { Paragraph, Text } = Typography;

const ErrorData = () => (
    <Result
        status="error"
        title="Ups!"
        subTitle="Ocurrio un error al procesar la información, por favor intente más tarde."
    >
        <div className="desc">

            <Paragraph>
                <CloseCircleOutlined className="site-result-demo-error-icon" /> Si el error continua por favor
                <a href='https://cdentalcaregroup.com/contacto/' target={'_blank'}> Contacta a soporte técnico</a>
            </Paragraph>
        </div>
    </Result>
);

export default ErrorData;