import { Button, Card, List, Modal, Radio, Space, Tag } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { RiMentalHealthLine, RiMoneyDollarCircleLine, RiServiceLine } from "react-icons/ri";
import SelectItemOption from "../../data/select/select.item.option";
import { serviceCategoriesToSelectItemOption } from "../../data/select/select.item.option.extensions";
import { Service } from "../../data/service/service";
import { RegisterServiceRequest, UpdateServiceRequest } from "../../data/service/service.request";
import { useGetServiceCategoriesMutation, useGetServicesMutation, useRegisterServiceMutation, useUpdateServiceMutation } from "../../services/padService";
import { RESPONSIVE_LIST, RESPONSIVE_LIST_SMALL } from "../../utils/Extensions";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import CustomFormInput from "../components/CustomFormInput";
import SectionElement from "../components/SectionElement";
import SelectSearch from "../components/SelectSearch";
import LayoutCard from "../layouts/LayoutCard";

const Services = () => {

    const [getServices, { isLoading }] = useGetServicesMutation();
    const [getServiceCategories] = useGetServiceCategoriesMutation();
    const [registerService] = useRegisterServiceMutation();
    const [updateService] = useUpdateServiceMutation();
    const [data, setData] = useState<Service[]>([]);
    const [serviceList, setServiceList] = useState<Service[]>([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [categories, setCategories] = useState<SelectItemOption[]>([]);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState<SelectItemOption>();
    const [status, setStatus] = useState('activo');
    const [isEdit, setIsEdit] = useState(false);
    const [serviceId, setServiceId] = useState(0);


    useEffect(() => {
        handleGetServices();
        handleGetServiceCategories();
    }, []);


    const handleGetServices = async () => {
        try {
            const response = await getServices({}).unwrap();
            setData(response);
            setServiceList(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleGetServiceCategories = async () => {
        try {
            const response = await getServiceCategories({}).unwrap();
            setCategories(serviceCategoriesToSelectItemOption(response));
        } catch (error) {
            handleErrorNotification(error);
        }
    }


    const handleOnSearch = (query: string) => {
        if (query.length == 0 || query == "") {
            setServiceList(data);
        }
        const res = data?.filter((value) =>
            value.name
                .toLowerCase()
                .replace(/\s+/g, '')
                .includes(query.toLowerCase().replace(/\s+/g, '')));
        setServiceList(res);
    }


    const handleOnRegisterService = async () => {
        try {
            await registerService(
                new RegisterServiceRequest(
                    name, Number(price), category?.id ?? 0
                )
            ).unwrap();
            handleSucccessNotification(NotificationSuccess.REGISTER);
            setIsOpenModal(false);
            handleGetServices();
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleOnOpenModal = (service: Service) => {
        setName(service.name);
        setPrice(`${service.price ?? 0}`);
        const categoryValue = categories.find((value, _) => value.id == service.categoryId);
        setCategory(categoryValue);
        setIsEdit(true);
        setServiceId(service.id);
        setTimeout(() => {
            setIsOpenModal(true);
        }, 100)
    }


    const validateForm = () => {
        if (isEdit) {
            handleOnUpdateService();
        } else {
            handleOnRegisterService()
        }
    }


    const handleOnUpdateService = async () => {
        try {
            await updateService(
                new UpdateServiceRequest(
                    serviceId,
                    name, Number(price), category?.id ?? 0, status
                )
            ).unwrap();
            handleSucccessNotification(NotificationSuccess.UPDATE);
            setIsOpenModal(false);
            handleGetServices();
        } catch (error) {
            handleErrorNotification(error);
        }
    }


    const getStautsTag = (service: Service): JSX.Element => {
        if (service.status != null && service.status == 'activo') {
            return <Tag color="success">{service.status}</Tag>
        }
        if (service.status != null && service.status == 'inactivo') {
            return <Tag color="error">{service.status}</Tag>
        }
        return <></>;
    }

    return (
        <LayoutCard
            isLoading={isLoading}
            content={
                <div className="flex flex-col">
                    <Search onChange={(event) => handleOnSearch(event.target.value)} size="large" placeholder={'Buscar servicios'} onSearch={handleOnSearch} enterButton />
                    <div className="flex w-full items-end justify-end mt-4 mb-12">
                        <Button type="primary" onClick={() => setIsOpenModal(true)}>{'Registrar servicio'}</Button>
                    </div>
                    <List
                        grid={RESPONSIVE_LIST}
                        dataSource={serviceList}
                        renderItem={(value, index) => (
                            <List.Item>
                                <Card key={index} title={value.name} className="m-2 cursor-pointer" actions={[
                                    <span onClick={() => handleOnOpenModal(value)}>Editar</span>
                                ]}>
                                    <SectionElement label={Strings.nameLabel} value={value.name} icon={<RiServiceLine />} />
                                    <SectionElement label={Strings.price} value={`$${value.price ?? 0}`} icon={<RiMoneyDollarCircleLine />} />
                                    {getStautsTag(value)}
                               </Card>
                            </List.Item>
                        )}
                    />

                    <Modal
                        onOk={() => validateForm()}
                        title={isEdit ? 'Actualizar servicio' : 'Registro de serivicio'}
                        okText={isEdit ? 'Actualizar' : 'Guardar'}
                        open={isOpenModal}
                        onCancel={() => setIsOpenModal(false)}>
                        <CustomFormInput value={name} label={Strings.nameLabel} onChange={(value) => setName(value)} placeholder="Consulta general" />
                        <CustomFormInput value={price} label={Strings.price} onChange={(value) => setPrice(value)} prefix="$" placeholder="0.0" />

                        <span className="flex mt-2 mb-2">Selecciona una categoria</span>
                        <SelectSearch
                            placeholder="Selecciona una categoria"
                            items={categories}
                            onChange={(event) => setCategory(event)}
                            icon={<></>}
                            defaultValue={category?.id}
                        />
                        {isEdit && <div>
                            <span className="flex mt-2 mb-2">Estatus</span>
                            <Radio.Group className="ml-2 mt-2" onChange={(event) => setStatus(event.target.value)} value={status}>
                                <Space direction="vertical">
                                    <Radio value={'activo'}>Activo</Radio>
                                    <Radio value={'inactivo'}>Inactivo</Radio>
                                </Space>
                            </Radio.Group>
                        </div>}
                    </Modal>
                </div>
            }
        />
    );
}

export default Services;