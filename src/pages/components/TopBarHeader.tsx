import { Header } from "antd/es/layout/layout";


interface TopBarHeaderProps {
    title: string;
}

const TopBarHeader = ({title}: TopBarHeaderProps) => {
    return (
        <div>
            <Header>
                <img
                    alt="logo"
                    className="object-cover w-10 mt-2"
                    src="https://firebasestorage.googleapis.com/v0/b/cdentalcaregroup-fcdc9.appspot.com/o/Logos%2Fmain_logo.png?alt=media&token=d70a9685-7b64-4491-aea1-5b59dbda3ac8"
                />
            </Header>
            <div className="flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold text-[#00152A]  mb-2 w-full mt-4">
                    {title}
                </h2>
            </div></div>
    );
}

export default TopBarHeader;