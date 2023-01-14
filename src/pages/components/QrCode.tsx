import { QRCode, Button } from 'antd';

const downloadQRCode = () => {
    const canvas = document.getElementById('myqrcode')?.querySelector<HTMLCanvasElement>('canvas');
    if (canvas) {
        const url = canvas.toDataURL();
        const a = document.createElement('a');
        a.download = 'QRCode.jpg';
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};


interface QrCodeProps {
    value: string;
}

const QrCode = ({ value }: QrCodeProps) => (
    <div id="myqrcode" className='flex flex-col items-center justify-center'>
        <QRCode bordered={false} value={value} style={{ marginBottom: 16,  }} size={250} />
        <Button type="default" danger onClick={downloadQRCode}>
            Descargar QR
        </Button>
    </div>
);

export default QrCode;