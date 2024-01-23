import { ConfigProvider } from 'antd'
import Login from './pages/auth/Login'
import BaseLayout from './pages/layouts/BaseLayout'
import { Route, Routes } from "react-router-dom";
import RequireAuth from './pages/routes/RequireAuth';
import { adminRoutes, callCenterRoutes, receptionistRoutes } from './pages/routes/Routes';
import ScheduleAppointment from './pages/appointments/ScheduleAppointment';
import CancelAppointment from './pages/appointments/CancelAppointment';
import RescheduleAppointment from './pages/appointments/RescheduleAppointment';
import SummaryAppointment from './pages/appointments/SummaryAppointment';
import UnAuthorized from './pages/errors/UnAuthorized';
import NotFound from './pages/errors/NotFound';
import { SECONDARY_COLOR } from './utils/ConstantsColors';

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: SECONDARY_COLOR,
        }
      }}>
      <Routes>
        <Route index path='/' element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route element={<BaseLayout />}>
            {adminRoutes.map((value, index) => <Route key={index} path={value.fullPath} element={value.element} />)}
            {receptionistRoutes.map((value, index) => <Route key={index} path={value.fullPath} element={value.element} />)}
            {callCenterRoutes.map((value, index) => <Route key={index} path={value.fullPath} element={value.element} />)}
          </Route>
        </Route>


        <Route path="appointment">
          <Route path=":referal?" element={<ScheduleAppointment />} />
          <Route path="detail/:folio" element={<SummaryAppointment />} />
          <Route path="cancel/:folio" element={<CancelAppointment />} />
          <Route path="reschedule/:folio" element={<RescheduleAppointment />} />
        </Route>

        <Route index path='/unauthorized' element={<UnAuthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ConfigProvider>
  )
}





export default App
