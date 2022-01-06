// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  version: '1.3.7',
  versionDate: '2022/01/06 11:58:06',
  // apiUrl: 'http://localhost:55254/api/',
  apiUrl: 'https://sit-afpapi.mobii.ai/api/',
  loginUrl: 'https://sit-login.mobii.ai/auth/api/v1/',
  FBApiKey: '349758176149496',
  GoogleApiKey: '260499247538-ctoucp9t09ufdpgqmd4ac368lfpgmorm.apps.googleusercontent.com',
  cookieDomain: 'localhost',
  cookieSecure: false,
  /** Apple登入redirectURI */
  AppleSignInURI: 'https://sit.mobii.ai',
  /** 是否啟用 service worker（for 推播服務） */
  swActivate: false,
  firebaseConfig: {
    apiKey: 'AIzaSyCjtBdCm4T5SdndyaCGHN-S7LJQaLxftsE',
    authDomain: 'afp-consumer-sit.firebaseapp.com',
    databaseURL: 'https://afp-consumer-sit.firebaseio.com',
    projectId: 'afp-consumer-sit',
    storageBucket: 'afp-consumer-sit.appspot.com',
    messagingSenderId: '571296338960',
    appId: '1:571296338960:web:afd1efd62b8c89a970a695',
    measurementId: 'G-0DDRXNYEBE'
  }
};
