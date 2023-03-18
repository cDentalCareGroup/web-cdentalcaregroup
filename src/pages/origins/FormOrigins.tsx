import { Button, Checkbox, Modal } from "antd";
import { useEffect, useState } from "react";
import { Origin } from "../../data/origins/origin";
import { RegisterOriginRequest, UpdateOriginRequest } from "../../data/origins/origin.request";
import { useRegisterOriginMutation, useUpdateOriginMutation } from "../../services/originService";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import CustomFormInput from "../components/CustomFormInput";
import LayoutCard from "../layouts/LayoutCard";


interface FormOriginsProps {
    type: FormOriginsType;
    onFinish: () => void;
    origin?: Origin;
}

export enum FormOriginsType {
    REGISTER, UPDATE
}

const FormOrigins = (props: FormOriginsProps) => {
    const [registerOrigin] = useRegisterOriginMutation();
    const [updateOrigin] = useUpdateOriginMutation();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [checkReferralCode, setCheckReferralCode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const handleOpenModal = () => {
        if (props.type == FormOriginsType.UPDATE && props.origin != null) {
            setName(props.origin.name);
            setDescription(props.origin.description);
        }
        setIsOpenModal(true)
    }


    const handleOnRegisterOrigin = async () => {
        try {
            setIsLoading(true);
            await registerOrigin(new RegisterOriginRequest(name, description, checkReferralCode)).unwrap();
            resetParams();
            handleSucccessNotification(NotificationSuccess.REGISTER);
            props.onFinish();
        } catch (error) {
            resetParams()
            handleErrorNotification(error);
        }
    }

    const handleOnUpdateOrigin = async () => {
        try {
            setIsLoading(true);
            await updateOrigin(new UpdateOriginRequest(props.origin?.id ?? 0 ,name, description, checkReferralCode)).unwrap();
            resetParams();
            handleSucccessNotification(NotificationSuccess.UPDATE);
            props.onFinish();
        } catch (error) {
            resetParams()
            handleErrorNotification(error);
        }
    }

    const resetParams = () => {
        setName('');
        setDescription('');
        setCheckReferralCode(false);
        setIsLoading(false);
        setIsOpenModal(false);
    }


    const buildTitle = (): string => {
        if (props.type == FormOriginsType.REGISTER) {
            return Strings.formRegisterOrigin;
        } else {
            return Strings.formUpdateOrigin;
        }
    }

    const buildButtonText = (): string => {
        if (props.type == FormOriginsType.REGISTER) {
            return Strings.save;
        } else {
            return Strings.update;
        }
    }
    const validateReferralCode = () => {
        return props.origin != null && props.origin.referralCode != null &&
            props.origin.referralCode != ''
    }

    const handleCheckFormType = () => {
        if (props.type == FormOriginsType.REGISTER) {
            handleOnRegisterOrigin()
        } else {
            handleOnUpdateOrigin();
        }
    }
    return (
        <LayoutCard
            isLoading={false}
            content={
                <div className="flex flex-col">
                    <div className="flex w-full items-end justify-end">
                        {props.type == FormOriginsType.REGISTER && <Button type="primary" onClick={() => handleOpenModal()}>{Strings.formRegisterOrigin}</Button>}
                    </div>
                    {props.type == FormOriginsType.UPDATE && <span onClick={() => handleOpenModal()}>{Strings.edit}</span>}

                    <Modal confirmLoading={isLoading} title={buildTitle()} okText={buildButtonText()} onOk={() => handleCheckFormType()} open={isOpenModal} onCancel={() => resetParams()}>
                        <div className="flex flex-col">
                            <CustomFormInput value={name} label={Strings.nameLabel} onChange={(event) => setName(event)} />
                            <CustomFormInput value={description} label={Strings.description} onChange={(event) => setDescription(event)} />
                            {!validateReferralCode() && <Checkbox value={checkReferralCode} checked={checkReferralCode} onChange={(event) => setCheckReferralCode(event.target.checked)} className="mt-2">Generar código de referido</Checkbox>}
                        </div>
                    </Modal>
                </div>

            }
        />
    );

}

export default FormOrigins;