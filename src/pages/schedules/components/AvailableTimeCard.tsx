import { Card, Modal, Tag } from "antd";
import { BranchOfficeSchedule } from "../../../data/branchoffice/branch.office.schedule";
import { UpdateAvailableTimeStatusRequest } from "../../../data/schedule/schedule.request";
import { useUpdateAvailableTimeStatusMutation } from "../../../services/branchOfficeService";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../../utils/Notifications";
import Strings from "../../../utils/Strings";
import SectionElement from "../../components/SectionElement";
const { confirm } = Modal;

interface AvailableTimeCardProps {
    data: BranchOfficeSchedule;
    onStatusChange: () => void;
}

const AvailableTimeCard = ({ data, onStatusChange }: AvailableTimeCardProps) => {
    const [updateAvailableTimeStatus] = useUpdateAvailableTimeStatusMutation();

    const buildConfirmationText = (): JSX.Element => {
        if (data.status == Strings.statusValueActive) {
            return <span>
                {`Se deshabilitará el horario, no se podrá agendar citas el día ${data.dayName} entre ${data.startTime} y ${data.endTime}, ¿Deseas continuar?`}
            </span>
        }
        if (data.status == Strings.statusValueInactive) {
            return <span>
                {`Se habilitará el horario para poder agendar citas el día ${data.dayName} entre ${data.startTime} y ${data.endTime}, ¿Deseas continuar?`}
            </span>
        }
        return <></>;
    }

    const buildButtonStatus = (): string => {
        if (data.status == Strings.statusValueActive) {
            return Strings.disabledSegment
        }
        if (data.status == Strings.statusValueInactive) {
            return Strings.enableSegment
        }
        return '';
    }
    const getStautsTag = (): JSX.Element => {
        if (data.status == Strings.statusValueActive) {
            return <Tag color="success">{Strings.statusActive}</Tag>
        }
        if (data.status == Strings.statusValueInactive) {
            return <Tag color="red">{Strings.statusInactive}</Tag>
        }
        return <></>;
    }

    const buildDisabledTime = (): JSX.Element => {
        if (data.status == Strings.statusValueInactive) {
            return <Tag color="warning">{Strings.scheduleNotAvailable}</Tag>
        }
        return <></>;
    }

    const handleOnStatusChange = async (value: BranchOfficeSchedule) => {
        let status = Strings.statusValueActive;
        if (value.status == Strings.statusValueActive) {
            status = Strings.statusValueInactive;
        }
        try {
            await updateAvailableTimeStatus(
                new UpdateAvailableTimeStatusRequest(value.id, status)
            ).unwrap();
            handleSucccessNotification(NotificationSuccess.UPDATE);
            onStatusChange();
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    return (
        <Card title={`${data.dayName}`} actions={[
            <span onClick={() => {
                confirm({
                    content: buildConfirmationText(),
                    onOk() {
                        handleOnStatusChange(data);
                    },
                    okText: Strings.continue,
                    cancelText: Strings.cancel,
                });
            }}>
                {buildButtonStatus()}
            </span>
        ]}>
            <SectionElement label={Strings.schedule} value={`${data.startTime} - ${data.endTime}`} icon={<></>} />
            {getStautsTag()} <br />
            <br />
            {buildDisabledTime()}
        </Card>
    );
}

export default AvailableTimeCard;