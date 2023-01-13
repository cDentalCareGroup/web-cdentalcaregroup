import Layout from "antd/es/layout/layout";
import React from "react";
import BackArrow from "../components/BackArrow";
import LayoutTitle from "../components/LayoutTitle";
import Spinner from '../components/Spinner';

interface LayoutCardProps {
    content: JSX.Element;
    isLoading: boolean;
    center?: boolean;
    title?: string;
    showBack?: boolean;
}

const LayoutCard = ({ isLoading, content, center, title, showBack }: LayoutCardProps) => {
    return (
        <>
            {isLoading && <>
                {center == true && <div className="flex w-full h-screen justify-center items-center"><Spinner /></div>}
                {center == undefined && <Spinner />}
            </>}
            {!isLoading && <Layout className="layout-content">
               {showBack == true && <BackArrow />}
               {title != null && title != "" && <LayoutTitle title={title ?? ''} />}
                {content}
            </Layout>}

        </>
    );
}

export default LayoutCard;