import { notification } from 'antd';
import Constants from "./Constants";



export const handleErrorNotification = (value: any, text?: string) => {
    if (value.hasOwnProperty('data') && value.data.hasOwnProperty('message')) {
        notification.open({
            message: 'Ups!',
            description: getErrorMessage(value.data.message),
            type: 'error'
        });
    } else {
        notification.open({
            message: 'Ups!',
            description: getErrorMessage(value, text),
            type: 'error'
        });
    }
}

export const handleWarningNotification = (value: string) => {
    notification.open({
        message: 'Aviso!',
        description: value,
        type: 'warning'
    });
}

export const handleSucccessNotification = (value: NotificationSuccess) => {
    notification.open({
        message: 'Exito!',
        description: getSuccessMessage(value),
        type: 'success'
    });
}

export enum NotificationSuccess {
    REGISTER, UPDATE, REGISTER_APPOINTMENT, RESCHEDULE_APPOINTMENT, SUCCESS_DELETE
}

const getSuccessMessage = (type: NotificationSuccess): string => {
    if (type == NotificationSuccess.REGISTER) {
        return 'Se registro correctamente';
    }

    if (type == NotificationSuccess.UPDATE) {
        return 'Se actualizo correctamente';
    }

    if (type == NotificationSuccess.REGISTER_APPOINTMENT) {
        return 'Cita registrada correctamente';
    }
    if (type == NotificationSuccess.RESCHEDULE_APPOINTMENT) {
        return 'Cita reagendada correctamente';
    }
    if (type == NotificationSuccess.SUCCESS_DELETE) {
        return 'Se elimino correctamente';
    }

    return 'Se realizó correctamente';
}

const getErrorMessage = (message: string, text?: string): string => {
    if (message == 'NO_ERROR_REGISTER') {
        return 'Ocurrio un error, intenta mas tarde';
    }
    if (message == 'INCORRECT_PASSWORD') {
        return 'Usuario y/o contraseña incorrectos';
    }
    if (message == 'NOT_FOUND_CP') {
        return 'No se encontró el código postal';
    }
    if (message == 'PATIENT_EXISTS') {
        return "El paciente ya esta registrado"
    }
    if (message == Constants.EMPTY_SERVICE) {
        return "Debes seleccionar un servicio"
    }
    if (message == Constants.EMPTY_PAYMENT_METHOD) {
        return "Debes seleccionar un método de pago"
    }
    if (message == Constants.EMPTY_COST) {
        return "Debes ingresar un costo, si no aplica ingresa 0"
    }
    if (message == Constants.EXISTING_SERVICE) {
        return "Ya existe ese servicio";
    }
    if (message == 'REGISTER_EXISTS') {
        return 'Ya existe un registro con esos datos'
    }
    if (message == Constants.EMPTY_TIMES) {
        return 'Debes seleccionar al menos un horario para extender'
    }
    if (message == Constants.PATIENT_PAD_EXISTS) {
        return 'El paciente seleccionado ya ha sido agregado'
    }
    if (message == Constants.IS_INDIVIDUAL_PAD) {
        return 'En el PAD individual solo puedes agregar un miembro';
    }
    if (message == Constants.MAX_MEMBERS_PAD) {
        return 'Has llegado al número máximo de miembros permitidos para el PAD';
    }

    if (message == Constants.EXISTING_PAYMENT_METHOD) {
        return 'Ya has registrado ese método de pago';
    }
    if (message == Constants.EMPTY_AMOUNT) {
        return 'El monto recibido debe ser mayor a cero';
    }

    if (message == Constants.DIFFERENT_PASSWORD) {
        return 'Las contraseñas no coinciden';
    }

    if (message == Constants.MIN_LENGTH) {
        return 'La contraseña debe ser de mínimo 8 caracteres';
    }
    if (message == Constants.ALREADY_EXIST_SERVICE) {
        return 'Ya has agregado el servicio, modifica la cantidad si deseas agregar mas unidades';
    }

    if (message == Constants.ALREADY_EXIST_SERVICE_PAD) {
        return `${text}`;
    }

    if (message == Constants.DEBT_ACTIVE) {
        return `No puedes finalizar una cita hasta pagar el saldo pendiente del paciente`;
    }

    if (message == Constants.PAYMENT_DEBT_ACTIVE) {
        return `El paciente cuenta con un saldo pendiente por liquidar`;
    }

    if (message == Constants.REQUIRED_FIELDS) {
        return `Tienes campos vacios`;
    }
    if (message == Constants.ERROR_ADDING_PAD_COMPONENT) {
        return `Error al agregar el servicio del PAD, por favor regresa a la pantalla anterior y vuelve o refresca la página`;
    }
    if(message == 'EMPTY_PATIENT') {
        return `Ocurrio un error al asignar el paciente, refresca la página e intenta nuevamente`;
    }

    if (message == Constants.SET_TEXT) {
        return `${text}`;
    }
    if(message == 'APPOINTMENT_EXISTS') {
        return `Ya existe una cita registrada para ese paciente en el mismo horario`;
    }
    return 'Ocurrio un error, intenta mas tarde';
}
