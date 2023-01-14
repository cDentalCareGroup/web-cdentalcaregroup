import Layout from "antd/es/layout/layout";
import BackArrow from "../components/BackArrow";
import LayoutTitle from "../components/LayoutTitle";
import Spinner from '../components/Spinner';
import ErrorData from "../errors/ErrorData";

interface LayoutCardProps {
    content: JSX.Element;
    isLoading: boolean;
    center?: boolean;
    title?: string;
    showBack?: boolean;
    isError?: boolean;
}

const LayoutCard = ({ isLoading, content, center, title, showBack, isError }: LayoutCardProps) => {
    return (
        <>
            {isLoading && <>
                {center == true && <div className="flex w-full h-screen justify-center items-center"><Spinner /></div>}
                {center == undefined && <Spinner />}
            </>}
            {!isLoading && isError == true && <ErrorData />}
            {!isLoading && isError != true  && <Layout className="layout-content">
               {showBack == true && <BackArrow />}
               {title != null && title != "" && <LayoutTitle title={title ?? ''} />}
                {content}
            </Layout>}

        </>
    );
}

export default LayoutCard;