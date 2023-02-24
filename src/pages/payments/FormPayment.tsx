import { Button, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { RiUser3Line } from "react-icons/ri";
import useSessionStorage from "../../core/sessionStorage";
import { DEFAULT_PATIENTS_ACTIVE } from "../../data/filter/filters";
import { FilterEmployeesRequest } from "../../data/filter/filters.request";
import { PaymentMethod } from "../../data/payment/payment.method";
import { PaymentType } from "../../data/payment/payment.types";
import SelectItemOption from "../../data/select/select.item.option";
import { patientsToSelectItemOption } from "../../data/select/select.item.option.extensions";
import { useGetPaymentMethodsMutation } from "../../services/appointmentService";
import { useGetPatientsMutation } from "../../services/patientService";
import { useGetPaymentTypesMutation } from "../../services/paymentService";
import Constants from "../../utils/Constants";
import { handleErrorNotification } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import SelectSearch from "../components/SelectSearch";
import LayoutCard from "../layouts/LayoutCard";

const FormPayment = () => {
    const [getPaymentMethods] = useGetPaymentMethodsMutation();
    const [getPaymentTypes] = useGetPaymentTypesMutation();

    const [paymentMethodList, setPaymentMethodList] = useState<PaymentMethod[]>([]);
    const [paymentMethodId, setPaymentMethodId] = useState(0);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [amount, setAmount] = useState('');

    const [paymentTypesList, setPaymentTypesList] = useState<PaymentType[]>([]);

    const [getPatients] = useGetPatientsMutation();
    const [branchId, setBranchId] = useSessionStorage(
        Constants.BRANCH_ID,
        0
    );

    const [patientList, setPatientList] = useState<SelectItemOption[]>([]);
    const [patient, setPatient] = useState<SelectItemOption | undefined>();


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
            const filtered = response.filter((value: any, _: any) => value.originBranchOfficeId == Number(branchId))
            setPatientList(patientsToSelectItemOption(filtered));
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <LayoutCard
            isLoading={false}
            content={
                <div className="flex flex-col">

                    <div className="flex w-full items-end justify-end">
                        <Button type="primary" onClick={() => setIsOpenModal(true)}>Registrar Pagos / Abonos</Button>
                    </div>

                    <Modal title='Registr de pagos / abonos' open={isOpenModal} onCancel={() => setIsOpenModal(false)}>
                        <div className="flex flex-col">
                            <SelectSearch
                                placeholder={Strings.selectPatient}
                                items={patientList}
                                onChange={(value) => setPatient(value)}
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
                                    onChange={((event) => setAmount(event.target.value))}
                                    prefix={<></>}
                                    placeholder='10.00' />
                            </div>

                            <div className="flex flex-col">
                                <span className="flex mt-2">Tipo</span>
                                <Select style={{ minWidth: 250 }} size="large" placeholder={Strings.paymentMethod} onChange={(event) => setPaymentMethodId(event)}>
                                    {paymentTypesList.map((value, index) => <Select.Option key={index} value={value.id}>{value.name}</Select.Option>)}
                                </Select>
                            </div>
                        </div>
                    </Modal>

                </div>
            }
        />
    );
}

export default FormPayment;