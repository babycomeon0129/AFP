
// 授予Service worker 對 Firebase Messaging 的訪問權
// 注意：這裡只能使用Firebase Messaging，其他 Firebase libraries 在 ervice worker 無效
// env: preprod

importScripts('https://www.gstatic.com/firebasejs/8.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.8.1/firebase-messaging.js');

// 在Service worker 中初始化Firebase 應用，並傳入配置檔。
// https://firebase.google.com/docs/web/setup#config-object

const firebaseConfig = {
  apiKey: 'AIzaSyDTocp-Q2WObnsQ0hWf4hP2oVQOvRR8hPs',
  authDomain: 'afp-consumer-1db32.firebaseapp.com',
  databaseURL: 'https://afp-consumer-1db32.firebaseio.com',
  projectId: 'afp-consumer-1db32',
  storageBucket: 'afp-consumer-1db32.appspot.com',
  messagingSenderId: '248768981886',
  appId: '1:248768981886:web:f6e311fbe740cbf9c8e12f',
  measurementId: 'G-2TC2P0Y18C'
}

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
