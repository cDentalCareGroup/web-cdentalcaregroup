import React from "react";
import { Button, notification } from 'antd';
import { NotificationPlacement } from "antd/es/notification/interface";



export const handleErrorNotification = (value: any) => {
    console.log(value);
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
    REGISTER, UPDATE, REGISTER_APPOINTMENT, RESCHEDULE_APPOINTMENT
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
    return 'Ocurrio un error, intenta mas tarde';
}
