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
import Strings from '../../utils/Strings';

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

    const formatName = (): string => {
        const user = session as User;
        return `${user.name} ${user.lastname}`;
    }

  useEffect(() => {
    validateRoute();
    requestPermission();
  }, []);


  const validateRoute = () => {
    const isAdminRoute = location.pathname.toLowerCase()
        .replace(/\s+/g, '')
        .includes('admin'.toLowerCase().replace(/\s+/g, ''));
    const user = session as User;
    const rol = getUserRol(user);

    if (isAdminRoute && rol == UserRoles.RECEPTIONIST) {
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
    console.log(folio);
    //navigation(`/admin/appointment/detail/${folio }`);
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

    return (
        <Layout className='flex w-full h-screen'>
            <Sidebar items={getUserSidebar(session as User)} collapsed={collapsed} />
            <Layout className="site-layout">
                <Header style={{ padding: 0, background: colorBgContainer }}>
                   <div className='flex flex-row justify-between flex-nowrap'>
                   {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger flex p-4',
                        onClick: () => setCollapsed(!collapsed),
                    })}
                    <span className='mr-8'>{formatName()}</span>
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
               <div className='flex w-full items-end justify-end'>
               <span className='mr-2 mb-1 text-xs text-gray-300'>{Strings.appVersion}</span>
               </div>
            </Layout>
        </Layout>
    );
};

export default BaseLayout;
// import { useEffect, useState } from "react";


// const adminRoutes = [
//     {
//       section:'Administración',
//       routes:[
//         {
//           name: "Dashboard",
//           path: "dashboard",
//           icon: <RiMap2Line />,
//           content: <div />,
//           fullPath: 'AppRoutes.admin.dashboard',
//           show: false,
//         },
//         {
//           name: "Maps",
//           path: "maps",
//           icon: <RiMap2Line />,
//           content: <div />,
//           fullPath: 'AppRoutes.admin.maps',
//           show: true,
//         }
//       ]
//     },
// ]


// const BaseLayout = () => {
//   const [open, setOpen] = useState(true);
// //   const location = useLocation();
//    const [selectedPath, setSelectedPath] = useState('');

// //   useEffect(() => {
// //     setSelectedPath(location.pathname);
// //   }, [location]);


//   return (
//     <section className="flex gap-6">
//       <div
//         className={`min-h-screen ${open ? "w-64" : "w-20"
//           } duration-300 px-4 bg-[#00152A] shadow-md`}
//       >
//         <div className="py-3 flex justify-end">
//           <RiMenu3Fill
//             size={26}
//             className={`cursor-pointer text-white ${!open && "rotate-180"
//               } duration-300`}
//             onClick={() => setOpen(!open)}
//           />
//         </div>
//         <div className="mt-4 flex flex-col gap-4 relative">
//           <div className="flex flex-col flex-wrap items-center justify-center">
//             <img
//               alt="logo"
//               className="object-cover w-20"
//               src="https://firebasestorage.googleapis.com/v0/b/cdentalcaregroup-fcdc9.appspot.com/o/Logos%2Fmain_logo.png?alt=media&token=d70a9685-7b64-4491-aea1-5b59dbda3ac8"
//             />
//             <div className="text-left font-bold">
//               <span className="text-white">CDental Care Group</span>
//             </div>
//             <div className="border-2 w-10 mt-4 border-white inline-block mb-4"></div>
//           </div>

//           {adminRoutes?.map((section, indexSection) => (
//             <div key={indexSection} className="">
//               {open && <span className="text-gray-500 text-sm ml-2">{section.section}</span>}
//               {section.routes.filter((route: any,_: number) => route.show).map((menu: any, index: number) => <div
                
//                 key={index}
//                 className={`group  ${open ? 'ml-6 mt-2' : 'ml-0'} flex items-center text-sm  gap-4 p-4 font-medium  rounded-md ${selectedPath == menu.fullPath ? 'bg-blue-800 text-white' : 'text-gray-500 bg-white hover:bg-gray-200 hover:text-gray-500'}`}
//               >
//                 <div>{menu.icon}</div>
//                 <h2
//                   className={`whitespace-pre  ${!open && "opacity-0 translate-x-28 overflow-hidden"
//                     }`}
//                 >
//                   {menu?.name}
//                 </h2>
//                 <h2
//                   className={`${open && "hidden"
//                     } absolute text-blue-800 font-semibold whitespace-pre rounded-md px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-16 group-hover:duration-300 group-hover:w-fit  `}
//                 >
//                   {menu?.name}
//                 </h2>
//               </div>)}
//             </div>
//           ))}

//           <span className="flex text text-sm text-gray-300">v.1.0.7</span>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default BaseLayout;