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
const logout = new Route('Cerrar sesion', 'logout', '/logout', <Logout />, <RiLogoutBoxLine />);

const adminAppointments = new Route('Citas', 'appointments', '/admin/branchoffice/appointment', <Appointments />, <RiCalendar2Line />);

const receptionistAppointments = new Route('Citas', 'citas', '/receptionist/appointments', <div>receptionist </div>, <RiCalendar2Line />);

const adminRoutes: Route[] = [
    adminMap,
    adminBranchOfficesAppointments,
    adminBranchOfficesSchedules,
    adminAppointments,
    logout
];

const receptionistRoutes: Route[] = [
    receptionistAppointments,
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
                getItem(adminBranchOfficesSchedules.label, adminBranchOfficesSchedules.fullPath, adminBranchOfficesSchedules.icon)
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