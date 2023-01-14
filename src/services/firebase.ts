// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { fetchAndActivate, getRemoteConfig, getValue } from "firebase/remote-config";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDwOOby50KXLf68JCAMq_8YuI0sZaiA_KU",
    authDomain: "cdentalcaregroup-fcdc9.firebaseapp.com",
    projectId: "cdentalcaregroup-fcdc9",
    storageBucket: "cdentalcaregroup-fcdc9.appspot.com",
    messagingSenderId: "729725133747",
    appId: "1:729725133747:web:a9a75b09bb8a5545b421c6",
    measurementId: "G-J2NPXLD43Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);


const remoteConfig = getRemoteConfig(app);


export const initFirebaseRemoteConfig = async() => {
    fetchAndActivate(remoteConfig)
        .then(() => {
            // ...
        })
        .catch((err) => {
            // ...
        });
}

export const getFirebaseValue = (key: string) => {
    return getValue(remoteConfig, key);
}

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
const getBrowserToken = async () => {
    try {
        const token = await getToken(messaging, { vapidKey: 'BPuxUb53NYwGlRzLZE0SM27pN1kBlsk5xtlyeOn10RUcbVbTPWWbgQ_Tt5SVXRHc1zUTSanHWBET-CYK8lab3J8' })
        return token;
    } catch (error) {
        console.log(`Error getting token ${error}`);
        return '';
    }
}

const handleOnMessage = async (call: (value: FirebaseOpenLink) => void) => {
    onMessage(messaging, (payload: FirebaseNotificationPayload) => {
        console.log(`Notification: ${JSON.stringify(payload.notification, null, 4)}`);
        if (payload.data?.type?.toUpperCase() == 'QR') {
            showNotification(payload, () => {
                call(new FirebaseOpenLink(FirebaseOpenLinkType.APPOINTMENT, payload?.data?.folio ?? ''));
            });
            call(new FirebaseOpenLink(FirebaseOpenLinkType.APPOINTMENT, payload?.data?.folio ?? ''));
        }
        showNotification(payload);
    });
}
export class FirebaseOpenLink {
    type: FirebaseOpenLinkType;
    data: string;

    constructor(type: FirebaseOpenLinkType, data: string) {
        this.type = type;
        this.data = data;
    }
}
export enum FirebaseOpenLinkType {
    APPOINTMENT,
}

const showNotification = (payload: FirebaseNotificationPayload, call?: () => void) => {
    const img = payload.notification?.image ?? 'https://firebasestorage.googleapis.com/v0/b/cdentalcaregroup-fcdc9.appspot.com/o/Logos%2Femail_image.jpeg?alt=media&token=17eb0807-53bb-4eec-8493-423c3dc846cf'
    const text = payload.notification?.body;
    const title = payload.notification?.title ?? 'Notificacion'
    const notification = new Notification(title, { body: text, icon: img });
    notification.onclick = (event) => {
        event.preventDefault(); // prevent the browser from focusing the Notification's tab
        call?.();
    }
}



export { app, messaging, getBrowserToken, handleOnMessage };


export interface FirebaseNotificationPayload {
    from?: string;
    collapseKey?: string;
    messageId?: string;
    notification?: Notification;
    data?: Data;
}

export interface Data {
    "gcm.n.e"?: string;
    "google.c.a.ts"?: string;
    "google.c.a.udt"?: string;
    "google.c.a.c_id"?: string;
    "gcm.notification.sound2"?: string;
    "google.c.a.e"?: string;
    "google.c.a.c_l"?: string;
    "type"?: string;
    "folio"?: string;
}

export interface Notification {
    title?: string;
    body?: string;
    image?: string;
}