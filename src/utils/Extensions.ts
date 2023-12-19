import { format, parseISO } from 'date-fns';
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
    const callCenter = 'Call center';

    const isReceptionist = user.roles?.toLowerCase()
      .replace(/\s+/g, '')
      .includes(receptionist.toLowerCase().replace(/\s+/g, ''));


    const isCallCenter = user.roles?.toLowerCase()
      .replace(/\s+/g, '')
      .includes(callCenter.toLowerCase().replace(/\s+/g, ''));

    return isReceptionist ? '/receptionist/appointments' : isCallCenter ? '/callcenter' : '/';
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
    const callCenter = 'Call center';


    const isReceptionist = user.roles?.toLowerCase()
      .replace(/\s+/g, '')
      .includes(receptionist.toLowerCase().replace(/\s+/g, ''));


    const isCallCenter = user.roles?.toLowerCase()
      .replace(/\s+/g, '')
      .includes(callCenter.toLowerCase().replace(/\s+/g, ''));

    return isReceptionist ? UserRoles.RECEPTIONIST : isCallCenter ? UserRoles.CALL_CENTER : UserRoles.UNDEFINED;
  }
}

const isAdmin = (user: User): boolean => {
  return getUserRol(user) == UserRoles.ADMIN;
}

export enum UserRoles {
  ADMIN, RECEPTIONIST, UNDEFINED, CALL_CENTER
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

// const capitalizeFirstLetter = (value: string | undefined): string => {
//   if (value != undefined) {
//     return value?.charAt(0).toUpperCase() + value?.slice(1).toLowerCase();
//   }
//   return '';
// }

const capitalizeAllCharacters = (value: string | undefined): string => {
  if (value != undefined) {
    //return value.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    return value.toLocaleLowerCase().replace(/(^|\s)\S/g, function (match) {
      return match.toUpperCase();
    });
  }
  return ''
}

const formatAppointmentDate = (date: string, appointments: number) => {
  const previusDate = new Date(date);
  previusDate.setDate(previusDate.getDate() + 1);
  return `${dayName(previusDate)} ${previusDate.getDate()} de ${monthName(previusDate)}, Citas: ${appointments}`;
}


const formatServiceDate = (date?: Date): string => {
  if (date == null || date == undefined) return 'Sin fecha'
  return format(parseISO(date.toString()), 'yyy-MM-dd HH:mm')
}


const RESPONSIVE_LIST = {
  gutter: 4,
  xs: 1,
  sm: 2,
  md: 3,
  lg: 3,
  xl: 3,
  xxl: 4,
};

const RESPONSIVE_LIST_LARGE = {
  gutter: 4,
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 4,
  xxl: 4,
};
const RESPONSIVE_LIST_SMALL = {
  gutter: 4,
  xs: 1,
  sm: 2,
  md: 2,
  lg: 2,
  xl: 2,
  xxl: 2,
};


const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const formatPrice = (price: number | undefined): string => {
  if (price != null && price != undefined && !isNaN(price)) {
    return formatter.format(price);
  } else {
    return formatter.format(Number(0));
  }
}


const stringToDate = (data: string): Date => {
  const arrayDate = data.split('-');
  const date = new Date();
  date.setFullYear(Number(arrayDate[0]));
  date.setMonth(Number(arrayDate[1]) - 1);
  date.setDate(Number(arrayDate[2]))
  return date;
}

const formatNumberToPercent = (num: any): string => {
  return Number(num / 100).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 });
}

const getRandomKey = (): string => {
  return parseInt(Number(Math.random() * 10000000).toString()).toString();
}

const DEFAULT_COLOR = "36006E"

export {
  DEFAULT_COLOR,
  getRandomKey,
  getInitRoute,
  getUserRol,
  dayName,
  monthName,
  isAdmin,
  capitalizeAllCharacters,
  RESPONSIVE_LIST,
  RESPONSIVE_LIST_SMALL,
  RESPONSIVE_LIST_LARGE,
  formatPrice,
  stringToDate,
  formatNumberToPercent, formatAppointmentDate, formatServiceDate
}