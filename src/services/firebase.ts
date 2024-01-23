// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { fetchAndActivate, getRemoteConfig, getValue } from "firebase/remote-config";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_KEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_KEY,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_KEY,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGE_KEY,
    appId: import.meta.env.VITE_FIREBASE_APP_KEY,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_KEY
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);


const remoteConfig = getRemoteConfig(app);


export const initFirebaseRemoteConfig = async() => {
    fetchAndActivate(remoteConfig)
        .then(() => {
            console.log(`Firebase inited successfully`);
        })
        .catch((err) => {
            console.log(`Error initializing Firrebase ${JSON.stringify(err)}`);
        });
}

export const getFirebaseValue = (key: string) => {
    return getValue(remoteConfig, key);
}

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
const getBrowserToken = async () => {
    try {
        const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_VAPI_KEY })
        console.log(`Firebase token successfully`);
        return token;
    } catch (error) {
        console.log(`Error getting firebase token ${JSON.stringify(error)}`);
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