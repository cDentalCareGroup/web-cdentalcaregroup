import { Button, Divider, Input, Modal, Select } from "antd";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { RiUser3Line } from "react-icons/ri";
import useSessionStorage from "../../core/sessionStorage";
import { DEFAULT_PATIENTS_ACTIVE } from "../../data/filter/filters";
import { FilterEmployeesRequest } from "../../data/filter/filters.request";
import { Payment } from "../../data/payment/payment";
import { PaymentInfo, DebtInfo } from "../../data/payment/payment.info";
import { PaymentMethod } from "../../data/payment/payment.method";
import { PaymentType } from "../../data/payment/payment.types";
import SelectItemOption from "../../data/select/select.item.option";
import { patientsToSelectItemOption } from "../../data/select/select.item.option.extensions";
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

const FormPayment = () => {
    const [getPaymentMethods] = useGetPaymentMethodsMutation();
    const [getPaymentTypes] = useGetPaymentTypesMutation();
    const [registerPatientMovement] = useRegisterPatientMovementMutation();

    const [paymentMethodList, setPaymentMethodList] = useState<PaymentMethod[]>([]);
    const [paymentMethodId, setPaymentMethodId] = useState(0);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [amount, setAmount] = useState('');

    const [paymentTypesList, setPaymentTypesList] = useState<PaymentType[]>([]);
    const [paymentTypeId, setPaymentTypeId] = useState(0);

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


    useEffect(() => {
        handleGetPaymentMethods();
        handleGetPaymentTypes();
        handleGetPatients();
    }, []);


    const handleGetPaymentMethods = async () => {
        try {
            const response = await getPaymentMethods({}).unwrap();
            console.log(response);
            setPaymentMethodList(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleGetPaymentTypes = async () => {
        try {
            const response = await getPaymentTypes({}).unwrap();
            console.log(response);
            setPaymentTypesList(response);
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
            setPaymentInfo(response);
            setDebtsInfo(response?.debts ?? []);
        } catch (error) {
            console.log(error);
        }
    }

    const handleRegisterPatientPayment = async () => {
        try {


            if (checkDebts()) {
                console.log('tiene deudas y quiere hacer pago')
                return;
            }

            console.log('all ok')
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
            resetModalParams();
        } catch (error) {
            handleErrorNotification(error);
        }
    }
    const resetModalParams = () => {
        setPatient(undefined);
        setPaymentMethodId(0);
        setPaymentTypeId(0);
        setPaymentInfo(undefined);
        setAmount('');
        setShowDebts(false);
        setIsOpenModal(false);
    }


    const handleCheckPaymentType = (id: number) => {
        const movement = paymentTypesList.find((value, _) => value.id == id);
        if (movement != null && movement?.name.toLocaleLowerCase().includes('pago')) {
            setShowDebts(true);
        }
    }

    const handleOnApplyPayment = (item: DebtInfo, type: string) => {
        const totalDebts = debtsInfo.filter((value, _) => value.debt.isAplicable == true)
            .map((value, _) => Number(value.amountDebt)).reduce((a, b) => a + b, 0);

        console.log(`Ttoal debts`, totalDebts)
        console.log(Number(amount));
        if (Number(amount) <= 0) {
            console.log('Arega cantidad');
            return;
        }
        var element = JSON.parse(JSON.stringify(item));
        if (type == 'apply' && Number(amount) >= Number(element.amountDebt) && (Number(amount) - totalDebts) >= Number(element.amountDebt)) {
            element.debt.isAplicable = true;
        } else {
            console.log('alert')
            element.debt.isAplicable = null;
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


    return (
        <LayoutCard
            isLoading={false}
            content={
                <div className="flex flex-col">

                    <div className="flex w-full items-end justify-end">
                        <Button type="primary" onClick={() => setIsOpenModal(true)}>Registrar Pagos / Abonos</Button>
                    </div>

                    <Modal afterClose={() => resetModalParams()} okText='Guardar' title='Transacciones' onOk={() => handleRegisterPatientPayment()} open={isOpenModal} onCancel={() => setIsOpenModal(false)}>
                        <div className="flex flex-col">
                            <SelectSearch
                                placeholder={Strings.selectPatient}
                                items={patientList}
                                onChange={(value) => {
                                    setPatient(value);
                                    handleGetPatientPayments(value.id);
                                }}
                                icon={<></>}
                                defaultValue={patient?.id}
                            />
                            <div className="flex flex-col">
                                <span className="flex mt-2">{Strings.paymentMethod}</span>
                                <Select style={{ minWidth: 250 }} size="large" placeholder={Strings.paymentMethod} onChange={(event) => setPaymentMethodId(event)}>
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
                                <Select style={{ minWidth: 250 }} size="large" placeholder={'Tipo'} onChange={(event) => {
                                    setPaymentTypeId(event);
                                    handleCheckPaymentType(event);
                                }}>
                                    {paymentTypesList.map((value, index) => <Select.Option key={index} value={value.id}>{value.name}</Select.Option>)}
                                </Select>
                            </div>

                            {showDebts && <div className="flex flex-col gap-2 mt-4 w-full items-start justify-start">
                                {debtsInfo.map((value, index) =>
                                    <div key={index} className="flex flex-row items-baseline justify-center gap-2">
                                        <SectionElement label={`#${value.debt.id} Saldo por cobrar`} value={formatPrice(Number(value.amountDebt))} icon={<></>} />
                                        {(value.debt.isAplicable == null) && <Button onClick={() => handleOnApplyPayment(value, 'apply')} type="link">Aplicar</Button>}
                                        {(value.debt.isAplicable == true) && <Button onClick={() => handleOnApplyPayment(value, 'remove')} type="link">Quitar</Button>}
                                    </div>
                                )}
                            </div>}

                            {/* {(paymentInfo != undefined && paymentInfo.deposits != null && paymentInfo.deposits.length > 0) && <div className="flex flex-col flex-wrap gap-2">
                                <Divider>Depositos</Divider>
                                {paymentInfo.deposits.map((value, index) => <SectionElement key={index} label={Strings.receivedAmount} value={`${formatPrice(value.amount)}, Fecha ${formatServiceDate(value.createdAt)}`} icon={<></>} />)}
                            </div>} */}

                            {/* {(paymentInfo != undefined && paymentInfo.debts != null && paymentInfo.debts.length > 0) && <div className="flex flex-col flex-wrap gap-2">
                                <Divider>Saldo por cobrar</Divider>
                                {paymentInfo.debts.map((value, index) => <SectionElement key={index} label={'Saldo por cobrar'} value={`${formatPrice(value.amountDebt)}, Fecha ${formatServiceDate(value.debt.createdAt)}`} icon={<></>} />)}
                            </div>} */}
                        </div>
                    </Modal>

                </div>
            }
        />
    );
}

export default FormPayment;