import { Card, Row } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { RiMailLine, RiPhoneLine } from "react-icons/ri";
import { Prospect } from "../../data/prospect/prospect";
import { useGetProspectsMutation } from "../../services/prospectService";
import { handleErrorNotification } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import SectionElement from "../components/SectionElement";
import LayoutCard from "../layouts/LayoutCard";
import FormProspect from "./FormProspect";


const Prospects = () => {

    const [getProspects] = useGetProspectsMutation();
    const [data, setData] = useState<Prospect[]>([]);
    const [prospectList, setProspectList] = useState<Prospect[]>([]);

    useEffect(() => {
        handleGetProspects();
    }, []);

    const handleGetProspects = async () => {
        try {
            const response = await getProspects({}).unwrap();
            setData(response);
            setProspectList(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }


    const handleOnSearch = (query: string) => {
        if (query.length == 0 || query == "") {
            setProspectList(data);
        }
        const res = data?.filter((value) =>
            value.name
                .toLowerCase()
                .replace(/\s+/g, '')
                .includes(query.toLowerCase().replace(/\s+/g, '')));
        setProspectList(res);
    }


    return (
        <LayoutCard
            title={Strings.prospects}
            isLoading={false}
            content={
                <div className="flex flex-col">
                    <Search onChange={(event) => handleOnSearch(event.target.value)} size="large" placeholder={Strings.searchProspect} onSearch={handleOnSearch} enterButton />
                    <div className="flex w-full items-end justify-end mt-4 mb-12">
                        <FormProspect onFinish={() => handleGetProspects()} />
                    </div>
                    <Row>
                        {prospectList.map((value, index) =>
                            <Card key={index} title={value.name} className="m-2 cursor-pointer" actions={[
                            ]}>
                                <SectionElement label={Strings.phoneNumber} value={value.primaryContact} icon={<RiPhoneLine />} />
                                <SectionElement label={Strings.email} value={value.email} icon={<RiMailLine />} />
                            </Card>
                        )}
                    </Row>
                </div>
            } />
    );
}

export default Prospects;