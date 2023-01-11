import User from '../data/user/user';



const getInitRoute = (user: User): string => {
    const admin = 'Administración del sistema';

    const isAdmin = user.roles?.toLowerCase()
        .replace(/\s+/g, '')
        .includes(admin.toLowerCase().replace(/\s+/g, ''));
    if (isAdmin) {
        return '/admin/maps';
    } else {
        const receptionist = 'Recepción';

        const isReceptionist = user.roles?.toLowerCase()
            .replace(/\s+/g, '')
            .includes(receptionist.toLowerCase().replace(/\s+/g, ''));
        return isReceptionist ? '/receptionist' : '/';
    }
}

const getUserRol = (user: User): UserRoles => {
    const admin = 'Administración del sistema';

    const isAdmin = user.roles?.toLowerCase()
        .replace(/\s+/g, '')
        .includes(admin.toLowerCase().replace(/\s+/g, ''));
    if (isAdmin) {
        return UserRoles.ADMIN;
    } else {
        const receptionist = 'Recepción';

        const isReceptionist = user.roles?.toLowerCase()
            .replace(/\s+/g, '')
            .includes(receptionist.toLowerCase().replace(/\s+/g, ''));
        return isReceptionist ? UserRoles.RECEPTIONIST : UserRoles.UNDEFINED;
    }
}

export enum UserRoles {
    ADMIN, RECEPTIONIST, UNDEFINED
  }

export { getInitRoute,getUserRol }