import { Card, Row } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { render } from "react-dom"
import { Organization } from "../../data/organization/organization";
import { useGetOrganizationsMutation } from "../../services/organizationService";
import { handleErrorNotification } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import SectionElement from "../components/SectionElement";
import LayoutCard from "../layouts/LayoutCard";
import FormOrganization, { FormOrganizationType } from "./FormOrganization";

const contentStyles = {
    minHeight: '200px', 
};
const Organizations = () => {
    const [getOrganizations, { isLoading }] = useGetOrganizationsMutation();
    const [data, setData] = useState<Organization[]>([])
    const [organizations, setOrganizations] = useState<Organization[]>([])

    useEffect(() => {
        handleGetOrganizations();
    }, [])

    const handleGetOrganizations = async () => {
        try {
            const response = await getOrganizations({}).unwrap();
            setData(response);
            setOrganizations(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleOnSearch = (query: string) => {
        if (query.length == 0 || query == "") {
            setOrganizations(data);
        }
        const res = data?.filter((value) =>
            value.name
                .toLowerCase()
                .replace(/\s+/g, '')
                .includes(query.toLowerCase().replace(/\s+/g, '')));
        setOrganizations(res);
    }

    return (
        <LayoutCard
            title="Organizaciones"
            isLoading={isLoading}
            content={
                <div className="flex flex-col">
                    <Search onChange={(event) => handleOnSearch(event.target.value)} size="large" placeholder={'Buscar organización'} onSearch={handleOnSearch} enterButton />
                    <br />
                    <FormOrganization onFinish={() => handleGetOrganizations()} type={FormOrganizationType.REGISTER} />
                    <Row>
                        {organizations.map((value, index) =>
                            <Card
                                title={value.name}
                                actions={[
                                    <FormOrganization type={FormOrganizationType.UPDATE} organization={value} onFinish={() => handleGetOrganizations()} />
                                ]} 
                                style={{ minWidth: 350, maxWidth: 350 }} 
                                key={index} className="m-2">
                                <div style={contentStyles}>
                                <SectionElement label={Strings.nameLabel} value={value.name} icon={<></>} />
                                <SectionElement label={Strings.description} value={value.description ?? '-'} icon={<></>} />
                                </div>
                            </Card>
                        )}
                    </Row>
                </div>}
        />
    );
}

export default Organizations;
