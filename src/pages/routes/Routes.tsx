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
} from "react-icons/ri";
import { ItemType } from "antd/es/menu/hooks/useItems";
import User from "../../data/user/user";
import { getUserRol, UserRoles } from "../../utils/Extensions";
import Logout from "../auth/Logout";
import MapFilter from "../maps/MapFilter";
import BranchOffices from "../branchoffice/BranchOffices";
import Appointments from "../appointments/Appointments";
import AppointmentInfo from "../appointments/AppointmentInfo";
import RegisterPatientCard, { FormPatientType } from "../patients/FormPatient";
import Patients from "../patients/Patients";
import PatientInfo from "../patients/PatientInfo";
import FormPatient from "../patients/FormPatient";

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
const adminBranchOfficesAppointments = new Route('Citas', 'branchoffices', '/admin/branchoffices', <BranchOffices />, <RiCalendar2Line />);
const adminBranchOfficesSchedules = new Route('Horarios sucursales', 'branchoffices/schedules', '/admin/branchoffices/schedules', <div>branchoffices/schedules</div>, <RiCalendarCheckLine />);
const adminAppointments = new Route('CitasSucursal', 'appointments', '/admin/branchoffice/appointments', <Appointments rol={UserRoles.ADMIN} />, <RiCalendar2Line />);
const adminAppointmentDetails = new Route('Citas', 'appointmentinfo', '/admin/branchoffice/appointments/detail/:folio', <AppointmentInfo />, <RiCalendar2Line />);


const logout = new Route('Cerrar sesion', 'logout', '/logout', <Logout />, <RiLogoutBoxLine />);

const receptionistAppointments = new Route('Citas', 'citasreceptionis', '/receptionist/appointments', <Appointments rol={UserRoles.RECEPTIONIST} />, <RiCalendar2Line />);
const receptionistDetails = new Route('Citas', 'appointmentinforeceptionis', '/receptionist/appointments/detail/:folio', <AppointmentInfo />, <RiCalendar2Line />);

const receptionistRegisterPatients = new Route('RegistroPacientes', 'patientsRegister', '/receptionist/patients/register', <FormPatient type={FormPatientType.REGISTER} />, <RiUser3Line />);
const receptionistPatients = new Route('Pacientes', 'patients', '/receptionist/patients', <Patients />, <RiUser3Line />);
const receptionistPatientsInfo = new Route('PacientesInfo', 'patientsInfo', '/receptionist/patients/detail/:id', <PatientInfo />, <RiUser3Line />);


const adminRoutes: Route[] = [
    adminMap,
    adminBranchOfficesAppointments,
    adminBranchOfficesSchedules,
    adminAppointments,
    adminAppointmentDetails,
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

const getUserSidebar = (user: User): ItemType[] => {
    const rol = getUserRol(user);
    if (rol == UserRoles.ADMIN) {
        return adminRoutesToMenuOptions();
    }
    if(rol == UserRoles.RECEPTIONIST) {
        return receptionistRoutesToMenuOptions();
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
                // getItem(adminBranchOfficesSchedules.label, adminBranchOfficesSchedules.fullPath, adminBranchOfficesSchedules.icon)
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
                getItem(logout.label, logout.fullPath,logout.icon)
            ],
            'group'),
    ];
    return items;
}

export { adminRoutes, adminRoutesToMenuOptions,getUserSidebar,receptionistRoutesToMenuOptions,receptionistRoutes };