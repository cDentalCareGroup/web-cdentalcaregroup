import { MenuProps } from "antd";
import { getItem } from "../components/Sidebar";
import {
    
    RiUser3Line,
    RiCalendarCheckLine,
    RiLogoutBoxLine,
    RiMap2Line,
    RiCalendar2Line,
    RiPhoneLine,
    RiUserHeartLine,
    RiServiceLine,
    RiBankLine,
} from "react-icons/ri";
import { ItemType } from "antd/es/menu/hooks/useItems";
import User from "../../data/user/user";
import { getUserRol, UserRoles } from "../../utils/Extensions";
import Logout from "../auth/Logout";
import MapFilter from "../maps/MapFilter";
import BranchOffices, { BranchOfficeType } from "../branchoffice/BranchOffices";
import Appointments from "../appointments/Appointments";
import AppointmentInfo from "../appointments/AppointmentInfo";
import { FormPatientType, FormPatientSource } from "../patients/FormPatient";
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
import PadCatalogues from "../pad/PadCatalogues";
import FormPadCatalogue, { FormPadCatalogueType } from "../pad/FormPadCatalogue";
import Pads from "../pad/Pads";
import FormPad from "../pad/FormPad";
import Services from "../service/Services";
import Prospects from "../prospect/Prospects";
import Test from "../components/Test";
import Dashboard from "../dashboard/Dashboard";
import { AvailableTime } from "../../data/appointment/available.time";
import AvailableTimes from "../schedules/FormAvailableTimes";
import Origins from "../origins/Origins";
import FormAvailableTimes from "../schedules/FormAvailableTimes";
import Organizations from "../organization/Organizations";

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
const adminStatistics = new Route('Estadisticas', 'statistics', '/admin/dashboard', <Dashboard />, <RiMap2Line />);

const adminMap = new Route('Maps', 'maps', '/admin/maps', <MapFilter />, <RiMap2Line />);
const adminBranchOfficesAppointments = new Route('Citas', 'branchoffices', '/admin/branchoffices/appointments', <BranchOffices rol={UserRoles.ADMIN} type={BranchOfficeType.APPOINTMENTS} />, <RiCalendar2Line />);
const adminBranchOfficesSchedules = new Route('Horarios', 'branchoffices/schedules', '/admin/branchoffices/schedules', <BranchOffices rol={UserRoles.ADMIN} type={BranchOfficeType.SCHEDULES} />, <RiCalendarCheckLine />);
const adminBranchOfficeSchedules = new Route('HorariosSucursal', 'branchoffices/schedules/detail', '/admin/branchoffices/schedules/detail/:id', <SchedulesBranchOffice />, <RiCalendarCheckLine />);
const adminEmployees = new Route('Empleados', 'employees', '/admin/employees', <Employees />, <RiUser3Line />);
const adminRegistrerEmployees = new Route('Employees', 'employeesregister', '/admin/employees/register', <FormEmployee type={FormEmployeeType.REGISTER} />, <RiCalendar2Line />);
const adminEmployeesInfo = new Route('Employees', 'employeesinfo', '/admin/employees/detail/:id', <EmployeeInfoCard />, <RiUser3Line />);
const adminPatients = new Route('Pacientes', 'patients', '/admin/patients', <Patients rol={UserRoles.ADMIN} />, <RiUserHeartLine />);
const adminRegisterPatients = new Route('RegistroPacientes', 'patientsRegister', '/admin/patients/register', <FormPatient source={FormPatientSource.FORM} type={FormPatientType.REGISTER} rol={UserRoles.ADMIN} />, <RiUser3Line />);
const adminPatientsInfo = new Route('PacientesInfo', 'patientsInfo', '/admin/patients/detail/:id', <PatientInfo rol={UserRoles.ADMIN} />, <RiUser3Line />);
const adminProspects = new Route('Prospectos', 'prospects', '/admin/prospects', <Prospects />, <RiUser3Line />);
const adminPad = new Route('Pads', 'pad', '/admin/pad/', <Pads rol={UserRoles.ADMIN} />, <RiUserHeartLine />);
const adminPadCatalogue = new Route('Pad catalogos', 'padCatalogue', '/admin/pad/catalogs/', <PadCatalogues />, <RiUserHeartLine />);
const adminPadCatalogueForm = new Route('Form pad catalogos', 'formPadCatalogue', '/admin/pad/catalogs/register', <FormPadCatalogue type={FormPadCatalogueType.REGISTER} />, <RiUserHeartLine />);
const adminPadCatalogueFormUpdate = new Route('Form pad catalogos', 'formPadCatalogue', '/admin/pad/catalogs/detail/:id', <FormPadCatalogue type={FormPadCatalogueType.UPDATE} />, <RiUserHeartLine />);
const adminAppointments = new Route('CitasSucursal', 'appointments', '/admin/branchoffice/appointments', <Appointments rol={UserRoles.ADMIN} />, <RiCalendar2Line />);
const adminAppointmentDetails = new Route('Citas', 'appointmentinfo', '/admin/branchoffice/appointments/detail/:folio', <AppointmentInfo rol={UserRoles.ADMIN} />, <RiCalendar2Line />);
const adminService = new Route('Servicios', 'services', '/admin/services/', <Services />, <RiServiceLine />);
const adminCallsType = new Route('Catalogo llamadas', 'callsType', '/admin/calltypes', <CallsType />, <RiPhoneLine />);
const adminOrigins = new Route('Origenes', 'origins', '/admin/origins', <Origins />, <RiBankLine />);
const adminOrganization = new Route('Organizaciones', 'organizations', '/admin/organizations', <Organizations />, <RiBankLine />);

const test = new Route('Test', 'test', '/admin/test/', <FormAvailableTimes />, <RiUserHeartLine />);


const logout = new Route('Cerrar sesión', 'logout', '/logout', <Logout />, <RiLogoutBoxLine />);

const receptionistAppointments = new Route('Citas', 'citasreceptionis', '/receptionist/appointments', <Appointments rol={UserRoles.RECEPTIONIST} />, <RiCalendar2Line />);
const receptionistDetails = new Route('Citas', 'appointmentinforeceptionis', '/receptionist/appointments/detail/:folio', <AppointmentInfo rol={UserRoles.RECEPTIONIST} />, <RiCalendar2Line />);
const receptionistRegisterPatients = new Route('RegistroPacientes', 'patientsRegister', '/receptionist/patients/register', <FormPatient source={FormPatientSource.FORM} type={FormPatientType.REGISTER} rol={UserRoles.RECEPTIONIST} />, <RiUser3Line />);
const receptionistPatients = new Route('Pacientes', 'patients', '/receptionist/patients', <Patients rol={UserRoles.RECEPTIONIST} />, <RiUserHeartLine />);
const receptionistPatientsInfo = new Route('PacientesInfo', 'patientsInfo', '/receptionist/patients/detail/:id', <PatientInfo rol={UserRoles.RECEPTIONIST} />, <RiUser3Line />);
const receptionistService = new Route('Servicios', 'services', '/receptionist/services/', <Services />, <RiServiceLine />);
const receptionistPad = new Route('Pads', 'pad', '/receptionist/pad/', <Pads rol={UserRoles.RECEPTIONIST} />, <RiUserHeartLine />);

//const receptionistTimes = new Route('Horarios', 'times', '/receptionist/times/', <AvailableTimes />, <RiCalendarCheckLine />);

const callCenter = new Route('Llamadas', 'callCenter', '/callcenter', <Calls />, <RiUser3Line />);
const callCenterCalInfo = new Route('Call Center', 'callCenterInfo', '/callcenter/call', <CallInfo />, <RiUser3Line />);
//const callsType = new Route('Catalogo llamadas', 'callsType', '/callcenter/calltypes', <CallsType />, <RiPhoneLine />);
const callsPatients = new Route('Pacientes', 'patients', '/callcenter/patients', <Patients rol={UserRoles.CALL_CENTER} />, <RiUserHeartLine />);
const callsRegisterPatients = new Route('RegistroPacientes', 'patientsRegister', '/callcenter/patients/register', <FormPatient source={FormPatientSource.FORM} type={FormPatientType.REGISTER} rol={UserRoles.CALL_CENTER} />, <RiUser3Line />);
const callsPatientsInfo = new Route('PacientesInfo', 'patientsInfo', '/callcenter/patients/detail/:id', <PatientInfo rol={UserRoles.CALL_CENTER} />, <RiUser3Line />);
const callBranchOfficesAppointments = new Route('Citas', 'branchoffices', '/callcenter/branchoffices/appointments', <BranchOffices rol={UserRoles.CALL_CENTER} type={BranchOfficeType.APPOINTMENTS} />, <RiCalendar2Line />);
const callAppointments = new Route('CitasSucursal', 'appointments', '/callcenter/branchoffice/appointments', <Appointments rol={UserRoles.CALL_CENTER} />, <RiCalendar2Line />);


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
    adminProspects,
    adminRegisterPatients,
    adminPatientsInfo,
    adminPad,
    adminPadCatalogue,
    adminPadCatalogueForm,
    adminPadCatalogueFormUpdate,
    adminService,
    test,
    adminCallsType,
    adminStatistics,
    adminOrigins,
    adminOrganization,
    logout
];

const receptionistRoutes: Route[] = [
    receptionistAppointments,
    receptionistDetails,
    receptionistPatients,
    receptionistRegisterPatients,
    receptionistPatientsInfo,
    receptionistService,
    receptionistPad,
    logout
];


const callCenterRoutes: Route[] = [
    callCenter,
    callCenterCalInfo,
    //callsType,
    callsPatients,
    callsRegisterPatients,
    callsPatientsInfo,
    callBranchOfficesAppointments,
    callAppointments,
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
                getItem(adminStatistics.label, adminStatistics.fullPath, adminStatistics.icon),
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
                getItem(adminPatients.label, adminPatients.fullPath, adminPatients.icon),
                getItem(adminProspects.label, adminProspects.fullPath, adminProspects.icon)
            ],
            'group'),
        getItem(
            'Pads',
            'pads',
            null,
            [
                getItem(adminPad.label, adminPad.fullPath, adminPad.icon),
                getItem(adminPadCatalogue.label, adminPadCatalogue.fullPath, adminPadCatalogue.icon)
            ],
            'group'),
        getItem(
            'Servicios',
            'services',
            null,
            [
                getItem(adminService.label, adminService.fullPath, adminService.icon),
            ],
            'group'),
        getItem(
            'Llamadas',
            'calls',
            null,
            [
                getItem(adminCallsType.label, adminCallsType.fullPath, adminCallsType.icon),
            ],
            'group'),
        getItem(
            'Pacientes Origenes',
            'origins',
            null,
            [
                getItem(adminOrigins.label, adminOrigins.fullPath, adminOrigins.icon),
            ],
            'group'),
            getItem(
                'Organizaciones',
                'organizations',
                null,
                [
                    getItem(adminOrganization.label, adminOrganization.fullPath, adminOrganization.icon),
                ],
                'group'),
        getItem(
            'Configuración',
            'cng',
            null,
            [
                getItem(logout.label, logout.fullPath, logout.icon),
                // getItem(test.label, test.fullPath, test.icon),

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
                // getItem(receptionistTimes.label, receptionistTimes.fullPath, receptionistTimes.icon),
            ],
            'group'),
        getItem(
            'Pads',
            'pads',
            null,
            [
                getItem(receptionistPad.label, receptionistPad.fullPath, receptionistPad.icon),
            ],
            'group'),
        getItem(
            'Servicios',
            'services',
            null,
            [
                getItem(receptionistService.label, receptionistService.fullPath, receptionistService.icon),
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
            'Call Center',
            'cli',
            null,
            [
                getItem(callCenter.label, callCenter.fullPath, callCenter.icon),

            ],
            'group'),
        getItem(
            'Clinicas',
            'clicalls',
            null,
            [
                getItem(callBranchOfficesAppointments.label, callBranchOfficesAppointments.fullPath, callBranchOfficesAppointments.icon),
                getItem(callsPatients.label, callsPatients.fullPath, callsPatients.icon),
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