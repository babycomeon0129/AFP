// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// 注意: 測試推播時manifest.json 中的gcm_sender_id要改為sit使用的

export const environment = {
  production: false,
  version: '1.3.8',
  versionDate: '2022/02/09 19:34:49',
  apiUrl: 'https://sit-afpapi.mobii.ai/api/',
  loginUrl: 'https://sit-login.mobii.ai/auth/api/v1/',
  FBApiKey: '349758176149496',
  GoogleApiKey: '260499247538-ctoucp9t09ufdpgqmd4ac368lfpgmorm.apps.googleusercontent.com',
  cookieDomain: '.mobii.ai',
  cookieSecure: true,
  /** Apple登入redirectURI */
  AppleSignInURI: 'https://sit.mobii.ai',
  /** 是否啟用 service worker（for 推播服務） */
  swActivate: true,
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
