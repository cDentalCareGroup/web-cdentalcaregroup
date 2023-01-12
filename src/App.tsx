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
import ScheduleAppointment from './pages/appointments/ScheduleAppointment';
import CancelAppointment from './pages/appointments/CancelAppointment';
import RescheduleAppointment from './pages/appointments/RescheduleAppointment';
import SummaryAppointment from './pages/appointments/SummaryAppointment';
const App = () => {
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


        <Route path="appointment">
          <Route path="" element={<ScheduleAppointment />} />
          <Route path="detail/:folio" element={<SummaryAppointment />} />
          <Route path="cancel/:folio" element={<CancelAppointment />} />
          <Route path="reschedule/:folio" element={<RescheduleAppointment />} />
        </Route>
      </Routes>
    </ConfigProvider>
  )
}





export default App
