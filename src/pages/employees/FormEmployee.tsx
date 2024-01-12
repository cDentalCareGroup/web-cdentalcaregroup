import { Button, DatePicker, Divider, Form, Input, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { RiHashtag, RiLockLine, RiMailLine, RiMap2Line, RiMapPin2Line, RiMapPin3Line, RiMapPin5Line, RiPhoneLine, RiProfileLine, RiUser3Line } from "react-icons/ri";
import { Colony } from "../../data/address/colonies";
import { BranchOffice } from "../../data/branchoffice/branchoffice";
import { Employee } from "../../data/employee/employee";
import { RegisterEmployeeRequest, UpdateEmployeeRequest } from "../../data/employee/employee.request";
import { EmployeeType } from "../../data/employee/employee.types";
import { Latitudes } from "../../data/maps/latitudes";
import { Role } from "../../data/user/role";
import { useGetBranchOfficesMutation } from "../../services/branchOfficeService";
import { useGetEmployeeRolesMutation, useGetEmployeeTypesMutation, useRegisterEmployeeMutation, useUpdateEmployeeMutation } from "../../services/employeeService";
import { useGetColoniesFromZipCodeMutation } from "../../services/patientService";
import { capitalizeAllCharacters } from "../../utils/Extensions";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import LayoutCard from "../layouts/LayoutCard";
import {LOAD_DATA_DELAY} from "../../utils/Constants";

interface FormEmployeeProps {
    type: FormEmployeeType;
    employee?: Employee;
}
export enum FormEmployeeType {
    REGISTER, UPDATE
}

const FormEmployee = (props: FormEmployeeProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const [colonies, setColonies] = useState<Colony[]>([]);
    const [colony, setColony] = useState<Colony>();
    const [form] = Form.useForm();
    const [latitudes, setLatitudes] = useState<Latitudes>();
    const [typeList, setTypeList] = useState<EmployeeType[]>([]);
    const [getEmployeeTypes] = useGetEmployeeTypesMutation();
    const [getColoniesFromZipCode] = useGetColoniesFromZipCodeMutation();
    const [registerEmployee] = useRegisterEmployeeMutation();
    const [updateEmployee] = useUpdateEmployeeMutation();
    const [showNormalInputs, setShowNormalInputs] = useState(false);
    const [getBranchOffices] = useGetBranchOfficesMutation();
    const [branchOfficeList, setBranchOfficeList] = useState<BranchOffice[]>([]);
    const [getEmployeeRoles] = useGetEmployeeRolesMutation();
    const [roleList, setRoleList] = useState<Role[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setTimeout(async () => {
                    await handleGetEmployeeTypes();
                    await handleGetBranchOffices();
                    await handleGetRoles();
                    if (props.type === FormEmployeeType.UPDATE) {
                        handleSetupValues();
                    }
                    setIsLoading(false); 
                }, LOAD_DATA_DELAY);
            } catch (error) {
                setIsLoading(false); 
                handleErrorNotification(error);
            }
        };
        fetchData();
    }, []);

    const handleGetRoles = async () => {
        try {
            const response = await getEmployeeRoles({}).unwrap();
            setRoleList(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleGetEmployeeTypes = async () => {
        try {
            const response = await getEmployeeTypes({}).unwrap();
            setTypeList(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleGetBranchOffices = async () => {
        try {
            const response = await getBranchOffices({}).unwrap();
            setBranchOfficeList(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }


    const handleSetupValues = () => {
        form.setFieldValue('name', props.employee?.name);
        form.setFieldValue('lastname', props.employee?.lastname);
        form.setFieldValue('secondLastname', props.employee?.secondLastname);
        form.setFieldValue('gender', props.employee?.gender);
        form.setFieldValue('phone', props.employee?.primaryContact);
        form.setFieldValue('email', props.employee?.email);
        form.setFieldValue('street', props.employee?.street);
        form.setFieldValue('streetNumber', props.employee?.number);
        form.setFieldValue('zipCode', props.employee?.cp);
        form.setFieldValue('colony', props.employee?.colony);
        form.setFieldValue('city', props.employee?.city);
        form.setFieldValue('state', props.employee?.state);
        form.setFieldValue('branchOffice', props.employee?.branchOfficeId);
        form.setFieldValue('contractType', props.employee?.jobScheme);
        form.setFieldValue('employeeType', props.employee?.typeId);
        form.setFieldValue('rfc', props.employee?.rfc);
        form.setFieldValue('nss', props.employee?.nss);
        form.setFieldValue('username', props.employee?.user);
        form.setFieldValue('email', props.employee?.email);
        form.setFieldValue('birthday', dayjs(props.employee?.birthDay, 'YYYY-MM-DD'));
    }


    const getColoniesFromPostalCode = async (cp: string) => {
        try {
            form.resetFields(['colony', 'city', 'state']);
            setColonies([]);
            if (cp.length < 5) return
            const response = await getColoniesFromZipCode({ cp: cp }).unwrap();
            if (response.neighborhood != null && response.neighborhood.colonies != null) {
                setColonies(response.neighborhood?.colonies);
                setShowNormalInputs(false);
            } else {
                setShowNormalInputs(true);
            }
        } catch (error) {
            setShowNormalInputs(true);
        }
    }

    const googleApiFetchColony = async (colony: string) => {
        try {
            const response = await fetch(
                `https://maps.google.com/maps/api/geocode/json?address=${colony}&key=AIzaSyDB5WyzdGWnx3JspWuwTmdKN0TURq8QIBA`,
                {
                    method: "GET"
                }
            ).then((response) => response.json().catch((error) => error));
            console.log(response);
            if (response.status === "OK" && response.results.length > 0) {

                const address = response.results[0];
                const lat = address.geometry.location.lat;
                const lng = address.geometry.location.lng;
                setLatitudes(new Latitudes(lat, lng));
            }
            if (response.status == 'ZERO_RESULTS') {
                setLatitudes(new Latitudes(0, 0));
            }
            // return [];
        } catch (error) {
            console.error(`Failed to get addrress from ${colony}, ${error}`);
            //  return [];
        }
    };

    const handleOnColonyChange = async (value: any) => {
        const colony = colonies?.find((_, index) => Number(value) == index);
        if (colony != null) {
            if (colony.stateCities != null && colony.stateCities.length > 0) {
                if (colony.stateCities[0].cities != null) {
                    form.setFieldValue('city', capitalizeAllCharacters(colony.stateCities[0].cities[0]));
                }
                form.setFieldValue('state', capitalizeAllCharacters(colony.stateCities[0].state));
            }
            setColony(colony);
            googleApiFetchColony(colony.colony ?? '');
        }
    }


    const handleRegisterEmployee = async (values: any) => {
        let col = '';
        let city = '';
        let state = '';
        if (colony != null && colony != undefined) {
            col = capitalizeAllCharacters(colony.colony);
            city = capitalizeAllCharacters(colony.county?.toLowerCase());
            if (colony.stateCities) {
                state = capitalizeAllCharacters(colony.stateCities[0].state?.toLocaleLowerCase());
            }
        } else {
            col = values.colony;
            city = values.city;
            state = values.state;
        }
        try {
            setIsLoading(true);
            await registerEmployee(
                new RegisterEmployeeRequest(
                    values,
                    latitudes!,
                    values.branchOffice,
                    city, col, state
                )).unwrap();
            form.resetFields();
            setIsLoading(false);
            handleSucccessNotification(NotificationSuccess.REGISTER);
            setShowNormalInputs(false);
        } catch (error) {
            setIsLoading(false);
            handleErrorNotification(error);
        }
    }


    const shouldShowBack = (): boolean => {
        return props.type == FormEmployeeType.REGISTER;
    }

    const buildCardTitle = (): string => {
        return props.type == FormEmployeeType.REGISTER ? Strings.formEmployees : ''
    }

    const handleCheckForm = (values: any) => {
        if (props.type == FormEmployeeType.REGISTER) {
            handleRegisterEmployee(values);
        } else {
            handleUpdateEmployee(values);
        }
    }

    const handleUpdateEmployee = async (values: any) => {
        let col = '';
        let city = '';
        let state = '';
        if (colony != null && colony != undefined) {
            col = capitalizeAllCharacters(colony.colony);
            city = capitalizeAllCharacters(colony.county?.toLowerCase());
            if (colony.stateCities) {
                state = capitalizeAllCharacters(colony.stateCities[0].state?.toLocaleLowerCase());
            }
        } else {
            col = values.colony;
            city = values.city;
            state = values.state;
        }
        try {
            setIsLoading(true);
            await updateEmployee(
                new UpdateEmployeeRequest(
                    values,
                    values.branchOffice,
                    city, col, state, props.employee?.id ?? 0
                )
            ).unwrap();
            setIsLoading(false);
            handleSucccessNotification(NotificationSuccess.UPDATE);
        } catch (error) {
            setIsLoading(false);
            handleErrorNotification(error);
        }
    }

    return (<LayoutCard showBack={shouldShowBack()} title={buildCardTitle()} isLoading={false} content={
        <div className="flex flex-col">
            <Form form={form} layout="vertical" onFinish={handleCheckForm}>
                <Divider orientation="left" orientationMargin="0">
                    {Strings.employeeInfo}
                </Divider>
                <Form.Item
                    name='branchOffice'
                    label={Strings.branchOfficeOrigin}
                    rules={[{ required: true, message: Strings.requiredField }]}
                >
                    <Select size="large" placeholder={Strings.branchOfficeOrigin}>
                        {branchOfficeList.map((value, index) => <Select.Option key={index} value={value.id}>{value.name}</Select.Option>)}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="name"
                    label={Strings.employeeName}
                    rules={[{ required: true, message: Strings.requiredField }]}>
                    <Input size="large" prefix={<RiUser3Line />} placeholder={Strings.employeeName} />
                </Form.Item>

                <Form.Item
                    name="lastname"
                    label={Strings.lastName}
                    rules={[{ required: true, message: Strings.requiredField }]}>
                    <Input size="large" prefix={<RiUser3Line />} placeholder={Strings.lastName} />
                </Form.Item>
                <Form.Item
                    name="secondLastname"
                    label={Strings.secondLastName}
                    rules={[{ required: true, message: Strings.requiredField }]}>
                    <Input size="large" prefix={<RiUser3Line />} placeholder={Strings.secondLastName} />
                </Form.Item>

                <Form.Item
                    name="gender"
                    label={Strings.gender}
                    rules={[{ required: true, message: Strings.requiredField }]}
                >
                    <Select size="large" placeholder={Strings.selectGender}>
                        <Select.Option value="male">{Strings.genderMale}</Select.Option>
                        <Select.Option value="female">{Strings.genderFemale}</Select.Option>
                        <Select.Option value="other">{Strings.default}</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="birthday"
                    label={Strings.birthday}
                    rules={[{ required: true, message: Strings.requiredField }]}>
                    <DatePicker
                        size="large" style={{ minWidth: 200 }} />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label={Strings.phoneNumber}
                    rules={[
                        { required: true, message: Strings.requiredPhoneNumber },
                        { min: 10, message: Strings.invalidPhoneNumber }
                    ]}>
                    <Input
                        type="number"
                        size="large"
                        prefix={<RiPhoneLine />}
                        placeholder={Strings.phoneNumber}
                    />
                </Form.Item>

                <Form.Item
                    name="street"
                    label={Strings.street}
                    rules={[{ required: true, message: Strings.requiredField }]}
                >
                    <Input size="large" prefix={<RiMapPin5Line />} placeholder={Strings.street} />
                </Form.Item>

                <Form.Item
                    name="streetNumber"
                    label={Strings.streetNumber}
                    style={{ maxWidth: 150 }}
                >
                    <Input size="large" prefix={<RiHashtag />} placeholder={Strings.streetNumber} />

                </Form.Item>

                <Form.Item
                    name="zipCode"
                    label={Strings.postalCode}
                    rules={[
                        { required: true, message: Strings.requiredField },
                    ]}>
                    <Input
                        type="number"
                        size="large"
                        prefix={<RiMapPin2Line />}
                        placeholder={'62000'}
                        onChange={(event) => getColoniesFromPostalCode(event.target.value)}
                    />
                </Form.Item>

                {!showNormalInputs && <Form.Item
                    name="colony"
                    label={Strings.colony}
                    rules={[{ required: true, message: Strings.requiredField }]}
                >
                    <Select disabled={colonies.length == 0} size="large" placeholder={Strings.selectColony} onChange={(value) => handleOnColonyChange(value)}>
                        {colonies?.map((value, index) => <Select.Option key={`${index}`} value={`${index}`}>{capitalizeAllCharacters(value.colony)}</Select.Option>)}
                    </Select>
                </Form.Item>}

                {showNormalInputs && <Form.Item
                    name="colony"
                    label={Strings.colony}

                    rules={[{ required: true, message: Strings.requiredField }]}
                >
                    <Input size="large" prefix={<RiMapPin3Line />} placeholder={Strings.colony} />
                </Form.Item>}


                <Form.Item
                    name="city"
                    label={Strings.city}
                    rules={[{ required: true, message: Strings.requiredField }]}
                >
                    <Input disabled={!showNormalInputs} size="large" prefix={<RiMap2Line />} placeholder={Strings.city} />

                </Form.Item>

                <Form.Item
                    name="state"
                    label={Strings.state}
                    rules={[{ required: true, message: Strings.requiredField }]}
                >
                    <Input disabled={!showNormalInputs} size="large" prefix={<RiMapPin3Line />} placeholder={Strings.state} />

                </Form.Item>

                <Divider orientation="left" orientationMargin="0">
                    {Strings.workInfo}
                </Divider>

                <Form.Item
                    name="contractType"
                    label={Strings.contractType}
                    rules={[{ required: true, message: Strings.requiredField }]}
                >
                    <Select size="large" placeholder={Strings.contractType}>
                        <Select.Option value={1}>Contrato laboral</Select.Option>
                        <Select.Option value={2}>Prestación de servicio</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="employeeType"
                    label={Strings.employeeType}
                    rules={[{ required: true, message: Strings.requiredField }]}
                >
                    <Select size="large" placeholder={Strings.employeeType}>
                        {typeList.map((value, index) => <Select.Option key={index} value={value.id}>{value.name}</Select.Option>)}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="rfc"
                    label={Strings.rfc}
                >
                    <Input size="large" prefix={<RiProfileLine />} placeholder={Strings.rfc} />

                </Form.Item>

                <Form.Item
                    name="nss"
                    label={Strings.nss}
                >
                    <Input size="large" prefix={<RiProfileLine />} placeholder={Strings.nss} />

                </Form.Item>



                <Divider orientation="left" orientationMargin="0">
                    Informacion del sistema
                </Divider>

                {props.type == FormEmployeeType.REGISTER && <Form.Item
                    name="role"
                    label={Strings.userRol}
                    rules={[{ required: true, message: Strings.requiredField }]}
                >
                    <Select size="large" placeholder={Strings.selectUserRol}>
                        {roleList.map((value, index) => <Select.Option key={index} value={value.id}>{value.name}</Select.Option>)}
                    </Select>
                </Form.Item>}
                <Form.Item
                    name="username"
                    label={Strings.username}
                    rules={[{ required: true, message: Strings.requiredField }]}
                >
                    <Input size="large" prefix={<RiUser3Line />} placeholder={Strings.username} />

                </Form.Item>

                <Form.Item
                    name="password"
                    label={Strings.password}
                    rules={[{
                        required: props.type == FormEmployeeType.REGISTER,
                        message: props.type == FormEmployeeType.REGISTER ? Strings.requiredField : ''
                    }]}
                >
                    <Input.Password
                        size="large"
                        prefix={<RiLockLine className="site-form-item-icon text-gray-600" />}
                        type="password"
                        placeholder={Strings.password}
                    />

                </Form.Item>

                <Form.Item
                    name="email"
                    label={Strings.email}
                    rules={[{
                        type: 'email',
                        message: Strings.invalidEmail,
                    }
                    ]}>
                    <Input
                        size="large"
                        prefix={<RiMailLine />}
                        placeholder={Strings.email}
                    />
                </Form.Item>

                <Form.Item>
                    <Button loading={isLoading} type="primary" htmlType="submit">
                        {props.type == FormEmployeeType.REGISTER ? Strings.save : Strings.update}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    } />);
}

export default FormEmployee;