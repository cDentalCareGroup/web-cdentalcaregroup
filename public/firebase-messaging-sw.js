importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyDwOOby50KXLf68JCAMq_8YuI0sZaiA_KU",
    authDomain: "cdentalcaregroup-fcdc9.firebaseapp.com",
    projectId: "cdentalcaregroup-fcdc9",
    storageBucket: "cdentalcaregroup-fcdc9.appspot.com",
    messagingSenderId: "729725133747",
    appId: "1:729725133747:web:a9a75b09bb8a5545b421c6",
    measurementId: "G-J2NPXLD43Q"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
})