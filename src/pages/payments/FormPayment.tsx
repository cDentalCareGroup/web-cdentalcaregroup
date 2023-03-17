import { Button, Divider, Input, Modal, Select } from "antd";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { RiUser3Line } from "react-icons/ri";
import useSessionStorage from "../../core/sessionStorage";
import { DEFAULT_PATIENTS_ACTIVE } from "../../data/filter/filters";
import { FilterEmployeesRequest } from "../../data/filter/filters.request";
import { Patient } from "../../data/patient/patient";
import { buildPatientName } from "../../data/patient/patient.extensions";
import { Payment } from "../../data/payment/payment";
import { PaymentInfo, DebtInfo } from "../../data/payment/payment.info";
import { PaymentMethod } from "../../data/payment/payment.method";
import { PaymentType } from "../../data/payment/payment.types";
import SelectItemOption from "../../data/select/select.item.option";
import { patientsToSelectItemOption, patientToSelectItemOption } from "../../data/select/select.item.option.extensions";
import { useGetPaymentMethodsMutation } from "../../services/appointmentService";
import { useGetPatientsMutation } from "../../services/patientService";
import { useGetPatientPaymentsMutation, useGetPaymentTypesMutation, useRegisterPatientMovementMutation } from "../../services/paymentService";
import Constants from "../../utils/Constants";
import { formatPrice, formatServiceDate } from "../../utils/Extensions";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import SectionElement from "../components/SectionElement";
import SelectSearch from "../components/SelectSearch";
import LayoutCard from "../layouts/LayoutCard";


interface FormPaymentProps {
    source: FormPaymentSource;
    patient?: Patient;
    onClick?: () => void;
    onFinish?: () => void;
}

export enum FormPaymentSource {
    FORM, APPOINTMENT
}


const FormPayment = (props: FormPaymentProps) => {
    const [getPaymentMethods] = useGetPaymentMethodsMutation();
    const [getPaymentTypes] = useGetPaymentTypesMutation();
    const [registerPatientMovement] = useRegisterPatientMovementMutation();

    const [paymentMethodList, setPaymentMethodList] = useState<PaymentMethod[]>([]);
    const [paymentMethodId, setPaymentMethodId] = useState<number | undefined>(0);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [amount, setAmount] = useState('');

    const [paymentTypesList, setPaymentTypesList] = useState<PaymentType[]>([]);
    const [paymentTypeId, setPaymentTypeId] = useState<number | undefined>(0);

    const [getPatients] = useGetPatientsMutation();
    const [branchId, setBranchId] = useSessionStorage(
        Constants.BRANCH_ID,
        0
    );

    const [patientList, setPatientList] = useState<SelectItemOption[]>([]);
    const [patient, setPatient] = useState<SelectItemOption | undefined>();
    const [getPatientPayments] = useGetPatientPaymentsMutation();
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>();
    const [showDebts, setShowDebts] = useState(false);
    const [debtsInfo, setDebtsInfo] = useState<DebtInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        console.log(`Loading payment data..`)
        handleGetPaymentMethods();
        handleGetPaymentTypes();
        if (props.source == FormPaymentSource.FORM) {
            handleGetPatients();
        } else if (props.patient != null) {
            handleGetPatientPayments(props?.patient?.id ?? 0);
            setPaymentMethodId(undefined);
            setPaymentTypeId(undefined);
            setPatient(patientToSelectItemOption(props.patient));
        }
    }, []);


    const handleGetPaymentMethods = async () => {
        try {
            const response = await getPaymentMethods({}).unwrap();
            setPaymentMethodList(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleGetPaymentTypes = async () => {
        try {
            const response = await getPaymentTypes({}).unwrap();
            setPaymentTypesList(response);
            setShowDebts(true);
        } catch (error) {
            handleErrorNotification(error);
        }
    }


    const handleGetPatients = async () => {
        try {
            const response = await getPatients(
                new FilterEmployeesRequest(DEFAULT_PATIENTS_ACTIVE)
            ).unwrap();
            //const filtered = response.filter((value: any, _: any) => value.originBranchOfficeId == Number(branchId))
            setPatientList(patientsToSelectItemOption(response));
        } catch (error) {
            console.log(error);
        }
    }

    const handleGetPatientPayments = async (patientId: number) => {
        try {
            const response = await getPatientPayments({
                'patientId': patientId
            }).unwrap();
            console.log(response);
            setPaymentInfo(response);
            setDebtsInfo(response?.debts ?? []);
        } catch (error) {
            console.log(error);
        }
    }

    const handleRegisterPatientPayment = async () => {
        try {
            if (checkDebts()) {
                handleErrorNotification(Constants.SET_TEXT, `Debes aplicar el pago a las cuentas por cobrar`);
                return;
            }

            if (hasDebts() && paymentTypesList.find((value, _) => value.id == paymentTypeId)?.name.toLowerCase() == 'anticipo') {
                handleErrorNotification(Constants.SET_TEXT, `Debes cubrir el saldo pendiente antes de agregar un anticipo`)
                return;
            }

            if (paymentTypesList.find((value, _) => value.id == paymentTypeId)?.name.toLowerCase() == 'pago' && !hasDebts()) {
                handleErrorNotification(Constants.SET_TEXT, `No puedes realizar un pago si el paciente no tiene saldo pendiente por cobrar`)
                return;
            }
            if (patient?.id == null || patient?.id == undefined || patient?.id == 0) {
                handleErrorNotification(Constants.SET_TEXT, `Error en la información del paciente, por favor refresca la página`);
                return;
            }
            setIsLoading(true);
            await registerPatientMovement(
                {
                    'patientId': patient?.id ?? 0,
                    'paymentMethodId': paymentMethodId,
                    'amount': Number(amount),
                    'movementType': paymentTypeId,
                    'debts': debtsInfo.filter((value, _) => value.debt.isAplicable == true)
                }
            ).unwrap();
            handleSucccessNotification(NotificationSuccess.REGISTER);
            if (props.onFinish != null) {
                props.onFinish();
            }
            resetModalParams();
        } catch (error) {
            resetModalParams();
            handleErrorNotification(error);
        }
    }
    const resetModalParams = () => {
        setPatient(undefined);
        setPaymentMethodId(undefined);
        setPaymentTypeId(undefined);
        setPaymentInfo(undefined);
        setAmount('');
        setShowDebts(false);
        setDebtsInfo([]);
        setIsLoading(false);
        setIsOpenModal(false);
    }

    const handleOnApplyPayment = (item: DebtInfo, type: string) => {
        const totalDebts = debtsInfo.filter((value, _) => value.debt.isAplicable == true)
            .map((value, _) => Number(value.amountDebt)).reduce((a, b) => a + b, 0);
        const totalApplicable = Number(amount) - totalDebts;

        console.log(`Total debts`, totalDebts)
        console.log(`Applicable amount `, totalApplicable)
        console.log(`Amount `, amount);
        console.log(`Debt `, item.amountDebt);

        if (Number(amount) <= 0) {
            handleErrorNotification(Constants.SET_TEXT, `El monto debe ser mayor a $0`)
            return;
        }
        var element = JSON.parse(JSON.stringify(item));

        if (type == 'apply') {
            element.debt.isAplicable = true;
            if (totalApplicable >= Number(item.amountDebt)) {
                element.debt.aplicableAmount = Number(item.amountDebt);
            } else {
                element.debt.aplicableAmount = totalApplicable;
            }

        } else {
            element.debt.isAplicable = null;
            element.debt.aplicableAmount = 0;
        }

        Object.preventExtensions(element);
        const result = debtsInfo.filter((value, _) => value.debt.id != item.debt.id);
        result.push(element);
        setDebtsInfo(result.sort((a, b) => a.debt.id - b.debt.id));
    }

    const resetDebts = () => {
        let debtsArray: DebtInfo[] = [];
        debtsInfo.forEach((value, _) => {
            var element = JSON.parse(JSON.stringify(value));
            element.debt.isAplicable = null;
            element.debt.aplicableAmount = 0;
            Object.preventExtensions(element);
            debtsArray.push(element);
        });
        setDebtsInfo(debtsArray.sort((a, b) => a.debt.id - b.debt.id));
    }

    const checkDebts = (): boolean => {
        const movement = paymentTypesList.find((value, _) => value.id == paymentTypeId);
        return debtsInfo.length > 0 &&
            movement != null && movement?.name.toLocaleLowerCase().includes('pago') &&
            debtsInfo.filter((value, _) => value.debt.isAplicable == true).length <= 0
    }

    const hasDebts = (): boolean => {
        return debtsInfo.length > 0;
    }

    const buildPaymentTitle = (): string => {
        if (props.source == FormPaymentSource.APPOINTMENT) {
            return `Transacciones de ${buildPatientName(props.patient)}`;
        } else {
            return `Transacciones`;
        }
    }

    return (
        <LayoutCard
            isLoading={false}
            content={
                <div className="flex flex-col">
                    <div className="flex w-full items-end justify-end">
                        <Button type="dashed" onClick={() => {
                            if (props.onClick != null) {
                                props?.onClick();
                            }
                            setIsOpenModal(true);
                        }}>Registrar Pagos / Abonos</Button>
                    </div>

                    <Modal confirmLoading={isLoading} afterClose={() => resetModalParams()} okText={Strings.save} title={buildPaymentTitle()} onOk={() => handleRegisterPatientPayment()} open={isOpenModal} onCancel={() => setIsOpenModal(false)}>
                        <div className="flex flex-col">
                            {props.source == FormPaymentSource.FORM && <SelectSearch
                                placeholder={Strings.selectPatient}
                                items={patientList}
                                onChange={(value) => {
                                    setPatient(value);
                                    handleGetPatientPayments(value.id);
                                }}
                                icon={<></>}
                                defaultValue={patient?.id}
                            />}
                            <div className="flex flex-col">
                                <span className="flex mt-2">{Strings.paymentMethod}</span>
                                <Select value={paymentMethodId} style={{ minWidth: 250 }} size="large" placeholder={Strings.paymentMethod} onChange={(event) => setPaymentMethodId(event)}>
                                    {paymentMethodList.map((value, index) => <Select.Option key={index} value={value.id}>{value.name}</Select.Option>)}
                                </Select>
                            </div>
                            <div className="flex flex-col">
                                <span className="flex mt-2">{Strings.receivedAmount}</span>
                                <Input addonBefore="$"
                                    size="large"
                                    value={amount}
                                    onChange={((event) => {
                                        setAmount(event.target.value);
                                        resetDebts()
                                    })}
                                    prefix={<></>}
                                    placeholder='10.00' />
                            </div>

                            <div className="flex flex-col">
                                <span className="flex mt-2">Tipo</span>
                                <Select value={paymentTypeId} style={{ minWidth: 250 }} size="large" placeholder={'Tipo'} onChange={(event) => {
                                    if (hasDebts() && paymentTypesList.find((value, _) => value.id == Number(event))?.name == 'anticipo') {
                                        handleErrorNotification(Constants.SET_TEXT, `Debes cubrir el saldo pendiente antes de agregar un anticipo`)
                                    } else {
                                        setPaymentTypeId(event);
                                    }
                                }}>
                                    {paymentTypesList.map((value, index) => <Select.Option key={index} value={value.id}>{value.name}</Select.Option>)}
                                </Select>
                            </div>

                            {showDebts && <div className="flex flex-col gap-2 mt-4 w-full items-start justify-start">
                                {debtsInfo.map((value, index) =>
                                    <div key={index} className="flex flex-row items-baseline justify-center gap-2">
                                        <SectionElement size="sm" label={`#${value.debt.id} Saldo por cobrar`} value={formatPrice(Number(value.amountDebt))} icon={<></>} />
                                        {(value.debt.isAplicable == null) && <Button onClick={() => handleOnApplyPayment(value, 'apply')} type="link">Aplicar</Button>}
                                        {(value.debt.isAplicable == true) && <Button onClick={() => handleOnApplyPayment(value, 'remove')} type="link">Quitar</Button>}
                                        <SectionElement size="sm" label={`Saldo aplicado`} value={formatPrice(Number(value.debt.aplicableAmount))} icon={<></>} />
                                    </div>
                                )}
                            </div>}
                        </div>
                    </Modal>
                </div>
            }
        />
    );
}

export default FormPayment;