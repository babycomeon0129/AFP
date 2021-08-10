
// 授予Service worker 對 Firebase Messaging 的訪問權
// 注意：這裡只能使用Firebase Messaging，其他 Firebase libraries 在 ervice worker 無效
// env: uat

importScripts('https://www.gstatic.com/firebasejs/8.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.8.1/firebase-messaging.js');

// 在Service worker 中初始化Firebase 應用，並傳入配置檔。
// https://firebase.google.com/docs/web/setup#config-object

const firebaseConfig = {
  apiKey: 'AIzaSyCjtBdCm4T5SdndyaCGHN-S7LJQaLxftsE',
  authDomain: 'afp-consumer-sit.firebaseapp.com',
  databaseURL: 'https://afp-consumer-sit.firebaseio.com',
  projectId: 'afp-consumer-sit',
  storageBucket: 'afp-consumer-sit.appspot.com',
  messagingSenderId: '571296338960',
  appId: '1:571296338960:web:6fb46497c525628370a695',
  measurementId: 'G-8GDMQFYGNG'
}

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
