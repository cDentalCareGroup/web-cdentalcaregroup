import { ConfigProvider } from 'antd'
import Base from 'antd/es/typography/Base';
import { useState } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './pages/auth/Login'
import BaseLayout from './pages/layouts/BaseLayout'
import MapFilter from './pages/maps/MapFilter';
import { Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import RequireAuth from './pages/routes/RequireAuth';
import { adminRoutes, receptionistRoutes } from './pages/routes/Routes';
const App = () => {



  // const adminRouter = createBrowserRouter(
  //   [
  //     {
  //       path: '/',
  //       element: <Login />
  //     },
  //     {
  //       path: '/admin',
  //       element: <BaseLayout />,
  //       children: [
  //         {
  //           path: 'maps',
  //           element: <MapFilter />
  //         },
  //         {
  //           path: 'appointments',
  //           element: <div>appointments</div>
  //         },
  //       ],
  //       errorElement: <div>Page not found</div>,
  //     },
  //     {
  //       path: 'logout',
  //       element: <div>logout</div>
  //     }
  //   ]
  // );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1e40af',
        }
      }}>
      <Routes>
        <Route index path='/' element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route element={<BaseLayout />}>
            {adminRoutes.map((value, index) => <Route key={index} path={value.fullPath} element={value.element} />)}
            {receptionistRoutes.map((value, index) => <Route key={index} path={value.fullPath} element={value.element} />)}
          </Route>
        </Route>

      </Routes>
    </ConfigProvider>
  )
}





export default App
