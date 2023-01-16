import { Button, DatePicker, Form, Input, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { RiHashtag, RiMailLine, RiMap2Line, RiMapPin2Line, RiMapPin3Line, RiMapPin5Line, RiPhoneLine, RiSuitcaseLine, RiUser3Line } from "react-icons/ri";
import useSessionStorage from "../../core/sessionStorage";
import { Colonies, Colony } from "../../data/address/colonies";
import { Latitudes } from "../../data/maps/latitudes";
import { Patient } from "../../data/patient/patient";
import { PatientOrigin } from "../../data/patient/patient.origin";
import { RegisterPatientRequest, UpdatePatientRequest } from "../../data/patient/patient.request";
import { useGetPatientOriginsMutation, useRegisterPatientMutation, useUpdatePatientMutation } from "../../services/patientService";
import Constants from "../../utils/Constants";
import { capitalizeFirstLetter } from "../../utils/Extensions";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import LayoutCard from "../layouts/LayoutCard";

interface FormPatientProps {
    type: FormPatientType;
    patient?: Patient;
}
export enum FormPatientType {
    REGISTER, UPDATE
}

const FormPatient = (props: FormPatientProps) => {

    const [registerPatient] = useRegisterPatientMutation();
    const [updatePatient,] = useUpdatePatientMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [getPatientOrigins] = useGetPatientOriginsMutation();
    const [colonies, setColonies] = useState<Colony[]>([]);
    const [colony, setColony] = useState<Colony>();
    const [form] = Form.useForm();
    const [latitudes, setLatitudes] = useState<Latitudes>();
    const [origins, setOrigins] = useState<PatientOrigin[] | undefined>([]);
    const [branchId, setBranchId] = useSessionStorage(
        Constants.BRANCH_ID,
        0
    );
    useEffect(() => {
        if (props.type == FormPatientType.UPDATE) {
            handleSetupValues();
        }
        handleGetPatientOrigins();
    }, []);


    const handleSetupValues = () => {
        form.setFieldValue('name', props.patient?.name);
        form.setFieldValue('lastname', props.patient?.lastname);
        form.setFieldValue('secondLastname', props.patient?.secondLastname);
        form.setFieldValue('gender', props.patient?.gender);
        form.setFieldValue('phone', props.patient?.primaryContact);
        form.setFieldValue('email', props.patient?.email);
        form.setFieldValue('street', props.patient?.street);
        form.setFieldValue('streetNumber', props.patient?.number);
        form.setFieldValue('zipCode', props.patient?.cp);
        form.setFieldValue('colony', props.patient?.colony);
        form.setFieldValue('city', props.patient?.city);
        form.setFieldValue('state', props.patient?.state);
        form.setFieldValue('origin', props.patient?.sourceClient);
        form.setFieldValue('civilState', props.patient?.maritalStatus);
        form.setFieldValue('occupation', props.patient?.job);

        setLatitudes(new Latitudes(Number(props.patient?.lat), Number(props.patient?.lng)));
    }

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
            const response = await fetch(`https://www.walmart.com.mx/api/wmx/service/v1/common/neighborhood/details?zipcode=${cp}&channel=4&shipping=1`, {
                headers: {
                    'Access-Control-Allow-Origin': "*",
                    'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept",
                    'accept': 'application/json',
                    'Authorization':'Bearer h+xlORCo6Cxl0WiS47qkhv7Q.restapp-354905749-9-1093987605'
                    
                },
                mode: 'cors',
                method: 'GET'
            })
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
        console.log(colony);
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

    const handleRegisterPatient = async (values: any) => {
        if (colony == undefined && latitudes == undefined) {
            return;
        }
        setIsLoading(true);
        try {
            await registerPatient(new RegisterPatientRequest(values, colony!, latitudes!, branchId)).unwrap();
            form.resetFields();
            setIsLoading(false);
            handleSucccessNotification(NotificationSuccess.REGISTER);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleUpdatePatient = async (values: any) => {
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
        setIsLoading(true);
        try {
            await updatePatient(new UpdatePatientRequest(
                values, props.patient?.originBranchOfficeId,
                col, city, state, latitudes!, props.patient?.id ?? 0, props.patient?.birthDay.toString() ?? ''
            )).unwrap();
            setIsLoading(false);
            handleSucccessNotification(NotificationSuccess.UPDATE);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const shouldShowBack = (): boolean => {
        return props.type == FormPatientType.REGISTER;
    }

    const buildCardTitle = (): string => {
        return props.type == FormPatientType.REGISTER ? "Registro de pacientes" : ''
    }

    const handleCheckForm = (values: any) => {
        if (props.type == FormPatientType.REGISTER) {
            handleRegisterPatient(values);
        } else {
            handleUpdatePatient(values);
        }
    }

    return (<LayoutCard showBack={shouldShowBack()} title={buildCardTitle()} isLoading={false} content={
        <div className="flex flex-col">
            <Form form={form} name="horizontal_login" layout="vertical" onFinish={handleCheckForm}>
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

                    {props.type == FormPatientType.REGISTER && <Form.Item
                        name="birthday"
                        label={Strings.birthday}
                        style={{ minWidth: 200, padding: 10 }}
                        rules={[{ required: true, message: Strings.requiredField }]}>
                        <DatePicker
                            size="large" style={{ minWidth: 200 }} />
                    </Form.Item>}
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
                        <Select size="large" placeholder='Origen' >
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
                        {props.type == FormPatientType.REGISTER ? 'Guardar' : 'Actualizar'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    } />);
}

export default FormPatient;