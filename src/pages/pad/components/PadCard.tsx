import { Card, Tag } from "antd";
import { PadDetail } from "../../../data/pad/pad.detail";
import { buildPatientName } from "../../../data/patient/patient.extensions";
import Strings from "../../../utils/Strings";
import SectionElement from "../../components/SectionElement";


interface PadCardProps {
    data: PadDetail;
    onEditMembers: () => void;
}

const PadCard = ({ data, onEditMembers }: PadCardProps) => {


    const getStautsTag = (): JSX.Element => {
        if (data.pad.status != null && data.pad.status == Strings.statusValueActive) {
            return <Tag color="success">{data.pad.status}</Tag>
        }
        if (data.pad.status != null && data.pad.status == Strings.statusValueInactive) {
            return <Tag color="error">{data.pad.status}</Tag>
        }
        return <></>;
    }


    const buildPadMembers = () => {
        return data.members.map((value, index) => {
            if (value.id == data.principalId) {
                return <span key={index}>{`* ${buildPatientName(value)}`}</span>
            } else {
                return <span key={index}>{`${buildPatientName(value)}`}</span>
            }
        })
    }


    return (
        <div className="flex flex-col">
            <Card title={data.catalogue.name} className="m-2 cursor-pointer" actions={[
               <span onClick={() => onEditMembers()}>Ver miembros</span>
            ]}>
                <SectionElement label={Strings.price} icon={<></>} value={`$${data.pad.padPrice}`} />
                <SectionElement label={Strings.validity} icon={<></>} value={`De ${data.pad.padAdquisitionDate} al ${data.pad.padDueDate}`} />
                <SectionElement label={Strings.members} icon={<></>} value={buildPadMembers()} />
                {getStautsTag()}
            </Card>

        </div>
    );
}

export default PadCard;