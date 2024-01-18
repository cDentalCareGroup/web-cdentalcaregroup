import React, { useEffect, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, theme } from 'antd';
import Sidebar from '../components/Sidebar';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {  getUserSidebar } from '../routes/Routes';
import useSessionStorage from '../../core/sessionStorage';
import Constants from '../../utils/Constants';
import User from '../../data/user/user';
import { FirebaseOpenLinkType, getBrowserToken, handleOnMessage } from '../../services/firebase';
import { useSaveTokenMutation } from '../../services/authService';
import { SaveTokenRequest } from '../../data/user/user.request';
import Spinner from '../components/Spinner';
import { getUserRol, UserRoles } from '../../utils/Extensions';
import HeaderAccount from '../components/HeaderAccount';
import ModalReleaseNotes from '../components/ModalReleaseNotes';

const { Header, Content } = Layout;

const BaseLayout: React.FC = () => {

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [session, setSession] = useSessionStorage(Constants.SESSION_AUTH, null);
    const [saveTokenMutation] = useSaveTokenMutation();
    const location = useLocation();
    const navigate = useNavigate();
    if (session == null) {
        return <Spinner  />
    }


  useEffect(() => {
    validateRoute();
    requestPermission();
  }, []);


  const validateRoute = () => {
    const isAdminRoute = location.pathname.toLowerCase()
        .replace(/\s+/g, '')
        .includes('admin'.toLowerCase().replace(/\s+/g, ''));

      const isReceptionistRoute = location.pathname.toLowerCase()
        .replace(/\s+/g, '')
        .includes('receptionist'.toLowerCase().replace(/\s+/g, ''));

    const user = session as User;
    const rol = getUserRol(user);

    if (isAdminRoute && (rol == UserRoles.RECEPTIONIST || rol == UserRoles.CALL_CENTER)) {
        navigate('/unauthorized',{replace: true});
    }
    if (isReceptionistRoute && rol == UserRoles.CALL_CENTER) {
      navigate('/unauthorized',{replace: true});
    }
  }

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission == 'granted' && session != null) {
      const token = await getBrowserToken();
      handleSaveToken(token);
    } else if(permission == 'denied'){
      alert('Los permisos son requeridos');
    }
  }

  handleOnMessage((value) => { 
    if (value.type == FirebaseOpenLinkType.APPOINTMENT) {
      handleNavigateToAppointmentDetail(value.data);
    }
  });

  const handleNavigateToAppointmentDetail = (folio: String) => {
    const user = session as User;
     const role = getUserRol(user);
    if (role == UserRoles.ADMIN) {
      window.open(`https://cdentalcaregroup-fcdc9.web.app/admin/branchoffice/appointments/detail/${folio}`);
    } else {
      window.open(`https://cdentalcaregroup-fcdc9.web.app/receptionist/appointments/detail/${folio}`);
    }
  }

  const handleSaveToken = async(token: string) => {
    try { 
      const user = session as User;
      await saveTokenMutation(new SaveTokenRequest(user.username, token)).unwrap();
    } catch (error) {
      console.log(`Error saving token ${error}`);
    }
  }

  const formatName = (): string => {
    const user = session as User;
    return `${user.name} ${user.lastname}`;
}

    return (
        <Layout className='flex w-full h-screen'>
            <Sidebar items={getUserSidebar(session as User)} collapsed={collapsed} />
            <Layout className="site-layout">
                <Header style={{ padding: 0, background: colorBgContainer }}>
                   <div className='flex flex-row justify-between flex-nowrap items-baseline align-baseline'>
                   {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger flex p-4',
                        onClick: () => setCollapsed(!collapsed),
                    })}
                    <HeaderAccount title={formatName()} />
                   </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        background: colorBgContainer,
                    }}
                >
                    <Outlet />
                </Content>
               <ModalReleaseNotes />
            </Layout>
        </Layout>
    );
};

export default BaseLayout;