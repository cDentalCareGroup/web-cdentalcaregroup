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
    return isReceptionist ? '/receptionist/appointments' : '/';
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

const isAdmin = (user: User): boolean => {
  return getUserRol(user) == UserRoles.ADMIN;
}

export enum UserRoles {
  ADMIN, RECEPTIONIST, UNDEFINED
}


const dayName = (d: Date): string => {
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const day = days[d.getDay()];

  let spanishDay = 'Lunes';
  switch (day) {
    case 'Monday':
      spanishDay = 'Lunes'
      break;
    case 'Tuesday':
      spanishDay = 'Martes'
      break;
    case 'Wednesday':
      spanishDay = 'Miercoles'
      break;
    case 'Thursday':
      spanishDay = 'Jueves'
      break;
    case 'Friday':
      spanishDay = 'Viernes'
      break;
    case 'Saturday':
      spanishDay = 'Sabado'
      break;
    case 'Sunday':
      spanishDay = 'Domingo'
      break;
  }
  return spanishDay;
}

const monthName = (d: Date): string => {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const month = monthNames[d.getMonth()];


  let monthName = 'Enero';
  switch (month) {
    case 'January':
      monthName = 'Enero'
      break;
    case 'February':
      monthName = 'Febrero'
      break;
    case 'March':
      monthName = 'Marzo'
      break;
    case 'April':
      monthName = 'Abril'
      break;
    case 'May':
      monthName = 'Mayo'
      break;
    case 'June':
      monthName = 'Junio'
      break;
    case 'July':
      monthName = 'Julio'
      break;
    case 'August':
      monthName = 'Agosto'
      break;
    case 'September':
      monthName = 'Septiembre'
      break;
    case 'October':
      monthName = 'Octubre'
      break;
    case 'November':
      monthName = 'Noviembre'
      break;
    case 'December':
      monthName = 'Diciembre'
      break;
  }
  return monthName;
}

const capitalizeFirstLetter = (value: string | undefined): string => {
  if (value != undefined) {
    return value?.charAt(0).toUpperCase() + value?.slice(1).toLowerCase();
  }
  return '';
}

export { getInitRoute, getUserRol, dayName, monthName, isAdmin, capitalizeFirstLetter }