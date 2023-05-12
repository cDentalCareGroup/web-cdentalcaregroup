import { Button, DatePicker, Form, Input, Row, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { RiHashtag, RiHospitalLine, RiMailLine, RiMap2Line, RiMapPin2Line, RiMapPin3Line, RiMapPin5Line, RiPhoneLine, RiSuitcaseLine, RiUser3Line } from "react-icons/ri";
import useSessionStorage from "../../core/sessionStorage";
import { Colony } from "../../data/address/colonies";
import { Latitudes } from "../../data/maps/latitudes";
import { Patient } from "../../data/patient/patient";
import { PatientOrganization } from "../../data/patient/patient.organization";
import { PatientOrigin } from "../../data/patient/patient.origin";
import { RegisterPatientRequest, UpdatePatientRequest } from "../../data/patient/patient.request";
import SelectItemOption from "../../data/select/select.item.option";
import { branchOfficesToSelectOptionItem } from "../../data/select/select.item.option.extensions";
import { useGetBranchOfficesMutation } from "../../services/branchOfficeService";
import { useGetColoniesFromZipCodeMutation, useGetPatientOrganizationsMutation, useGetPatientOriginsMutation, useRegisterPatientMutation, useUpdatePatientMutation } from "../../services/patientService";
import Constants from "../../utils/Constants";
import { capitalizeAllCharacters, isAdmin, UserRoles } from "../../utils/Extensions";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import SelectSearch from "../components/SelectSearch";
import LayoutCard from "../layouts/LayoutCard";

interface FormPatientProps {
    type: FormPatientType;
    patient?: Patient;
    rol: UserRoles;
    source: FormPatientSource;
    origin?: number;
    onFinish?: (patient: Patient) => void;
}
export enum FormPatientType {
    REGISTER, UPDATE
}

export enum FormPatientSource {
    APPOINTMENT, FORM
}

const FormPatient = (props: FormPatientProps) => {

    const [registerPatient] = useRegisterPatientMutation();
    const [updatePatient,] = useUpdatePatientMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingContent, setIsLoadingContent] = useState(false);
    const [getPatientOrigins] = useGetPatientOriginsMutation();
    const [getPatientOrganizations] = useGetPatientOrganizationsMutation();
    const [getColoniesFromZipCode] = useGetColoniesFromZipCodeMutation();
    const [colonies, setColonies] = useState<Colony[]>([]);
    const [colony, setColony] = useState<Colony>();
    const [form] = Form.useForm();
    //const [latitudes, setLatitudes] = useState<Latitudes>();
    const [origins, setOrigins] = useState<PatientOrigin[] | undefined>([]);
    const [organizations, setOrganizations] = useState<PatientOrganization[] | undefined>([]);
    const [showNormalInputs, setShowNormalInputs] = useState(false);

    const [branchId, setBranchId] = useSessionStorage(
        Constants.BRANCH_ID,
        0
    );
    const [branchOfficeList, setBranchoOfficeList] = useState<SelectItemOption[]>([]);
    const [branchOfficeId, setBranchoOfficeId] = useState(0);
    const [getBranchOffices] = useGetBranchOfficesMutation();

    useEffect(() => {
        if (props.type == FormPatientType.UPDATE) {
            handleSetupValues();
        } else {
            handleGetBranchOffices()
        }
        handleGetPatientOrigins();
        handleGetPatientOrganizations();
    }, []);

    const handleGetBranchOffices = async (defaultBranchOfficeId?: number) => {
        try {
            if (defaultBranchOfficeId != null) {
                setBranchoOfficeId(defaultBranchOfficeId);
            }
            const response = await getBranchOffices({}).unwrap();
            setBranchoOfficeList(branchOfficesToSelectOptionItem(response));
            setIsLoadingContent(false);
        } catch (error) {
            setIsLoadingContent(false);
            handleErrorNotification(error);
        }
    }

    const handleSetupValues = () => {
        setIsLoadingContent(true);
        form.setFieldValue('name', props.patient?.name);
        form.setFieldValue('lastname', props.patient?.lastname);
        form.setFieldValue('folio', props.patient?.historicalFolio);
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
        form.setFieldValue('organization', props.patient?.organizationClient);
        if (props.patient?.startDate != null) {
            form.setFieldValue('startDate', dayjs(props.patient?.startDate, 'YYYY-MM-DD'));
        }
        form.setFieldValue('birthday', dayjs(props.patient?.birthDay, 'YYYY-MM-DD'));
        //setLatitudes(new Latitudes(Number(props.patient?.lat), Number(props.patient?.lng)));
        if (props.rol == UserRoles.ADMIN || props.rol == UserRoles.CALL_CENTER) {
            setBranchId(Number(props.patient?.originBranchOfficeId));
        }
        if (props.rol == UserRoles.ADMIN || props.rol == UserRoles.CALL_CENTER) {
            handleGetBranchOffices(Number(props.patient?.originBranchOfficeId));
        } else {
            setIsLoadingContent(false);
        }
    }

    const handleGetPatientOrigins = async () => {
        try {
            const response = await getPatientOrigins({}).unwrap();
            setOrigins(response);
            if (props.origin != null && props.origin != undefined && props.origin != 0) {
                form.setFieldValue('origin', props.origin);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleGetPatientOrganizations = async () => {
        try {
            const response = await getPatientOrganizations({}).unwrap();
            setOrganizations(response);
        } catch (error) {
            console.log(error);
        }
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
            //handleErrorNotification(error);
        }
    }

    const googleApiFetchColony = async () => {
        try { 
            const address = `${capitalizeAllCharacters(form.getFieldValue('street'))} ${capitalizeAllCharacters(form.getFieldValue('streetNumber'))} ${capitalizeAllCharacters(colony?.colony)} ${capitalizeAllCharacters(form.getFieldValue('city'))} ${capitalizeAllCharacters(form.getFieldValue('state'))} ${capitalizeAllCharacters(form.getFieldValue('zipCode'))}`;
            let strGoogleMaps = `https://maps.google.com/maps/api/geocode/json?address=${address}&key=AIzaSyDB5WyzdGWnx3JspWuwTmdKN0TURq8QIBA`
            strGoogleMaps = strGoogleMaps.replaceAll(' ', '%20' );
           
            const response = await fetch(
                strGoogleMaps,
                { method: "GET" })
                .then((response) => response.json().catch((error) => error));
           
            if (response.status === "OK" && response.results.length > 0) {
                const address = response.results[0];
                const lat = address.geometry.location.lat;
                const lng = address.geometry.location.lng;
                return new Latitudes(lat, lng);
            }
            return new Latitudes(0, 0);
        } catch (error) {
            console.error(`Failed to get addrress from ${colony}, ${error}`);
            return new Latitudes(0, 0);
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
        }
    }

    const handleRegisterPatient = async (values: any) => {
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

        setIsLoading(true);
        const latlng = await googleApiFetchColony();

        try {
            const response = await registerPatient(
                new RegisterPatientRequest(
                    values,
                    latlng,
                    (props.rol == UserRoles.ADMIN || props.rol == UserRoles.CALL_CENTER) ? branchOfficeId : Number(branchId),
                    city, col, state
                )).unwrap();

            if (props.source == FormPatientSource.APPOINTMENT) {
                //console.log(response);
                if (props.onFinish != null) {
                    props?.onFinish(response);
                }
            } else {
                handleSucccessNotification(NotificationSuccess.REGISTER);
            }
            form.resetFields();
            setIsLoading(false);
            setShowNormalInputs(false);

        } catch (error) {
            setIsLoading(false);
            handleErrorNotification(error);
        }
    }

    const handleUpdatePatient = async (values: any) => {
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
        setIsLoading(true);
        const latlng = await googleApiFetchColony();

        try {
            await updatePatient(new UpdatePatientRequest(
                values, props.patient?.originBranchOfficeId,
                col, city, state, latlng, props.patient?.id ?? 0, props.patient?.birthDay.toString() ?? ''
            )).unwrap();
            setIsLoading(false);
            handleSucccessNotification(NotificationSuccess.UPDATE);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const shouldShowBack = (): boolean => {
        return props.type == FormPatientType.REGISTER && props.source == FormPatientSource.FORM;
    }

    const buildCardTitle = (): string => {
        return (props.type == FormPatientType.REGISTER && props.source == FormPatientSource.FORM) ? Strings.formPatient : ''
    }

    const handleCheckForm = (values: any) => {
        if (props.type == FormPatientType.REGISTER) {
            handleRegisterPatient(values);
        } else {
            handleUpdatePatient(values);
        }
    }

    return (<LayoutCard showBack={shouldShowBack()} title={buildCardTitle()} isLoading={isLoadingContent} content={
        <div className="flex flex-col">
            <Form form={form} name="horizontal_login" className={`flex ${props.source == FormPatientSource.FORM ? 'flex-col flex-wrap' : 'flex-row flex-wrap'}`} layout="vertical" onFinish={handleCheckForm}>
                {(props.rol == UserRoles.ADMIN || props.rol == UserRoles.CALL_CENTER) && <Form.Item
                    name="branchOfficeId"
                    label={Strings.branchOfficeOrigin}
                    style={{ minWidth: 300, padding: 10 }}
                    rules={[{ required: true, message: Strings.requiredField }]}>
                    <SelectSearch
                        placeholder={Strings.branchOfficeOrigin}
                        items={branchOfficeList}
                        onChange={(event) => setBranchoOfficeId(event.id)}
                        icon={<RiHospitalLine />}
                        defaultValue={branchOfficeId}
                    />
                </Form.Item>}

                <Form.Item
                    name="folio"
                    label={Strings.folioHistoric}
                    style={{ minWidth: 200, padding: 10 }}>
                    <Input size="large" prefix={<RiUser3Line />} placeholder={Strings.folioHistoric} />
                </Form.Item>

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
                >
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
                    <DatePicker
                        size="large" style={{ minWidth: 200 }} />
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
                    name="secondPhone"
                    label={Strings.secondPhoneNumber}
                    style={{ minWidth: 200, padding: 10 }}
                    rules={[
                        { min: 10, message: Strings.invalidPhoneNumber }
                    ]}>
                    <Input
                        type="number"
                        size="large"
                        prefix={<RiPhoneLine />}
                        placeholder={Strings.secondPhoneNumber}
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
                    style={{ minWidth: 300, padding: 10 }}
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

                {!showNormalInputs && <Form.Item
                    name="colony"
                    label={Strings.colony}
                    style={{ minWidth: 300, padding: 10 }}
                    rules={[{ required: true, message: Strings.requiredField }]}
                >
                    <Select disabled={colonies.length == 0} size="large" placeholder={Strings.selectColony} onChange={(value) => handleOnColonyChange(value)}>
                        {colonies?.map((value, index) => <Select.Option key={`${index}`} value={`${index}`}>{capitalizeAllCharacters(value.colony)}</Select.Option>)}
                    </Select>
                </Form.Item>}

                {showNormalInputs && <Form.Item
                    name="colony"
                    label={Strings.colony}
                    style={{ minWidth: 300, padding: 10 }}
                    rules={[{ required: true, message: Strings.requiredField }]}
                >
                    <Input size="large" prefix={<RiMapPin3Line />} placeholder={Strings.colony} />
                </Form.Item>}


                <Form.Item
                    name="city"
                    label={Strings.city}
                    style={{ minWidth: 200, padding: 10 }}
                    rules={[{ required: true, message: Strings.requiredField }]}
                >
                    <Input disabled={!showNormalInputs} size="large" prefix={<RiMap2Line />} placeholder={Strings.city} />

                </Form.Item>

                <Form.Item
                    name="state"
                    label={Strings.state}
                    style={{ minWidth: 200, padding: 10 }}
                    rules={[{ required: true, message: Strings.requiredField }]}
                >
                    <Input disabled={!showNormalInputs} size="large" prefix={<RiMapPin3Line />} placeholder={Strings.state} />

                </Form.Item>

                <Form.Item
                    name="origin"
                    label={Strings.origin}
                    style={{ minWidth: 200, padding: 10 }}
                    rules={[{ required: true, message: Strings.requiredField }]}
                >
                    <Select disabled={props.origin != null && props.origin != undefined && props.origin != 0} size="large" placeholder='Origen' >
                        {origins?.map((value, _) => <Select.Option key={value.id} value={value.id}>{value.name}</Select.Option>)}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="organization"
                    label={Strings.organization}
                    style={{ minWidth: 200, padding: 10 }}
                >
                    <Select size="large" placeholder='Organización' >
                        {organizations?.map((value, index) => <Select.Option key={index} value={value.id}>{value.name}</Select.Option>)}
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

                {props.type == FormPatientType.UPDATE && <Form.Item
                    name="startDate"
                    label={Strings.registerDate}
                    style={{ minWidth: 200, padding: 10 }}
                >
                    <DatePicker
                        size="large" style={{ minWidth: 200 }} />
                </Form.Item>}

                <Form.Item>
                    <Button className={`${props.source == FormPatientSource.FORM ? '' : 'mt-10'}`} loading={isLoading} type="primary" htmlType="submit">
                        {props.type == FormPatientType.REGISTER ? Strings.save : Strings.update}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    } />);
}

export default FormPatient;