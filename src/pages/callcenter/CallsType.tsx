import { Button, Card, Form, Input, List, Modal } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";
import { CallCatalog } from "../../data/call/call.catalog";
import { RegisterCatalogRequest, UpdateCatalogRequest } from "../../data/call/call.request";
import { useGetCatalogsMutation, useRegisterCatalogMutation, useUpdateCatalogMutation } from "../../services/callService";
import { RESPONSIVE_LIST } from "../../utils/Extensions";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import SectionColElement from "../components/SectionColElement";
import LayoutCard from "../layouts/LayoutCard";

enum FormCallsType {
    REGISTER, UPDATE
}
const CallsType = () => {
    const [getCatalogs, { isLoading }] = useGetCatalogsMutation();
    const [updateCatalog] = useUpdateCatalogMutation();
    const [registerCatalog] = useRegisterCatalogMutation();

    const [data, setData] = useState<CallCatalog[]>([]);
    const [catalogs, setCatalogs] = useState<CallCatalog[]>([]);
    const [catalog, setCatalog] = useState<CallCatalog>();
    const [formType, setFormType] = useState(FormCallsType.UPDATE);

    const [isOpen, setIsOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        handleGetCallCatalogs();
    }, []);

    const handleGetCallCatalogs = async () => {
        try {
            const response = await getCatalogs({}).unwrap();
            setCatalogs(response);
            setData(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }


    const handleSetValues = (catalog: CallCatalog) => {
        form.setFieldValue('name', catalog.name);
        form.setFieldValue('description', catalog.description);
        form.setFieldValue('goal', catalog.goal);
        form.setFieldValue('script', catalog.script);
        setCatalog(catalog);
        setFormType(FormCallsType.UPDATE);
        setIsOpen(true);
    }

    const hadleUpdateCatalog = async () => {
        try {
            await updateCatalog(new UpdateCatalogRequest(catalog?.id ?? 0, form.getFieldsValue())).unwrap();
            handleSucccessNotification(NotificationSuccess.UPDATE);
            setIsOpen(false);
            handleGetCallCatalogs();
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const hadleRegisterCatalog = async () => {
        try {
            await registerCatalog(new RegisterCatalogRequest(form.getFieldsValue())).unwrap();
            handleSucccessNotification(NotificationSuccess.UPDATE);
            setIsOpen(false);
            handleGetCallCatalogs();
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const validateFormType = () => {
        if (formType == FormCallsType.UPDATE) {
            hadleUpdateCatalog()
        } else {
            hadleRegisterCatalog();
        }
    }

    const handleOnSearch = (query: string) => {
        if (query.length == 0 || query == "") {
            setCatalogs(data);
        }
        const res = data?.filter((value) =>
            value.name
                .toLowerCase()
                .replace(/\s+/g, '')
                .includes(query.toLowerCase().replace(/\s+/g, '')));
        setCatalogs(res);
    }

    return (<LayoutCard
        title={Strings.callTypes}
        isLoading={isLoading}
        content={
            <div className="flex flex-col">
                <Search onChange={(event) => handleOnSearch(event.target.value)} size="large" placeholder={Strings.searchCallTypes} onSearch={handleOnSearch} enterButton />
                <div className="flex w-full items-end justify-end mt-4 mb-12">
                    <Button type="primary" onClick={() => {
                        form.resetFields();
                        setFormType(FormCallsType.REGISTER);
                        setIsOpen(true);
                    }}>{Strings.registerCallType}</Button>
                </div>
                <List
                    grid={RESPONSIVE_LIST}
                    dataSource={catalogs}
                    renderItem={(item) => (
                        <List.Item >
                            <Card actions={[
                                <Button onClick={() => handleSetValues(item)}>{Strings.edit}</Button>
                            ]} title={item.name}>
                                <SectionColElement label={Strings.description} value={item.description} />
                                <SectionColElement label={Strings.script} value={item.script} />
                            </Card>
                        </List.Item>
                    )}
                />

                <Modal
                    open={isOpen}
                    onOk={() => validateFormType()}
                    onCancel={() => setIsOpen(false)}
                    title={formType == FormCallsType.UPDATE ? Strings.updateCallType : Strings.registerCallType}
                    okText={formType == FormCallsType.UPDATE ? Strings.update : Strings.save}>
                    <Form form={form} layout="vertical" >
                        <Form.Item
                            name="name"
                            label={Strings.simpleName}
                            rules={[{ required: true, message: Strings.requiredField }]}>
                            <Input size="large" placeholder={Strings.simpleName} />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label={Strings.description}
                            rules={[{ required: true, message: Strings.requiredField }]}>
                            <Input.TextArea size="large" placeholder={Strings.description} />
                        </Form.Item>
                        <Form.Item
                            name="goal"
                            label={Strings.goal}
                            rules={[{ required: true, message: Strings.requiredField }]}>
                            <Input size="large" placeholder={Strings.goal} />
                        </Form.Item>
                        <Form.Item
                            name="script"
                            label={Strings.script}
                            rules={[{ required: true, message: Strings.requiredField }]}>
                            <Input.TextArea rows={6} size="large" placeholder={Strings.script} />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        }
    />);
}
export default CallsType;