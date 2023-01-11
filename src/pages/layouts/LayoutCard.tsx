import Layout from "antd/es/layout/layout";
import React from "react";
import Spinner from '../components/Spinner';

interface LayoutCardProps {
    content: JSX.Element;
    isLoading: boolean;
    center?: boolean;
}

const LayoutCard = ({ isLoading, content, center }: LayoutCardProps) => {
    return (
        <>
            {isLoading && <>
                {center == true && <div className="flex w-full h-screen justify-center items-center"><Spinner /></div>}
                {center == undefined && <Spinner />}
            </>}
            {!isLoading && <Layout className="layout-content">
                {content}
            </Layout>}

        </>
    );
}

export default LayoutCard;