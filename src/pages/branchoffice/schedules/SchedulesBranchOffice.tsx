import { Button, Card, Divider, Form, Input, InputNumber, Modal, Row, Select, Table, Tag, TimePicker } from "antd";
import { useEffect, useState } from "react";
import { RiDeleteBin7Line, RiMentalHealthLine, RiUserAddLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { DeleteScheduleRequest, GetSchedulesByBranchOfficeRequest, RegisterScheduleRequest } from "../../../data/branchoffice/branch.office.request";
import { branchOfficeSchedulesToDataTable, scheduleEmployeeOptionToRegisterSchedule } from "../../../data/branchoffice/branchoffice.extensions";
import { Employee } from "../../../data/employee/employee";
import { buildEmployeeName, employeesToSelectItemOptionsEmpty } from "../../../data/employee/employee.extentions";
import {  GetEmployeeByTypeRequest } from "../../../data/employee/employee.request";
import { DeleteEmpoyeeScheduleRequest } from "../../../data/schedule/schedule.request";
import SelectItemOption from "../../../data/select/select.item.option";
import { useDeleteBranchOfficeScheduleMutation, useGetSchedulesByBranchOfficeMutation, useRegisterBranchOfficeScheduleMutation } from "../../../services/branchOfficeService";
import { useDeleteEmployeeScheduleMutation, useGetEmployeesByTypeMutation, useRegisterEmployeeScheduleMutation } from "../../../services/employeeService";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../../utils/Notifications";
import Strings from "../../../utils/Strings";
import SelectSearch from "../../components/SelectSearch";
import LayoutCard from "../../layouts/LayoutCard";

const SchedulesBranchOffice = () => {
    const { id } = useParams();
    const [getSchedulesByBranchOffice, { isLoading }] = useGetSchedulesByBranchOfficeMutation();
    const [registerBranchOfficeSchedule] = useRegisterBranchOfficeScheduleMutation();
    const [deleteBranchOfficeSchedule] = useDeleteBranchOfficeScheduleMutation();
    const [getEmployeesByBranchOffice] = useGetEmployeesByTypeMutation();
    const [registerEmployeeSchedule] = useRegisterEmployeeScheduleMutation();
    const [deleteEmployeeSchedule] = useDeleteEmployeeScheduleMutation();
    const [times, setTimes] = useState<[string, string]>();
    const [data, setData] = useState<any[]>([]);
    const [form] = Form.useForm();
    const [dentistList, setDentistList] = useState<SelectItemOption[]>([]);
    const [dentist, setDentist] = useState<SelectItemOption>();
    const [schedule, setSchedule] = useState<any>();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        handleGetSchedules();
    }, []);


    const handleGetSchedules = async () => {
        try {
            const response = await getSchedulesByBranchOffice(
                new GetSchedulesByBranchOfficeRequest(id ?? '')
            ).unwrap();
            setData(branchOfficeSchedulesToDataTable(response));
            if (response.length > 0) {
                form.setFieldValue('seats', response[0].schedule.seat);
            }
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const columns = [
        {
            title: Strings.day,
            dataIndex: 'day',
            key: 'day',
        },
        {
            title: Strings.scheduleOpen,
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: Strings.scheduleClose,
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: Strings.dentists,
            dataIndex: 'employees',
            key: 'employees',
            render: (_: any, value: any) => {
                return (
                    <div className="flex flex-col flex-wrap">
                        {value.employees.length == 0 && <span className="text text-xs text-gray-600">{Strings.emptyDentist}</span>}
                        {value.employees.map((employee: Employee, index: number) =>
                            <div key={index} className="flex justify-between gap-6 m-2">
                                <span  className="text cursor-pointer text-xs text-blue-800">{buildEmployeeName(employee)}</span>
                                <span onClick={() => handleDeleteScheduleDentist(employee.id,value.key)} className="text text-xs text-red-500 cursor-pointer">Eliminar dentista</span>
                            </div>
                        )}
                    </div>
                )
            },
        },
        {
            title: Strings.actions,
            dataIndex: 'action',
            key: 'action',
            render: (_: any, value: any) => (
                <div key={value.key} className="flex flex-row gap-4 flex-wrap cursor-pointer justify-center">
                    <RiUserAddLine onClick={() => handleOnOpenModal(value)} size={20} />
                    <RiDeleteBin7Line size={20} onClick={() => handleDeleteBranchOfficeSchedule(value.key)} className="text text-red-600" />
                </div>
            ),
        },
    ];

    const handleDeleteScheduleDentist = async(employeeId: number, scheduleId: number) => {
        try {
            await deleteEmployeeSchedule(
                new DeleteEmpoyeeScheduleRequest(scheduleId, employeeId)
                ).unwrap();
            handleSucccessNotification(NotificationSuccess.SUCCESS_DELETE);
            handleGetSchedules();
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleRegistrerSchedule = async (values: any) => {
        try {
            await registerBranchOfficeSchedule(new RegisterScheduleRequest(
                id ?? '',
                values.day,
                times?.[0] ?? '',
                times?.[1] ?? '',
                values.seats
            )).unwrap();
            handleSucccessNotification(NotificationSuccess.REGISTER);
            form.resetFields();
            handleGetSchedules();
        } catch (error) {
            console.log(`Erroor ${error}`)
            handleErrorNotification(error);
        }
    }

    const handleDeleteBranchOfficeSchedule = async (id: any) => {
        try {
            await deleteBranchOfficeSchedule(new DeleteScheduleRequest(id)).unwrap();
            handleSucccessNotification(NotificationSuccess.SUCCESS_DELETE);
            handleGetSchedules();
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleOnOpenModal = (value: any) => {
        setSchedule(value);
        hanldeGetEmployees();
        setIsOpen(true);
    }

    const hanldeGetEmployees = async () => {
        try {
            const response = await getEmployeesByBranchOffice(
                new GetEmployeeByTypeRequest('Medico/Especialista')
            ).unwrap();
           setDentistList(employeesToSelectItemOptionsEmpty(response));
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleRegisterScheduleDentist = async () => {
        try {
            await registerEmployeeSchedule(
                scheduleEmployeeOptionToRegisterSchedule(Number(id), dentist?.id ?? 0, schedule.key)
            ).unwrap();
            setIsOpen(false);
            handleSucccessNotification(NotificationSuccess.REGISTER);
            handleGetSchedules();
        } catch (error) {
            handleErrorNotification(error);
        }

    }

    const buildScheduleTitle = (): string => {
        return `${schedule?.day} ${schedule?.startDate} - ${schedule?.endDate}`;
    }

    return (
        <LayoutCard
            title={Strings.schedulesBranchOffice}
            showBack={true}
            isLoading={false}
            content={
                <div className="flex flex-col max-w-full">
                    <Form form={form} onFinish={handleRegistrerSchedule} layout="inline">
                        <Row>
                            <Form.Item
                                label={Strings.day}
                                name='day'
                                style={{ minWidth: 200, padding: 5 }}
                                rules={[{ required: true, message: Strings.requiredField }]}
                            >
                                <Select placeholder={Strings.selectDay}>
                                    <Select.Option value={Strings.monday}>{Strings.monday}</Select.Option>
                                    <Select.Option value={Strings.tuesday}>{Strings.tuesday}</Select.Option>
                                    <Select.Option value={Strings.wednesday}>{Strings.wednesday}</Select.Option>
                                    <Select.Option value={Strings.thursday}>{Strings.thursday}</Select.Option>
                                    <Select.Option value={Strings.friday}>{Strings.friday}</Select.Option>
                                    <Select.Option value={Strings.saturday}>{Strings.saturday}</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label={Strings.schedule}
                                rules={[{ required: true, message: Strings.requiredField }]}
                                style={{ minWidth: 180, padding: 5 }}
                            >
                                <TimePicker.RangePicker onChange={(_, events) => setTimes(events)} style={{ minWidth: 180, }} />
                            </Form.Item>

                            <Form.Item name='seats' label={Strings.seats}
                                style={{ padding: 5 }}
                                rules={[{ required: true, message: Strings.requiredField }]}>
                                <Input type="number" />
                            </Form.Item>

                            <Form.Item style={{ marginTop: 6 }}>
                                <Button htmlType="submit" type="primary">{Strings.save}</Button>
                            </Form.Item>
                        </Row>
                    </Form>

                    <Divider />

                    <Table loading={isLoading} className="mt-8" dataSource={data} columns={columns} />



                    <Modal title={`${Strings.schedule} ${buildScheduleTitle()}`} open={isOpen} onCancel={() => setIsOpen(false)} okText={Strings.save} onOk={() => handleRegisterScheduleDentist()}>
                        <SelectSearch
                            placeholder={Strings.selectDentist}
                            items={dentistList}
                            onChange={(value) => setDentist(value)}
                            icon={<RiMentalHealthLine />} />

                    </Modal>

                </div>
            }
        />

    );
}


export default SchedulesBranchOffice;
