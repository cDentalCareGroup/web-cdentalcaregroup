import { Button, DatePicker, Form, Input, Radio, Select } from "antd";
import Search from "antd/es/input/Search";
import { Option } from "antd/es/mentions";
import { useState } from "react";
import { RiLuggageDepositLine, RiMap2Line, RiMapPin2Line, RiMapPin3Line, RiPhoneLine, RiSuitcaseLine, RiUser3Line } from "react-icons/ri";
import { Colonies, Colony } from "../../data/address/colonies";
import { capitalizeFirstLetter } from "../../utils/Extensions";
import { handleErrorNotification } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import LayoutCard from "../layouts/LayoutCard";

const Patients = () => {

    const [colonies, setColonies] = useState<Colony[] | undefined>([]);
    const [form] = Form.useForm();


    const getColoniesFromPostalCode = async (cp: string) => {
        try {
            form.resetFields(['colony']);
            if (cp.length < 5) return
            setColonies([]);
            const response = await fetch(`https://www.walmart.com.mx/api/wmx/service/v1/common/neighborhood/details?zipcode=${cp}&channel=4&shipping=1`)
                .then((response) => {
                    if (response.status != 200) {
                        handleErrorNotification('NOT_FOUND_CP');
                    } else {
                        return response.json()
                    }
                })
                .then((response) => response as Colonies)
            setColonies(response.neighborhood?.colonies);
        } catch (error) {
            handleErrorNotification(error);
        }
    }

    const handleOnColonyChange = (value: any) => {
        const colony = colonies?.find((_, index) => Number(value) == index);
        if (colony != null) {
            form.setFieldValue('city', capitalizeFirstLetter(colony.county?.toLowerCase())
            );
            if (colony.stateCities != null && colony.stateCities.length > 0) {
                form.setFieldValue('state', capitalizeFirstLetter(colony.stateCities[0].state?.toLocaleLowerCase()));
            }
        }
    }



    return (<LayoutCard isLoading={false} content={
        <div className="flex flex-col">
            <Search onChange={(event) => { }} size="large" placeholder='Buscar pacientes' onSearch={() => { }} enterButton />
            <div className="flex w-full items-end justify-end mt-4 mb-12">
                <Button type="primary">Agregar paciente</Button>
            </div>


            <Form form={form} name="horizontal_login" layout="vertical" onFinish={() => { }}>
                <div className="flex flex-row gap-4 flex-wrap">

                    <Form.Item
                        name="name"
                        label={Strings.patientName}
                        style={{ minWidth: 200 }}
                        rules={[{ required: true, message: Strings.requiredName }]}>
                        <Input size="large" prefix={<RiUser3Line />} placeholder={Strings.patientName} />
                    </Form.Item>

                    <Form.Item
                        name="lastname"
                        label={Strings.lastName}
                        style={{ minWidth: 200 }}
                        rules={[{ required: true, message: Strings.requiredField }]}>
                        <Input size="large" prefix={<RiUser3Line />} placeholder={Strings.lastName} />
                    </Form.Item>
                    <Form.Item
                        name="secondLastname"
                        label={Strings.secondLastName}
                        style={{ minWidth: 200 }}
                        rules={[{ required: true, message: Strings.requiredField }]}>
                        <Input size="large" prefix={<RiUser3Line />} placeholder={Strings.secondLastName} />
                    </Form.Item>

                    <Form.Item
                        name="gender"
                        label={Strings.gender}
                        style={{ minWidth: 200 }}
                        rules={[{ required: true, message: Strings.requiredField }]}
                    >
                        <Select size="large" placeholder={Strings.selectGender}>
                            <Option value="male">{Strings.genderMale}</Option>
                            <Option value="female">{Strings.genderFemale}</Option>
                            <Option value="other">{Strings.default}</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="birthday"
                        label={Strings.birthday}
                        rules={[{ required: true, message: Strings.requiredField }]}>
                        <DatePicker size="large" style={{ minWidth: 200 }} />
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
                        name="secondPhone"
                        label={Strings.secondPhoneNumber}
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
                        name="cp"
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

                    <Form.Item
                        name="colony"
                        label={Strings.colony}
                        style={{ minWidth: 300 }}
                        rules={[{ required: true, message: Strings.requiredField }]}
                    >
                        <Select size="large" placeholder={Strings.selectColony} onChange={(value) => handleOnColonyChange(value)}>
                            {colonies?.map((value, index) => <Option key={`${index}`} value={`${index}`}>{capitalizeFirstLetter(value.colony)}</Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="city"
                        label={Strings.city}
                        style={{ minWidth: 200 }}
                        rules={[{ required: true, message: Strings.requiredField }]}
                    >
                        <Input disabled size="large" prefix={<RiMap2Line />} placeholder={Strings.city} />

                    </Form.Item>

                    <Form.Item
                        name="state"
                        label={Strings.state}
                        style={{ minWidth: 200 }}
                        rules={[{ required: true, message: Strings.requiredField }]}
                    >
                        <Input disabled size="large" prefix={<RiMapPin3Line />} placeholder={Strings.state} />

                    </Form.Item>

                    <Form.Item
                        name="civilState"
                        label={Strings.civilState}
                        style={{ minWidth: 200 }}
                    >
                        <Select size="large" placeholder={Strings.selectOption}>
                            <Option value="single">{Strings.single}</Option>
                            <Option value="married">{Strings.married}</Option>
                            <Option value="other">{Strings.default}</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="ocupation"
                        label={Strings.ocupation}
                        style={{ minWidth: 200 }}>
                        <Input size="large" prefix={<RiSuitcaseLine />} placeholder="Apellido materno" />

                    </Form.Item>

                    <Form.Item
                        name="status"
                        label={Strings.status}
                    >
                        <Radio.Group onChange={() => { }} value={1}>
                            <Radio value={1}>Activo</Radio>
                            <Radio value={2}>Suspendido</Radio>
                            <Radio value={3}>Baja definitiva</Radio>
                        </Radio.Group>
                    </Form.Item>

                </div>
            </Form>
        </div>
    } />);
}

export default Patients;