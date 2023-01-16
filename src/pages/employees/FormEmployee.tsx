import { Button, DatePicker, Divider, Form, Input, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { RiHashtag, RiLockLine, RiMailLine, RiMap2Line, RiMapPin2Line, RiMapPin3Line, RiMapPin5Line, RiPhoneLine, RiProfileLine, RiSuitcaseLine, RiUser3Line } from "react-icons/ri";
import useSessionStorage from "../../core/sessionStorage";
import { Colonies, Colony } from "../../data/address/colonies";
import { RegisterEmployeeRequest } from "../../data/employee/employee.request";
import { EmployeeType } from "../../data/employee/employee.types";
import { Latitudes } from "../../data/maps/latitudes";
import { Patient } from "../../data/patient/patient";
import { PatientOrigin } from "../../data/patient/patient.origin";
import { RegisterPatientRequest, UpdatePatientRequest } from "../../data/patient/patient.request";
import { useGetEmployeeTypesMutation, useRegisterEmployeeMutation } from "../../services/employeeService";
import { useGetColoniesFromZipCodeMutation, useGetPatientOriginsMutation, useRegisterPatientMutation, useUpdatePatientMutation } from "../../services/patientService";
import Constants from "../../utils/Constants";
import { capitalizeFirstLetter } from "../../utils/Extensions";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import LayoutCard from "../layouts/LayoutCard";

const FormEmployee = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [colonies, setColonies] = useState<Colony[]>([]);
    const [colony, setColony] = useState<Colony>();
    const [form] = Form.useForm();
    const [latitudes, setLatitudes] = useState<Latitudes>();
    const [typeList, setTypeList] = useState<EmployeeType[]>([]);
    const [getEmployeeTypes] = useGetEmployeeTypesMutation();
    const [getColoniesFromZipCode] = useGetColoniesFromZipCodeMutation();
    const [registerEmployee] = useRegisterEmployeeMutation();
    const [showNormalInputs, setShowNormalInputs] = useState(false);

    useEffect(() => {
        handleGetEmployeeTypes();
    }, []);

    const handleGetEmployeeTypes = async () => {
        try {
            const response = await getEmployeeTypes({}).unwrap();
            setTypeList(response);
        } catch (error) {
            handleErrorNotification(error);
        }
    }


    const handleSetupValues = () => {
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
                    form.setFieldValue('city', capitalizeFirstLetter(colony.stateCities[0].cities[0]));
                }
                form.setFieldValue('state', capitalizeFirstLetter(colony.stateCities[0].state));
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
            col = capitalizeFirstLetter(colony.colony);
            city = capitalizeFirstLetter(colony.county?.toLowerCase());
            if (colony.stateCities) {
                state = capitalizeFirstLetter(colony.stateCities[0].state?.toLocaleLowerCase());
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
                    1,
                    city, col, state
                )).unwrap();
            form.resetFields();
            setIsLoading(false);
            setShowNormalInputs(false);
        } catch (error) {
            setIsLoading(false);
            handleErrorNotification(error);
        }
    }


    return (<LayoutCard title={'registro empleados'} isLoading={false} content={
        <div className="flex flex-col">
            <Form form={form} layout="vertical" onFinish={handleRegisterEmployee}>
                <Divider orientation="left" orientationMargin="0">
                    Informacion del empleado
                </Divider>
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
                        {colonies?.map((value, index) => <Select.Option key={`${index}`} value={`${index}`}>{capitalizeFirstLetter(value.colony)}</Select.Option>)}
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
                    Informacion laboral
                </Divider>

                <Form.Item
                    name="contractType"
                    label={Strings.contractType}
                    rules={[{ required: true, message: Strings.requiredField }]}
                >
                    <Select size="large" placeholder={Strings.contractType}>
                        <Select.Option value={1}>Contrato laboral</Select.Option>
                        <Select.Option value={2}>Prestacion de servicio</Select.Option>
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
                    rules={[{ required: true, message: Strings.requiredField }]}
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
                        Guardar
                    </Button>
                </Form.Item>
            </Form>
        </div>
    } />);
}

export default FormEmployee;