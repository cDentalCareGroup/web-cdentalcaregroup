import { Button, Card, List, Tag } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { PadDetail } from "../../data/pad/pad.detail";
import { buildPatientName } from "../../data/patient/patient.extensions";
import { useGetPadsMutation } from "../../services/padService";
import { handleErrorNotification } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import SectionElement from "../components/SectionElement";
import LayoutCard from "../layouts/LayoutCard";
import FormPad from "./FormPad";



const Pads = () => {
    const [getPads, { isLoading }] = useGetPadsMutation();
    const [data, setData] = useState<PadDetail[]>([]);
    const [padList, setPadList] = useState<PadDetail[]>([]);


    useEffect(() => {
        handleGetPads();
    }, []);

    const handleGetPads = async () => {
        try {
            const response = await getPads({}).unwrap();
            setData(response);
            setPadList(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }


    const buildPadMembers = (data: PadDetail) => {
        return data.members.map((value, _) => {
            if (value.id == data.principalId) {
                return <span >{`* ${buildPatientName(value)}`}</span>
            } else {
                return <span>{`${buildPatientName(value)}`}</span>
            }
        })
    }

    const getStautsTag = (value: PadDetail): JSX.Element => {
        if (value.pad.status != null && value.pad.status == Strings.statusValueActive) {
            return <Tag color="success">{value.pad.status}</Tag>
        }
        if (value.pad.status != null && value.pad.status == Strings.statusValueInactive) {
            return <Tag color="error">{value.pad.status}</Tag>
        }
        return <></>;
    }

    const handleOnSearch = (query: string) => {
        if (query.length == 0 || query == "") {
            setPadList(data);
        }
        const res = data?.filter((value) => value.members.filter((member, _) =>
            buildPatientName(member)
                .toLowerCase()
                .replace(/\s+/g, '')
                .includes(query.toLowerCase().replace(/\s+/g, ''))).length > 0);
        setPadList(res);
    }

    return (
        <LayoutCard
        title={Strings.pads}
            isLoading={isLoading}
            content={
                <div className="flex flex-col flex-wrap">
                    <Search onChange={(event) => handleOnSearch(event.target.value)} size="large" placeholder={Strings.searchPadMember} onSearch={handleOnSearch} enterButton />
                    <div className="flex w-full items-end justify-end mt-4 mb-12">
                        <FormPad onFinish={() => handleGetPads()} />
                    </div>

                    <div className="flex flex-row flex-wrap">
                        {padList.map((value, index) =>
                            <Card key={index} title={value.catalogue.name} className="m-2 cursor-pointer" actions={[

                            ]}>
                                <SectionElement label={Strings.price} icon={<></>} value={`$${value.pad.padPrice}`} />
                                <SectionElement label={Strings.validity} icon={<></>} value={`De ${value.pad.padAdquisitionDate} al  ${value.pad.padDueDate}`} />
                                <SectionElement label={Strings.members} icon={<></>} value={buildPadMembers(value)} />
                                {getStautsTag(value)}
                            </Card>)}
                    </div>
                </div>
            }
        />
    );
}

export default Pads;