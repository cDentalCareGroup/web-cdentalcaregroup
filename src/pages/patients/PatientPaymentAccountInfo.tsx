import { Collapse, Divider, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri";
import { getAppointmentStatus } from "../../data/appointment/appointment.extensions";
import { Patient } from "../../data/patient/patient";
import { buildPatientAddress, buildPatientName, buildPatientPhone, getDentist, getHasCabinet, getHasLabs } from "../../data/patient/patient.extensions";
import { PatientPaymentAccount, PatientPaymentInfo } from "../../data/patient/patient.payment.account";
import { useGetPatientPaymentAccountMutation } from "../../services/paymentService";
import Constants from "../../utils/Constants";
import { formatPrice, formatServiceDate } from "../../utils/Extensions";
import { handleErrorNotification } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import SectionElement from "../components/SectionElement";
import LayoutCard from "../layouts/LayoutCard"


interface PatientPaymentAccountProps {
    patient: Patient;
}

const PatientPaymentAccountInfo = (props: PatientPaymentAccountProps) => {

    const [getPatientPaymentAccount, { isLoading }] = useGetPatientPaymentAccountMutation();
    const [data, setData] = useState<PatientPaymentAccount[]>([]);

    useEffect(() => {
        handleGetPatientPaymentAccount()
    }, []);


    const handleGetPatientPaymentAccount = async () => {
        try {
            const response = await getPatientPaymentAccount({
                'patientId': props.patient.id
            }).unwrap();
            console.log(response);
            setData(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }


    const columns = [
        {
            title: 'Servicio',
            dataIndex: 'name',
            key: 'name',
            render: (_: any, value: any) => (
                <span className="text-sm font-semibold text-gray-500">{value.name}</span>
            ),
        },
        {
            title: 'Cantidad',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (_: any, value: any) => (
                <span className="text-sm font-normal text-gray-500">{value.quantity}</span>
            ),
        },
        {
            title: 'Precio Unitario',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            render: (_: any, value: any) => (
                <div key={value.key} className="flex flex-wrap cursor-pointer justify-center items-center">
                    <span className="text-sm font-normal text-gray-500">{formatPrice(value.unitPrice)}</span>
                </div>
            ),
        },
        {
            title: 'Sub total',
            dataIndex: 'subtotal',
            key: 'subtotal',
            render: (_: any, value: any) => (
                <div key={value.key} className="flex flex-wrap cursor-pointer justify-center items-center">
                    <span className="text-sm font-normal text-gray-500">{formatPrice(value.subtotal)}</span>
                </div>
            ),
        },
    ];


    const appointmentDetailToDataTable = (value: PatientPaymentAccount): any[] => {
        const dataTable: any[] = [];
        value.appointmentInfo.services?.forEach((value, index) => {
            dataTable.push({
                key: index,
                name: value.service.name,
                quantity: value.detail.quantity,
                unitPrice: value.detail.unitPrice,
                subtotal: value.detail.subTotal
            })
        });
        return dataTable;
    }

    const getPaymentStatus = (value: PatientPaymentAccount) => {
        if (value.paymentInfo?.payment.status == 'C') {
            return <Tag color='green'>Cuenta pagada</Tag>
        } else {
            return <Tag color='red'>Saldo por cobrar</Tag>
        }
    }

    const getPendingPayment = (value: PatientPaymentInfo): string => {
        if (value.payment.status == 'C') {
            return '$0'
        } else {
            const total = value.details.map((value, _) => Number(value.amount)).reduce((a, b) => a + b, 0)
            return formatPrice(total);
        }
    }


    const getStautsAppointment = ({ appointmentInfo }: PatientPaymentAccount): JSX.Element => {
        const { appointment } = appointmentInfo
        if (appointment.appointment.status == Constants.STATUS_ACTIVE) {
            return <Tag color="success">{`CITA ${getAppointmentStatus(appointment)}`}</Tag>
        }
        if (appointment.appointment.status == Constants.STATUS_PROCESS) {
            return <Tag color="blue">{`CITA EN ${getAppointmentStatus(appointment)}`}</Tag>
        }
        return <></>;
    }


    const getTotalPayments = (): string => {
        let totalPaid = 0;
        for (const item of data) {
            if (item.paymentInfo != null) {
                if (item.paymentInfo.payment.status == 'C') {
                    totalPaid += Number(item.paymentInfo.payment.amount);
                } else {
                    totalPaid += item.paymentInfo.details.map((value, _) => Number(value.amount)).reduce((a, b) => a + b, 0);
                }
            }
        }
        return formatPrice(totalPaid);
    }

    const getTotalDebts = (): string => {
        let totalPaid = 0;
        for (const item of data) {
            if (item.paymentInfo != null) {
                if (item.paymentInfo.payment.status == 'A') {
                    totalPaid += Number(item.paymentInfo.payment.amount) - item.paymentInfo.details.map((value, _) => Number(value.amount)).reduce((a, b) => a + b, 0);
                }
            }
        }
        return formatPrice(totalPaid);
    }

    return (
        <LayoutCard isLoading={isLoading}
            content={
                <div className="flex flex-col">
                    <SectionElement label={Strings.patientName} value={buildPatientName(props.patient)} icon={<></>} />
                    <SectionElement label={Strings.phoneNumber} value={buildPatientPhone(props.patient)} icon={<></>} />
                    <SectionElement label={Strings.address} value={buildPatientAddress(props.patient)} icon={<></>} />
                    <SectionElement label="Ingresos totales" value={getTotalPayments()} icon={<></>} />
                    <SectionElement label="Saldo por cobrar" value={getTotalDebts()} icon={<></>} />

                    <Divider>Información de cuenta</Divider>

                    <Collapse
                        bordered={false}
                        defaultActiveKey={['1']}
                        style={{ backgroundColor: '#fff' }}
                        expandIcon={({ isActive }) => isActive ? <RiArrowDownSLine /> : <RiArrowRightSLine />} >

                        {data.map(({ appointmentInfo, paymentInfo }, index) =>
                            <Collapse.Panel header={`Cita ${appointmentInfo.appointment.appointment.appointment}`} key={index} className="text font-semibold">
                                <div className="flex flex-col">
                                    <div className="flex flex-row gap-16 mb-8">
                                        <div className="flex flex-col">
                                            <SectionElement size="sm" label={Strings.dateAndTime} value={`${appointmentInfo.appointment.appointment.appointment} ${appointmentInfo.appointment.appointment.time}`} icon={<></>} />
                                            <SectionElement size="sm" label={Strings.branchOffice} value={appointmentInfo.appointment.branchOffice.name} icon={<></>} />
                                            <SectionElement size="sm" label={Strings.dentist} value={getDentist(appointmentInfo.appointment)} icon={<></>} />
                                        </div>

                                        <div className="flex flex-col">
                                            <SectionElement size="sm" label={Strings.labs} value={getHasLabs(appointmentInfo.appointment)} icon={<></>} />
                                            <SectionElement size="sm" label={Strings.cabinets} value={getHasCabinet(appointmentInfo.appointment)} icon={<></>} />
                                            <SectionElement size="sm" label="Monto de la cita" value={formatPrice(appointmentInfo.appointment.appointment.priceAmount)} icon={<></>} />
                                        </div>

                                    </div>
                                    {getStautsAppointment(data[index])}

                                    {paymentInfo != null && <div>
                                        <SectionElement size="sm" label={"Pago"} value={formatPrice(paymentInfo.payment.amount)} icon={<></>} />
                                        <SectionElement size="sm" label="Fecha de pago" value={formatServiceDate(paymentInfo.payment.createdAt)} icon={<></>} />
                                        <SectionElement size="sm" label="Saldo por cobrar" value={getPendingPayment(paymentInfo)} icon={<></>} />
                                        {getPaymentStatus(data[index])}
                                    </div>}
                                    <br />
                                    {appointmentInfo.services.length > 0 && <Table size="small" dataSource={appointmentDetailToDataTable(data[index])} columns={columns} />}
                                </div>
                            </Collapse.Panel>)}
                    </Collapse>
                </div>
            } />
    )
}

export default PatientPaymentAccountInfo;