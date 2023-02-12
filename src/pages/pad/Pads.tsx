import { Button, Card, List, Tag } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PadDetail } from "../../data/pad/pad.detail";
import { buildPatientName } from "../../data/patient/patient.extensions";
import { useGetPadsMutation } from "../../services/padService";
import { handleErrorNotification } from "../../utils/Notifications";
import SectionElement from "../components/SectionElement";
import LayoutCard from "../layouts/LayoutCard";
import FormPad from "./FormPad";

const Pads = () => {
    const [getPads, { isLoading }] = useGetPadsMutation();
    const navigate = useNavigate();
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
        if (value.pad.status != null && value.pad.status == 'activo') {
            return <Tag color="success">{value.pad.status}</Tag>
        }
        if (value.pad.status != null && value.pad.status == 'inactivo') {
            return <Tag color="error">{value.pad.status}</Tag>
        }
        return <></>;
    }

    const handleOnSearch = (query: string) => {
        if (query.length == 0 || query == "") {
            setPadList(data);
        }
        const res = data?.filter((value) =>
            value.catalogue.name
                .toLowerCase()
                .replace(/\s+/g, '')
                .includes(query.toLowerCase().replace(/\s+/g, '')));
        setPadList(res);
    }

    return (
        <LayoutCard
            isLoading={isLoading}
            content={
                <div className="flex flex-col flex-wrap">
                    <Search onChange={(event) => handleOnSearch(event.target.value)} size="large" placeholder={'Buscar pad'} onSearch={handleOnSearch} enterButton />
                    <div className="flex w-full items-end justify-end mt-4 mb-12">
                        <FormPad onFinish={() => handleGetPads()} />
                    </div>

                    <div className="flex flex-row flex-wrap">
                        {padList.map((value, index) =>
                            <Card key={index} title={value.catalogue.name} className="m-2 cursor-pointer" actions={[

                            ]}>
                                <SectionElement label="Precio" icon={<></>} value={`$${value.pad.padPrice}`} />
                                <SectionElement label="Validez" icon={<></>} value={`De ${value.pad.padAdquisitionDate} al  ${value.pad.padDueDate}`} />
                                <SectionElement label="Miembros" icon={<></>} value={buildPadMembers(value)} />
                                {getStautsTag(value)}
                            </Card>)}
                    </div>
                </div>
            }
        />
    );
}

export default Pads;