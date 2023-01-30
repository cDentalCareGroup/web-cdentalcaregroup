import { MenuProps } from "antd";
import { getItem } from "../components/Sidebar";
import {
    RiMenu3Fill,
    RiUser3Line,
    RiCalendarCheckLine,
    RiLogoutBoxLine,
    RiMessage2Line,
    RiMap2Line,
    RiDashboardLine,
    RiCalendar2Line,
    RiMentalHealthLine,
    RiPhoneLine,
    RiUserHeartLine,
} from "react-icons/ri";
import { ItemType } from "antd/es/menu/hooks/useItems";
import User from "../../data/user/user";
import { getUserRol, UserRoles } from "../../utils/Extensions";
import Logout from "../auth/Logout";
import MapFilter from "../maps/MapFilter";
import BranchOffices, { BranchOfficeType } from "../branchoffice/BranchOffices";
import Appointments from "../appointments/Appointments";
import AppointmentInfo from "../appointments/AppointmentInfo";
import RegisterPatientCard, { FormPatientType } from "../patients/FormPatient";
import Patients from "../patients/Patients";
import PatientInfo from "../patients/PatientInfo";
import FormPatient from "../patients/FormPatient";
import SchedulesBranchOffice from "../branchoffice/schedules/SchedulesBranchOffice";
import Employees from "../employees/Employees";
import FormEmployee, { FormEmployeeType } from "../employees/FormEmployee";
import EmployeeInfo from "../employees/EmployeeInfo";
import EmployeeInfoCard from "../employees/EmployeeInfo";
import Calls from "../callcenter/Calls";
import CallInfo from "../callcenter/CallInfo";
import CallsType from "../callcenter/CallsType";

export class Route {
    label: string;
    path: string;
    fullPath: string;
    element: JSX.Element;
    icon: JSX.Element;

    constructor(label: string, path: string,
        fullPath: string,
        element: JSX.Element, icon: JSX.Element) {
        this.label = label;
        this.path = path;
        this.fullPath = fullPath;
        this.element = element;
        this.icon = icon;
    }

}

const adminMap = new Route('Maps', 'maps', '/admin/maps', <MapFilter />, <RiMap2Line />);
const adminBranchOfficesAppointments = new Route('Citas', 'branchoffices', '/admin/branchoffices/appointments', <BranchOffices type={BranchOfficeType.APPOINTMENTS} />, <RiCalendar2Line />);
const adminBranchOfficesSchedules = new Route('Horarios', 'branchoffices/schedules', '/admin/branchoffices/schedules', <BranchOffices type={BranchOfficeType.SCHEDULES} />, <RiCalendarCheckLine />);
const adminBranchOfficeSchedules = new Route('HorariosSucursal', 'branchoffices/schedules/detail', '/admin/branchoffices/schedules/detail/:id', <SchedulesBranchOffice />, <RiCalendarCheckLine />);
const adminEmployees = new Route('Empleados', 'employees', '/admin/employees', <Employees />, <RiUser3Line />);
const adminRegistrerEmployees = new Route('Employees', 'employeesregister', '/admin/employees/register', <FormEmployee type={FormEmployeeType.REGISTER} />, <RiCalendar2Line />);
const adminEmployeesInfo = new Route('Employees', 'employeesinfo', '/admin/employees/detail/:id', <EmployeeInfoCard />, <RiUser3Line />);
const adminPatients = new Route('Pacientes', 'patients', '/admin/patients', <Patients rol={UserRoles.ADMIN} />, <RiUserHeartLine />);
const adminRegisterPatients = new Route('RegistroPacientes', 'patientsRegister', '/admin/patients/register', <FormPatient type={FormPatientType.REGISTER} rol={UserRoles.ADMIN} />, <RiUser3Line />);
const adminPatientsInfo = new Route('PacientesInfo', 'patientsInfo', '/admin/patients/detail/:id', <PatientInfo rol={UserRoles.ADMIN} />, <RiUser3Line />);


const adminAppointments = new Route('CitasSucursal', 'appointments', '/admin/branchoffice/appointments', <Appointments rol={UserRoles.ADMIN} />, <RiCalendar2Line />);
const adminAppointmentDetails = new Route('Citas', 'appointmentinfo', '/admin/branchoffice/appointments/detail/:folio', <AppointmentInfo />, <RiCalendar2Line />);


const logout = new Route('Cerrar sesion', 'logout', '/logout', <Logout />, <RiLogoutBoxLine />);

const receptionistAppointments = new Route('Citas', 'citasreceptionis', '/receptionist/appointments', <Appointments rol={UserRoles.RECEPTIONIST} />, <RiCalendar2Line />);
const receptionistDetails = new Route('Citas', 'appointmentinforeceptionis', '/receptionist/appointments/detail/:folio', <AppointmentInfo />, <RiCalendar2Line />);
const receptionistRegisterPatients = new Route('RegistroPacientes', 'patientsRegister', '/receptionist/patients/register', <FormPatient type={FormPatientType.REGISTER} rol={UserRoles.RECEPTIONIST} />, <RiUser3Line />);
const receptionistPatients = new Route('Pacientes', 'patients', '/receptionist/patients', <Patients rol={UserRoles.RECEPTIONIST} />, <RiUserHeartLine />);
const receptionistPatientsInfo = new Route('PacientesInfo', 'patientsInfo', '/receptionist/patients/detail/:id', <PatientInfo rol={UserRoles.RECEPTIONIST} />, <RiUser3Line />);


const callCenter = new Route('Call Center', 'callCenter', '/callcenter', <Calls />, <RiUser3Line />);
const callCenterCalInfo = new Route('Call Center', 'callCenterInfo', '/callcenter/call', <CallInfo />, <RiUser3Line />);
const callsType= new Route('LLamadas', 'callsType', '/callcenter/calltypes', <CallsType />, <RiPhoneLine />);


const adminRoutes: Route[] = [
    adminMap,
    adminBranchOfficesAppointments,
    adminBranchOfficesSchedules,
    adminBranchOfficeSchedules,
    adminAppointments,
    adminAppointmentDetails,
    adminEmployees,
    adminRegistrerEmployees,
    adminEmployeesInfo,
    adminPatients,
    adminRegisterPatients,
    adminPatientsInfo,
    logout
];

const receptionistRoutes: Route[] = [
    receptionistAppointments,
    receptionistDetails,
    receptionistPatients,
    receptionistRegisterPatients,
    receptionistPatientsInfo,
    logout
];


const callCenterRoutes: Route[] = [
    callCenter,
    callCenterCalInfo,
    callsType,
    logout,
];

const getUserSidebar = (user: User): ItemType[] => {
    const rol = getUserRol(user);
    if (rol == UserRoles.ADMIN) {
        return adminRoutesToMenuOptions();
    }
    if (rol == UserRoles.RECEPTIONIST) {
        return receptionistRoutesToMenuOptions();
    }
    if (rol == UserRoles.CALL_CENTER) {
        return callCenterRoutesToMenuOptions();
    }
    return [];
}
const adminRoutesToMenuOptions = (): ItemType[] => {
    const items: MenuProps['items'] = [
        getItem(
            'Administración',
            'adm',
            null,
            [
                getItem(adminMap.label, adminMap.fullPath, adminMap.icon)
            ],
            'group'),
        getItem(
            'Clinicas',
            'cli',
            null,
            [
                getItem(adminBranchOfficesAppointments.label, adminBranchOfficesAppointments.fullPath, adminBranchOfficesAppointments.icon),
                getItem(adminBranchOfficesSchedules.label, adminBranchOfficesSchedules.fullPath, adminBranchOfficesSchedules.icon),
                getItem(adminEmployees.label, adminEmployees.fullPath, adminEmployees.icon),
                getItem(adminPatients.label, adminPatients.fullPath, adminPatients.icon)

            ],
            'group'),
        getItem(
            'Configuración',
            'cng',
            null,
            [
                getItem(logout.label, logout.fullPath, logout.icon)
            ],
            'group'),
    ];
    return items;
}

const receptionistRoutesToMenuOptions = (): ItemType[] => {
    const items: MenuProps['items'] = [
        getItem(
            'Clinica',
            'cli',
            null,
            [
                getItem(receptionistAppointments.label, receptionistAppointments.fullPath, receptionistAppointments.icon),
                getItem(receptionistPatients.label, receptionistPatients.fullPath, receptionistPatients.icon),
            ],
            'group'),
        getItem(
            'Configuración',
            'cng',
            null,
            [
                getItem(logout.label, logout.fullPath, logout.icon)
            ],
            'group'),
    ];
    return items;
}

const callCenterRoutesToMenuOptions = (): ItemType[] => {
    const items: MenuProps['items'] = [
        getItem(
            'Administracion',
            'cli',
            null,
            [
                getItem(callCenter.label, callCenter.fullPath, callCenter.icon),
                getItem(callsType.label, callsType.fullPath, callsType.icon),
            ],
            'group'),
        getItem(
            'Configuración',
            'cng',
            null,
            [
                getItem(logout.label, logout.fullPath, logout.icon)
            ],
            'group'),
    ];
    return items;
}

export { adminRoutes, adminRoutesToMenuOptions, getUserSidebar, receptionistRoutesToMenuOptions, receptionistRoutes, callCenterRoutes };