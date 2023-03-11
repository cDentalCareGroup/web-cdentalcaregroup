import { Button, Divider, Modal, Radio, Row, Space, Table } from "antd";
import Checkbox from "antd/es/checkbox/Checkbox";
import { useEffect, useState } from "react";
import { RiDeleteBin7Line, RiUser4Line } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { PadCatalogueDetail } from "../../data/pad/pad.catalogue.detail";
import { padCatalogueDetailToDataTable } from "../../data/pad/pad.extensions";
import { RegisterPadCatalogueRequest, RegisterPadComponentRequest, UpdatePadCatalogueRequest } from "../../data/pad/pad.request";
import SelectItemOption from "../../data/select/select.item.option";
import { servicesToSelectItemOption } from "../../data/service/service.extentions";
import { useGetServicesMutation } from "../../services/appointmentService";
import { useDeletePadCatalogueComponentMutation, useGetPadCatalogDetailMutation, useRegisterPadCatalogueComponentMutation, useRegisterPadCatalogueMutation, useUpdatePadCatalogueMutation } from "../../services/padService";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import CustomFormInput from "../components/CustomFormInput";
import SelectSearch from "../components/SelectSearch";
import LayoutCard from "../layouts/LayoutCard";

interface FormPadCatalogueProps {
    type: FormPadCatalogueType;
}
export enum FormPadCatalogueType {
    REGISTER, UPDATE
}


const FormPadCatalogue = (props: FormPadCatalogueProps) => {
    const { id } = useParams();
    const [getServices] = useGetServicesMutation();
    const [registerPadCatalogue] = useRegisterPadCatalogueMutation();
    const [registerPadCatalogueComponent] = useRegisterPadCatalogueComponentMutation();
    const [deletePadCatalogueComponent] = useDeletePadCatalogueComponentMutation();
    const [getPadCatalogDetail] = useGetPadCatalogDetailMutation();
    const [updatePadCatalogue] = useUpdatePadCatalogueMutation();
    const [serviceList, setServiceList] = useState<SelectItemOption[]>([]);
    const [service, setService] = useState<SelectItemOption>();
    const [quantityPad, setQuantityPad] = useState('');
    const [quantityPatient, setQuantityPatient] = useState('');
    const [discount, setDiscount] = useState('');
    const [discountTwo, setDiscountTwo] = useState('');
    const [days, setDays] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [maxMembers, setMaxMembers] = useState('');
    const [maxAditionals, setMaxAditionals] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [components, setComponents] = useState<any[]>([]);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [padCatalogue, setPadCatalogue] = useState<PadCatalogueDetail>();
    const [type, setType] = useState('individual');
    const [isLoadingAction, setIsLoadingAction] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingCard, setIsLoadingCard] = useState(false);

    useEffect(() => {
        if (props.type == FormPadCatalogueType.UPDATE) {
            handleGetPadCatalogueDetail();
        }
        handleGetServices();
    }, [])

    const handleGetPadCatalogueDetail = async () => {
        try {
            
            setIsLoadingCard(true);
            const response = await getPadCatalogDetail({ 'id': id }).unwrap();
            let active = false;
            if (response.status == Strings.statusValueActive) {
                active = true;
            }
            setName(response.name);
            setDays(`${response.day}`);
            setDescription(response.description);
            setPrice(response.price);
            setIsActive(active);
            setMaxAditionals(response.maxAdditional?.toString() ?? '0');
            setMaxMembers(response.maxMemebers?.toString() ?? '0')
            setType(response.type);
            setPadCatalogue(response);
            setComponents(padCatalogueDetailToDataTable(response));
            setIsLoadingCard(false);
        } catch (error) {
            setIsLoadingCard(false);
            handleErrorNotification(error);
        }
    }


    const handleGetServices = async () => {
        try {
            const response = await getServices({}).unwrap();
            setServiceList(servicesToSelectItemOption(response));
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const columns = [
        {
            title: Strings.service,
            dataIndex: 'service',
            key: 'service',
        },
        {
            title: Strings.quantityPad,
            dataIndex: 'quantityPad',
            key: 'quantityPad',
        },
        {
            title: Strings.maxPatientQuantity,
            dataIndex: 'quantityPatient',
            key: 'quantityPatient',
        },
        {
            title: Strings.discount,
            dataIndex: 'discount',
            key: 'discount',
        },
        {
            title: Strings.discountTwo,
            dataIndex: 'discountTwo',
            key: 'discountTwo',
        },
        {
            title: Strings.actions,
            dataIndex: 'action',
            key: 'action',
            render: (_: any, value: any) => (
                <div key={value.key} className="flex flex-wrap cursor-pointer justify-center items-center">
                    <RiDeleteBin7Line size={20} onClick={() => handleDeleteComponent(value.key)} className="text text-red-600" />
                </div>
            ),
        },
    ];


    const handleAddComponent = async () => {
        setIsTableLoading(true);
        try {
            const response = await registerPadCatalogueComponent(
                new RegisterPadComponentRequest(
                    padCatalogue?.id ?? 0,
                    service?.id ?? 0,
                    Number(quantityPad),
                    Number(quantityPatient),
                    Number(discount),
                    Number(discountTwo)
                )
            ).unwrap();
            setDiscount('');
            setQuantityPad('')
            setQuantityPatient('')
            setService(undefined);
            setPadCatalogue(response);
            setComponents(padCatalogueDetailToDataTable(response));
            setIsTableLoading(false);
            handleSucccessNotification(NotificationSuccess.REGISTER);
        } catch (error) {
            console.log(error);
        }
    }


    const handleRegisterPadCatalogue = async () => {
        try {
            setIsLoadingAction(true);
            const response = await registerPadCatalogue(
                new RegisterPadCatalogueRequest(
                    name, description, Number(price), type, Number(days), isActive,
                    Number(maxMembers), Number(maxAditionals)
                )
            ).unwrap();
            setName('');
            setDescription('');
            setPrice('')
            setMaxAditionals('')
            setMaxMembers('');
            setPadCatalogue(response);
            setIsLoadingAction(false);
            handleSucccessNotification(NotificationSuccess.REGISTER);
            setIsModalOpen(true);
        } catch (error) {
            setIsLoadingAction(false);
            handleErrorNotification(error);
        }
    }

    const handleUpdatePadCatalogue = async () => {
        try {
            setIsLoadingAction(true);
            const response = await updatePadCatalogue(
                new UpdatePadCatalogueRequest(
                    padCatalogue?.id ?? 0, name, description, Number(price), type, Number(days), isActive
                )
            ).unwrap();
            setPadCatalogue(response);
            setIsLoadingAction(false);
            handleSucccessNotification(NotificationSuccess.UPDATE);
        } catch (error) {
            setIsLoadingAction(false);
            handleErrorNotification(error);
        }
    }

    const handleDeleteComponent = async (id: any) => {
        try {
            setIsTableLoading(true);
            const response = await deletePadCatalogueComponent({
                'id': id,
                'padCatalogueId': padCatalogue?.id
            }).unwrap();
            setPadCatalogue(response);
            setComponents(padCatalogueDetailToDataTable(response));
            setIsTableLoading(false);
        } catch (error) {
            setIsTableLoading(false);
            handleErrorNotification(error);
        }
    }


    const buildCardTitle = (): string => {
        if (props.type == FormPadCatalogueType.REGISTER) {
            return Strings.formPad;
        } else {
            return Strings.formPadUpdate;
        }
    }

    const handleCheckForm = () => {
        if (props.type == FormPadCatalogueType.REGISTER) {
            handleRegisterPadCatalogue()
        } else {
            handleUpdatePadCatalogue();
        }
    }

    return (
        <LayoutCard
            isLoading={isLoadingCard}
            showBack={true}
            title={buildCardTitle()}
            content={
                <div className="flex flex-col">
                    <CustomFormInput value={name} label={Strings.nameLabel} onChange={(value) => setName(value)} icon={<RiUser4Line />} placeholder={Strings.nameLabel} />
                    <CustomFormInput value={description} label={Strings.description} onChange={(value) => setDescription(value)} isArea={true} placeholder="Pad para.." />
                    <CustomFormInput value={price} label={Strings.price} onChange={(value) => setPrice(value)} prefix="$" placeholder="0.0" />
                    <CustomFormInput value={days} label={Strings.durationDays} onChange={(value) => setDays(value)} placeholder="365" />
                    {type == 'grupal' && <div>
                        <CustomFormInput value={maxMembers} label={Strings.numberMembers} onChange={(value) => setMaxMembers(value)} placeholder="5" />
                        <CustomFormInput value={maxAditionals} label={Strings.numberAditionalMembers} onChange={(value) => setMaxAditionals(value)} placeholder="5" />
                    </div>}

                    <br />
                    <span>{Strings.status}</span>
                    <Checkbox 
                    className="ml-2 mt-2" 
                    checked={isActive} 
                    onChange={(event) => setIsActive(event.target.value)}>{Strings.statusActive}</Checkbox>
                    <br />

                    <span>{Strings.type}</span>
                    <Radio.Group className="ml-2 mt-2" onChange={(event) => setType(event.target.value)} value={type}>
                        <Space direction="vertical">
                            <Radio value={Strings.individualValue}>{Strings.individual}</Radio>
                            <Radio value={Strings.groupValue}>{Strings.group}</Radio>
                        </Space>
                    </Radio.Group>

                    <div className="flex flex-row items-end justify-end gap-4">
                        <Button disabled={padCatalogue == null} onClick={() => setIsModalOpen(true)} type="dashed">
                            {props.type == FormPadCatalogueType.REGISTER ? Strings.addComponents : Strings.updateComponents }
                        </Button>
                        <Button loading={isLoadingAction} onClick={handleCheckForm} type="primary">
                            {props.type == FormPadCatalogueType.REGISTER ? Strings.save : Strings.update}
                        </Button>
                    </div>


                    <Modal width={'85%'} title={Strings.components} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => setIsModalOpen(false)}>
                        <br />
                        <SelectSearch icon={<></>} placeholder={Strings.serviceType} items={serviceList} onChange={(event) => setService(event)} />
                        <div className="flex flex-row  gap-4 mt-4">
                            <CustomFormInput value={quantityPad} label={Strings.quantityPad} onChange={(value) => setQuantityPad(value)} prefix="#" />
                            <CustomFormInput value={quantityPatient} label={Strings.maxPatientQuantity} onChange={(value) => setQuantityPatient(value)} prefix="#" />
                            <CustomFormInput value={discount} label={Strings.discount} onChange={(value) => setDiscount(value)} prefix="%" />
                            <CustomFormInput value={discountTwo} label={Strings.discountTwo} onChange={(value) => setDiscountTwo(value)} prefix="%" />
                            <Button className="mt-8" type="primary" onClick={handleAddComponent}>{Strings.save}</Button>
                        </div>

                        <Table scroll={{ y: 300 }} loading={isTableLoading} className="mt-8" dataSource={components} columns={columns} />
                    </Modal>

                </div>

            }
        />
    );
}
export default FormPadCatalogue;