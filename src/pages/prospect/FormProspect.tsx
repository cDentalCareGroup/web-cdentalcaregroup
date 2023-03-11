import { Button, Modal } from "antd";
import { useState } from "react";
import { RiMailLine, RiPhoneLine, RiUser3Line } from "react-icons/ri";
import { RegisterProspectRequest } from "../../data/prospect/prospect.request";
import { useRegisterProspectMutation } from "../../services/prospectService";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import CustomFormInput from "../components/CustomFormInput";
import LayoutCard from "../layouts/LayoutCard";


interface FormProspectProps {
    onFinish: () => void;
}


const FormProspect = (props: FormProspectProps) => {
    const [registerProspec] = useRegisterProspectMutation();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');


    const handleRegisterProspect = async () => {
        try {
            await registerProspec(
                new RegisterProspectRequest(
                    name, phone, email
                )
            ).unwrap();
            handleSucccessNotification(NotificationSuccess.REGISTER);
            handleResetParams()
            props.onFinish();
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleResetParams = () => {
        setName('');
        setPhone('');
        setEmail('');
        setIsOpenModal(false);
    }

    return (
        <LayoutCard
            isLoading={false}
            content={
                <div className="flex flex-col">
                    <div className="flex w-full items-end justify-end">
                        <Button type="primary" onClick={() => setIsOpenModal(true)}>Registrar Prospecto</Button>
                    </div>

                    <Modal title={Strings.formProspect} okText={Strings.registerProspect} onOk={() => handleRegisterProspect()} open={isOpenModal} onCancel={() => handleResetParams()}>
                        <div className="flex flex-col">
                            <CustomFormInput icon={<RiUser3Line />} label={Strings.patientName} value={name} onChange={(value) => setName(value)} />
                            <CustomFormInput icon={<RiPhoneLine />} label={Strings.phoneNumber} value={phone} onChange={(value) => setPhone(value)} />
                            <CustomFormInput icon={<RiMailLine />} label={Strings.email} value={email} onChange={(value) => setEmail(value)} />
                        </div>
                    </Modal>
                </div>
            }
        />
    );
}

export default FormProspect;