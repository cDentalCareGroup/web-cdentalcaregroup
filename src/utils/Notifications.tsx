import React from "react";
import { Button, notification } from 'antd';
import { NotificationPlacement } from "antd/es/notification/interface";
import Constants from "./Constants";



export const handleErrorNotification = (value: any) => {
    if (value.hasOwnProperty('data') && value.data.hasOwnProperty('message')) {
        notification.open({
            message: 'Ups!',
            description: getErrorMessage(value.data.message),
            type: 'error'
        });
    } else {
        notification.open({
            message: 'Ups!',
            description: getErrorMessage(value),
            type: 'error'
        });
    }
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

const getErrorMessage = (message: string): string => {
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
    return 'Ocurrio un error, intenta mas tarde';
}
