import { Button, Card, List, Modal, Radio, Space, Tag } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import {  RiMoneyDollarCircleLine, RiServiceLine } from "react-icons/ri";
import SelectItemOption from "../../data/select/select.item.option";
import { serviceCategoriesToSelectItemOption } from "../../data/select/select.item.option.extensions";
import { Service } from "../../data/service/service";
import { RegisterServiceRequest, UpdateServiceRequest } from "../../data/service/service.request";
import { useGetAllServicesMutation, useGetServiceCategoriesMutation, useRegisterServiceMutation, useUpdateServiceMutation } from "../../services/padService";
import { RESPONSIVE_LIST } from "../../utils/Extensions";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import CustomFormInput from "../components/CustomFormInput";
import SectionElement from "../components/SectionElement";
import SelectSearch from "../components/SelectSearch";
import LayoutCard from "../layouts/LayoutCard";

const Services = () => {

    const [getServices, { isLoading }] = useGetAllServicesMutation();
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
            setIsEdit(false);
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
        setStatus(service.status);
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
        if (service.status != null && service.status == Strings.statusValueActive) {
            return <Tag color="success">{Strings.statusActive}</Tag>
        } else {
            return <Tag color="error">{Strings.statusInactive}</Tag>
        }
    }
    const handleOnRegisterOpenModal = () => {
        setName('');
        setPrice('');
        setCategory(undefined);
        setIsEdit(false);
        setServiceId(0);
        setStatus('');
        setTimeout(() => {
            setIsOpenModal(true);
        }, 100)
    }

    return (
        <LayoutCard
        title={Strings.services}
            isLoading={isLoading}
            content={
                <div className="flex flex-col">
                    <Search onChange={(event) => handleOnSearch(event.target.value)} size="large" placeholder={Strings.searchService} onSearch={handleOnSearch} enterButton />
                    <div className="flex w-full items-end justify-end mt-4 mb-12">
                        <Button type="primary" onClick={() => handleOnRegisterOpenModal()}>{Strings.registerService}</Button>
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
                        title={isEdit ? Strings.formServiceUpdate : Strings.formService}
                        okText={isEdit ? Strings.update : Strings.save}
                        open={isOpenModal}
                        onCancel={() => setIsOpenModal(false)}>
                        <CustomFormInput value={name} label={Strings.nameLabel} onChange={(value) => setName(value)} placeholder={Strings.generalInquiry} />
                        <CustomFormInput value={price} label={Strings.price} onChange={(value) => setPrice(value)} prefix="$" placeholder="0.0" />

                        <span className="flex mt-2 mb-2">{Strings.selectCategory}</span>
                        <SelectSearch
                            placeholder={Strings.selectCategory}
                            items={categories}
                            onChange={(event) => setCategory(event)}
                            icon={<></>}
                            defaultValue={category?.id}
                        />
                        {isEdit && <div>
                            <span className="flex mt-2 mb-2">{Strings.status}</span>
                            <Radio.Group className="ml-2 mt-2" onChange={(event) => setStatus(event.target.value)} value={status}>
                                <Space direction="vertical">
                                    <Radio value={Strings.statusValueActive}>{Strings.statusActive}</Radio>
                                    <Radio value={Strings.statusValueInactive}>{Strings.statusInactive}</Radio>
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