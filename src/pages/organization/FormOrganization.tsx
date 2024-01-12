import { Button, Modal } from "antd";
import { useState } from "react";
import { Organization } from "../../data/organization/organization";
import { RegisterOrganizationRequest, UpdateOrganizationRequest } from "../../data/organization/organization.request";
import { useRegisterOrganizationMutation, useUpdateOrganizationMutation } from "../../services/organizationService";
import Constants from "../../utils/Constants";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import CustomFormInput from "../components/CustomFormInput";
import LayoutCard from "../layouts/LayoutCard";


interface FormOrganizationProps {
    type: FormOrganizationType;
    onFinish: () => void;
    organization?: Organization;
}

export enum FormOrganizationType {
    REGISTER, UPDATE
}

const FormOrganization = (props: FormOrganizationProps) => {
    const [registerOrganization] = useRegisterOrganizationMutation();
    const [updateOrganization] = useUpdateOrganizationMutation();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const handleOpenModal = () => {
        if (props.type == FormOrganizationType.UPDATE && props.organization != null) {
            setName(props.organization.name);
            setDescription(props.organization.description);
        }
        setIsOpenModal(true)
    }


    const handleOnRegisterOrganization = async () => {
        try {
            if (validateForm()) {
                handleErrorNotification(Constants.REQUIRED_FIELDS);
                return
            }
            setIsLoading(true);
            await registerOrganization(new RegisterOrganizationRequest(name, description)).unwrap();
            resetParams();
            handleSucccessNotification(NotificationSuccess.REGISTER);
            props.onFinish();
        } catch (error) {
            resetParams()
            handleErrorNotification(error);
        }
    }

    const handleOnUpdateOrganization = async () => {
        try {
            if (props.organization == null) {
                handleErrorNotification(Constants.SET_TEXT,`Ocurrió un error, actualiza la página para continuar`);
                return
            }
            setIsLoading(true);
            await updateOrganization(new UpdateOrganizationRequest(props.organization.id, name, description)).unwrap();
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
        setIsLoading(false);
        setIsOpenModal(false);
    }


    const buildTitle = (): string => {
        if (props.type == FormOrganizationType.REGISTER) {
            return 'Registrar organizacion'
        } else {
            return 'Actualizar organizacion'
        }
    }

    const buildButtonText = (): string => {
        if (props.type == FormOrganizationType.REGISTER) {
            return Strings.save;
        } else {
            return Strings.update;
        }
    }


    const handleCheckFormType = () => {
        if (props.type == FormOrganizationType.REGISTER) {
            handleOnRegisterOrganization()
        } else {
            handleOnUpdateOrganization();
        }
    }

    const validateForm = (): boolean => {
        return name == '' || name == undefined
    }
    return (
        <LayoutCard
            isLoading={false}
            content={
                <div className="flex flex-col">
                    <div className="flex w-full items-end justify-end">
                        {props.type == FormOrganizationType.REGISTER && <Button type="primary" onClick={() => handleOpenModal()}>{'Registrar organizacion'}</Button>}
                    </div>
                    {props.type == FormOrganizationType.UPDATE && <span onClick={() => handleOpenModal()}>{Strings.edit}</span>}

                    <Modal okButtonProps={{
                        disabled: validateForm()
                    }} confirmLoading={isLoading} title={buildTitle()} okText={buildButtonText()} onOk={() => handleCheckFormType()} open={isOpenModal} onCancel={() => resetParams()}>
                        <div className="flex flex-col">
                            <CustomFormInput value={name} label={Strings.nameLabel} onChange={(event) => setName(event)} />
                            <CustomFormInput value={description} label={Strings.description} onChange={(event) => setDescription(event)} />
                        </div>
                    </Modal>
                </div>

            }
        />
    );

}

export default FormOrganization;