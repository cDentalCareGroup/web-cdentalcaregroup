import { Button, DatePicker, Form, Input, Modal, Radio, Row, Select } from "antd";
import Search from "antd/es/input/Search";
import { Option } from "antd/es/mentions";
import { useEffect, useState } from "react";
import { RiHashtag, RiLuggageDepositLine, RiMailLine, RiMap2Line, RiMapPin2Line, RiMapPin3Line, RiMapPin5Line, RiMapPinRangeLine, RiPhoneLine, RiSuitcaseLine, RiUser3Line } from "react-icons/ri";
import useSessionStorage from "../../core/sessionStorage";
import { Colonies, Colony } from "../../data/address/colonies";
import { Latitudes } from "../../data/maps/latitudes";
import { PatientOrigin } from "../../data/patient/patient.origin";
import { RegisterPatientRequest } from "../../data/patient/patient.request";
import { useGetPatientOriginsMutation, useRegisterPatientMutation } from "../../services/patientService";
import Constants from "../../utils/Constants";
import { capitalizeFirstLetter } from "../../utils/Extensions";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import BackArrow from "../components/BackArrow";
import LayoutCard from "../layouts/LayoutCard";

const RegisterPatientCard = () => {

    const [registerPatient, { isLoading }] = useRegisterPatientMutation();
    const [getPatientOrigins] = useGetPatientOriginsMutation();
    const [colonies, setColonies] = useState<Colony[]>([]);
    const [colony, setColony] = useState<Colony>();
    const [form] = Form.useForm();
    const [latitudes, setLatitudes] = useState<Latitudes>();
    const [origins, setOrigins] = useState<PatientOrigin[]|undefined>([]);
    const [branchId, setBranchId] = useSessionStorage(
        Constants.BRANCH_ID,
        0
    );

    useEffect(() => {
        handleGetPatientOrigins();
    },[]);

    const handleGetPatientOrigins = async () => {
        try {
            const response = await getPatientOrigins({}).unwrap();
            setOrigins(response);
        } catch (error) {
            console.log(error);
        }
    }

    const getColoniesFromPostalCode = async (cp: string) => {
        try {
            form.resetFields(['colony', 'city', 'state']);
            setColonies([]);
            if (cp.length < 5) return
            const response = await fetch(`https://www.walmart.com.mx/api/wmx/service/v1/common/neighborhood/details?zipcode=${cp}&channel=4&shipping=1`)
                .then((response) => {
                    if (response.status != 200) {
                        handleErrorNotification('NOT_FOUND_CP');
                    } else {
                        return response.json()
                    }
                })
                .then((response) => response as Colonies)
            if (response.neighborhood != null && response.neighborhood.colonies != null) {
                setColonies(response.neighborhood?.colonies);
            }
        } catch (error) {
            handleErrorNotification(error);
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

            if (response.status === "OK" && response.results.length > 0) {
                console.log(response[0]);
                const address = response.results[0];
                const lat = address.geometry.location.lat;
                const lng = address.geometry.location.lng;
                setLatitudes(new Latitudes(lat, lng));
            }
            if(response.status == 'ZERO_RESULTS') {
                setLatitudes(new Latitudes(0, 0));
            }
           // return [];
        } catch (error) {
            console.error(`Failed to get addrress from ${colony}, ${error}`);
          //  return [];
        }
    };
    const googleApiFetchStreets = async (lat: number, lng: number) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=AIzaSyDB5WyzdGWnx3JspWuwTmdKN0TURq8QIBA`,
                {
                    method: "GET"
                }
            ).then((response) => response.json().catch((error) => error));

            if (response.status === "OK" && response.results.length > 0) {
                return response.results.map((value: any, _: any) => value.formatted_address);
            }
            return [];
        } catch (error) {
            console.error(`Failed to get addrress from ${lat} ${lng}, ${error}`);
            return [];
        }
    };

    const handleOnColonyChange = async (value: any) => {
        const colony = colonies?.find((_, index) => Number(value) == index);
        if (colony != null) {
            form.setFieldValue('city', capitalizeFirstLetter(colony.county?.toLowerCase())
            );
            if (colony.stateCities != null && colony.stateCities.length > 0) {
                form.setFieldValue('state', capitalizeFirstLetter(colony.stateCities[0].state?.toLocaleLowerCase()));
            }
            setColony(colony);
            googleApiFetchColony(colony.colony ?? '');
        }
    }

    const handleRegisterPatient = async (values: any) => {
       // console.log(`Colony: ${colony} - LatLng: ${latitudes}`);
        if (colony == undefined && latitudes == undefined) {
            return;
        }
        try {
             await registerPatient(new RegisterPatientRequest(values, colony!, latitudes!, branchId)).unwrap();
             form.resetFields();
             handleSucccessNotification(NotificationSuccess.REGISTER);
        } catch (error) {
            handleErrorNotification(error);
        }
    }


    return (<LayoutCard showBack={true} title="Registro de pacientes" isLoading={false} content={
        <div className="flex flex-col">
            <Form form={form} name="horizontal_login" layout="vertical" onFinish={handleRegisterPatient}>
                <Row>

                    <Form.Item
                        name="name"
                        label={Strings.patientName}
                        style={{ minWidth: 200, padding: 10 }}
                        rules={[{ required: true, message: Strings.requiredField }]}>
                        <Input size="large" prefix={<RiUser3Line />} placeholder={Strings.patientName} />
                    </Form.Item>

                    <Form.Item
                        name="lastname"
                        label={Strings.lastName}
                        style={{ minWidth: 200, padding: 10 }}
                        rules={[{ required: true, message: Strings.requiredField }]}>
                        <Input size="large" prefix={<RiUser3Line />} placeholder={Strings.lastName} />
                    </Form.Item>
                    <Form.Item
                        name="secondLastname"
                        label={Strings.secondLastName}
                        style={{ minWidth: 200, padding: 10 }}
                        rules={[{ required: true, message: Strings.requiredField }]}>
                        <Input size="large" prefix={<RiUser3Line />} placeholder={Strings.secondLastName} />
                    </Form.Item>

                    <Form.Item
                        name="gender"
                        label={Strings.gender}
                        style={{ minWidth: 200, padding: 10 }}
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
                        style={{ minWidth: 200, padding: 10 }}
                        rules={[{ required: true, message: Strings.requiredField }]}>
                        <DatePicker size="large" style={{ minWidth: 200 }} />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label={Strings.phoneNumber}
                        style={{ minWidth: 200, padding: 10 }}
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
                        name="email"
                        label={Strings.email}
                        style={{ minWidth: 200, padding: 10 }}
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

                    <Form.Item
                        name="street"
                        label={Strings.street}
                        style={{ minWidth: 300, padding: 10, maxWidth: 300 }}
                        rules={[{ required: true, message: Strings.requiredField }]}
                    >
                        <Input size="large" prefix={<RiMapPin5Line />} placeholder={Strings.street} />
                    </Form.Item>

                    <Form.Item
                        name="streetNumber"
                        label={Strings.streetNumber}
                        style={{ maxWidth: 150, padding: 10 }}
                    >
                        <Input size="large" prefix={<RiHashtag />} placeholder={Strings.streetNumber} />

                    </Form.Item>

                    <Form.Item
                        name="zipCode"
                        label={Strings.postalCode}
                        style={{ minWidth: 200, padding: 10 }}
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

                    <Form.Item
                        name="colony"
                        label={Strings.colony}
                        style={{ minWidth: 300, padding: 10 }}
                        rules={[{ required: true, message: Strings.requiredField }]}
                    >
                        <Select disabled={colonies.length == 0} size="large" placeholder={Strings.selectColony} onChange={(value) => handleOnColonyChange(value)}>
                            {colonies?.map((value, index) => <Select.Option key={`${index}`} value={`${index}`}>{capitalizeFirstLetter(value.colony)}</Select.Option>)}
                        </Select>
                    </Form.Item>


                    <Form.Item
                        name="city"
                        label={Strings.city}
                        style={{ minWidth: 200, padding: 10 }}
                        rules={[{ required: true, message: Strings.requiredField }]}
                    >
                        <Input disabled size="large" prefix={<RiMap2Line />} placeholder={Strings.city} />

                    </Form.Item>

                    <Form.Item
                        name="state"
                        label={Strings.state}
                        style={{ minWidth: 200, padding: 10 }}
                        rules={[{ required: true, message: Strings.requiredField }]}
                    >
                        <Input disabled size="large" prefix={<RiMapPin3Line />} placeholder={Strings.state} />

                    </Form.Item>

                    <Form.Item
                        name="origin"
                        label='Origen'
                        style={{ minWidth: 200, padding: 10 }}
                        rules={[{ required: true, message: Strings.requiredField }]}
                    >
                        <Select  size="large" placeholder='Origen' >
                            {origins?.map((value, _) => <Select.Option key={value.id} value={value.id}>{value.name}</Select.Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="civilState"
                        label={Strings.civilState}
                        style={{ minWidth: 200, padding: 10 }}
                    >
                        <Select size="large" placeholder={Strings.selectOption}>
                            <Select.Option value="single">{Strings.single}</Select.Option>
                            <Select.Option value="married">{Strings.married}</Select.Option>
                            <Select.Option value="other">{Strings.default}</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="occupation"
                        label={Strings.ocupation}
                        style={{ minWidth: 200, padding: 10 }}>
                        <Input size="large" prefix={<RiSuitcaseLine />} placeholder={Strings.ocupation} />

                    </Form.Item>

                </Row>
                <Form.Item>
                    <Button loading={isLoading} type="primary" htmlType="submit">
                        Guardar
                    </Button>
                </Form.Item>
            </Form>
        </div>
    } />);
}

export default RegisterPatientCard;