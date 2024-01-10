import { Card, Row, Typography } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { Origin } from "../../data/origins/origin";
import { useGetOriginsMutation } from "../../services/originService";
import { handleErrorNotification } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import SectionElement from "../components/SectionElement";
import LayoutCard from "../layouts/LayoutCard";
import FormOrigins, { FormOriginsType } from "./FormOrigins";

const cardStyles = {
    width: '380px',
    height: '150',
  };

const contentStyles = {
    height: '120px', // Ajusta esto a la altura que desees
};
const Origins = () => {
    const [getOrigins, { isLoading }] = useGetOriginsMutation();

    const [origins, setOrigins] = useState<Origin[]>([])
    const [data, setData] = useState<Origin[]>([])


    useEffect(() => {
        handleGetOrigins();
    }, [])

    const handleGetOrigins = async () => {
        try {
            const response = await getOrigins({}).unwrap();
            setOrigins(response);
            setData(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const buildReferralLinkCode = (value: Origin): JSX.Element => {
        if (value.referralCode != null && value.referralCode != '') {
            return <Typography.Paragraph className="text text-base text-gray-500 p-2"
                copyable={{ text: `https://cdentalcaregroup-fcdc9.web.app/appointment/${value.referralCode}` }}>Link de referido</Typography.Paragraph>
        }
        return <></>
    }

    const handleOnSearch = (query: string) => {
        if (query.length == 0 || query == "") {
            setOrigins(data);
        }
        const res = data?.filter((value) =>
            value.name
                .toLowerCase()
                .replace(/\s+/g, '')
                .includes(query.toLowerCase().replace(/\s+/g, '')));
        setOrigins(res);
    }
    return (
        <LayoutCard
            isLoading={isLoading}
            title={Strings.origins}
            content={<div className="flex flex-col">
                <Search onChange={(event) => handleOnSearch(event.target.value)} size="large" placeholder={'Buscar origen'} onSearch={handleOnSearch} enterButton />
                <br />
                <FormOrigins type={FormOriginsType.REGISTER} onFinish={() => handleGetOrigins()} />
                <Row>
                    {origins.map((value, index) =>
                        <Card style={cardStyles}
                            title={value.name}
                            actions={[
                                <FormOrigins type={FormOriginsType.UPDATE} origin={value} onFinish={() => handleGetOrigins()} />
                            ]} 
                            //style={{ minWidth: 350, maxWidth: 350 }} 
                            key={index} className="m-2">
                            <div style={contentStyles}>
                            <SectionElement label={Strings.nameLabel} value={value.name} icon={<></>} />
                            <SectionElement label={Strings.description} value={value.description ?? '-'} icon={<></>} />
                            </div>
                            {buildReferralLinkCode(value)}
                        </Card>
                    )}
                </Row>
            </div>} />
    );
}

export default Origins;