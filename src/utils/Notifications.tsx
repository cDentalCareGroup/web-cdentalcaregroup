import React from "react";
import { Button, notification } from 'antd';
import { NotificationPlacement } from "antd/es/notification/interface";



export const handleErrorNotification = (value: any) => {
    console.log(value);
    if (value.hasOwnProperty('data') && value.data.hasOwnProperty('message')) {
        notification.open({
            message: 'Ups!',
            description: getMessage(value.data.message),
            type: 'error'
        });
    }
}

export const handleSucccessNotification = (value: any) => {
    console.log(value);
    if (value.hasOwnProperty('data') && value.data.hasOwnProperty('message')) {
        notification.open({
            message: 'Ups!',
            description: getMessage(value.data.message),
            type: 'success'
        });
    }
}

const getMessage = (message: string): string => {
    if (message == 'NO_ERROR_REGISTER') {
        return 'Ocurrio un error, intenta mas tarde';
    }
    if (message == 'INCORRECT_PASSWORD') {
        return 'Usuario y/o contraseña incorrectos';
    }
    return 'Ocurrio un error, intenta mas tarde';
}
