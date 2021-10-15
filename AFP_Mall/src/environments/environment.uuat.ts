export const environment = {
  production: false,
  apiUrl: 'https://afpapi-uuat.mobii.ai/api/',
  loginUrl: 'https://login-uuat.mobii.ai/auth/api/v1/login',
  tokenUrl: 'https://login-uuat.mobii.ai/auth/api/v1/token',
  modifyUrl: 'https://login-uuat.mobii.ai/auth/api/v1/memberModify',
  FBApiKey: '349758176149496',
  GoogleApiKey: '260499247538-ctoucp9t09ufdpgqmd4ac368lfpgmorm.apps.googleusercontent.com',
  cookieDomain: '*.mobii.ai',
  cookieSecure: true,
  /** Apple登入redirectURI */
  AppleSignInURI: 'https://www-uuat.mobii.ai',
  /** 是否啟用 service worker（for 推播服務） */
  swActivate: true,
  firebaseConfig: {
    apiKey: 'AIzaSyCjtBdCm4T5SdndyaCGHN-S7LJQaLxftsE',
    authDomain: 'afp-consumer-sit.firebaseapp.com',
    databaseURL: 'https://afp-consumer-sit.firebaseio.com',
    projectId: 'afp-consumer-sit',
    storageBucket: 'afp-consumer-sit.appspot.com',
    messagingSenderId: '571296338960',
    appId: '1:571296338960:web:6fb46497c525628370a695',
    measurementId: 'G-8GDMQFYGNG'
  }
};
