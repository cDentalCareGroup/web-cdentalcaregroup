import Layout from "antd/es/layout/layout";
import React from "react";
import Spinner from '../components/Spinner';

interface LayoutCardProps {
    content: JSX.Element;
    isLoading: boolean;
}

const LayoutCard = ({ isLoading, content }: LayoutCardProps) => {
    return (
        <>
            {isLoading && <Spinner />}
            {!isLoading && <Layout className="layout-content">
                {content}
            </Layout>}

        </>
    );
}

export default LayoutCard;