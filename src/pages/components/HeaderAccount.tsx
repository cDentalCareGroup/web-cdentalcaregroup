import { Button, Divider, Dropdown, Form, Input, Modal, Result } from "antd";
import { useState } from "react";
import { RiArrowDownSLine, RiFootballLine, RiLogoutBoxLine, RiSettings3Line, RiUser3Line, RiUserLine } from 'react-icons/ri';
import { useNavigate } from "react-router-dom";
import useSessionStorage from "../../core/sessionStorage";
import User from "../../data/user/user";
import { UpdatePasswordRequest } from "../../data/user/user.request";
import { useUpdatePassowrdMutation } from "../../services/authService";
import Constants from "../../utils/Constants";
import { handleErrorNotification, handleSucccessNotification, NotificationSuccess } from "../../utils/Notifications";
import Strings from "../../utils/Strings";
import CustomFormInput from "./CustomFormInput";
import SectionElement from "./SectionElement";

interface HeaderAccountProps {
    title: string
}

const HeaderAccount = (props: HeaderAccountProps) => {
    const [form] = Form.useForm();
    const [updatePassowrd] = useUpdatePassowrdMutation();

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [option, setOption] = useState('');
    const [session, setSession] = useSessionStorage(Constants.SESSION_AUTH, null);

    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const items: any['items'] = [
        {
            label: <span onClick={() => handleOnOptionClick('account')}>Cuenta</span>,
            key: '0',
            icon: <RiUserLine />
        },
        // {
        //     label: <span onClick={() => handleOnOptionClick('settings')}>Configuración</span>,
        //     key: '1',
        //     icon: <RiSettings3Line />
        // },
        {
            label: <span onClick={() => handleOnOptionClick('help')}>Ayuda</span>,
            key: '2',
            icon: <RiFootballLine />
        },
        {
            type: 'divider',
        },
        {
            label: <span onClick={() => handleOnOptionClick('logout')}>Cerrar sesión</span>,
            key: '3',
            icon: <RiLogoutBoxLine />
        },
    ];


    const handleOnOptionClick = (value: string) => {
        setOption(value);
        switch (value) {
            case 'account':
                const user = session as User;
                form.setFieldValue('name', user.name);
                form.setFieldValue('lastnames', user.lastname);
                form.setFieldValue('role', user.roles);
                form.setFieldValue('username', user.username);
                setTitle('Información personal');
                setIsOpen(true);
                break;
            case 'settings':
                break;
            case 'help':
                setTitle('Ayuda');
                setIsOpen(true);
                break;
            case 'logout':
                navigate('/logout');
                break;
        }
    }

    const handleOnSavePassword = async () => {
        if (password != newPassword) {
            handleErrorNotification(Constants.DIFFERENT_PASSWORD);
            return;
        }
        if (password.length < 8) {
            handleErrorNotification(Constants.MIN_LENGTH);
            return;
        }
        try {
            setIsLoading(true);
            const user = session as User;
            await updatePassowrd(new UpdatePasswordRequest(user.username, password)).unwrap();
            handleSucccessNotification(NotificationSuccess.UPDATE);
            setIsOpen(false);
            setIsLoading(false);
        } catch (error) {
            handleErrorNotification(error);
            setIsLoading(false);
        }
    }

    const buildModalContent = () => {
        if (option == 'help') {
            return (<Result
                status="404"
                title="Ayuda"
                subTitle="A continuación veras la lista de contactos de ayuda"
                extra={
                    <div className="flex flex-col">
                        <SectionElement label="CallCenter" value={'7771231212'} icon={<></>} />
                        <SectionElement label="RH" value={'7771231212'} icon={<></>} />
                        <SectionElement label="Administración" value={'7771231212'} icon={<></>} />
                        <SectionElement label="Soporte técnico" value={'7771231212'} icon={<></>} />
                    </div>
                }
            />);
        } else if (option == 'account') {
            return (
                <div className="flex flex-col">
                    <Form form={form} name="horizontal_login" layout="vertical">
                        <Form.Item
                            name="username"
                            label={Strings.username}
                        >
                            <Input size="large" disabled prefix={<RiUser3Line />} placeholder={Strings.username} />
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label={Strings.nameLabel}
                        >
                            <Input size="large" disabled prefix={<RiUser3Line />} placeholder={Strings.nameLabel} />
                        </Form.Item>
                        <Form.Item
                            name="lastnames"
                            label={Strings.lastNames}
                        >
                            <Input size="large" disabled prefix={<RiUser3Line />} placeholder={Strings.lastNames} />
                        </Form.Item>
                        <Form.Item
                            name="role"
                            label={Strings.userRol}
                        >
                            <Input size="large" disabled prefix={<RiUser3Line />} placeholder={Strings.userRol} />
                        </Form.Item>
                    </Form>

                    <Divider>Cambiar contraseña</Divider>

                    <CustomFormInput isPassword={true} label="Nueva contraseña" value={password} onChange={(value) => setPassword(value)} />
                    <CustomFormInput isPassword={true} label="Confirmar contraseña" value={newPassword} onChange={(value) => setNewPassword(value)} />

                    <div className="flex items-end justify-end">
                        <Button loading={isLoading} className="mt-2 mb-8" onClick={() => handleOnSavePassword()}>Guardar contraseña</Button>
                    </div>

                </div>
            );
        }

    }

    return (
        <div>
            <Dropdown menu={{ items }} trigger={['click']}>
                <div className='flex gap-1 items-baseline  mr-8 cursor-pointer' onClick={(e) => e.preventDefault()}>
                    <span >{props.title}</span>
                    <RiArrowDownSLine size={20} />
                </div>
            </Dropdown>
            <Modal confirmLoading={isLoading} title={title} open={isOpen} onCancel={() => setIsOpen(false)} okText='Aceptar' onOk={() => setIsOpen(false)}>
                {buildModalContent()}
            </Modal>
        </div>
    );
}

export default HeaderAccount;