// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// 注意: 測試推播時manifest.json 中的gcm_sender_id要改為sit使用的

export const environment = {
  production: false,
  apiUrl: 'http://54.150.124.230:38086/api/',
  FBApiKey: '349758176149496',
  GoogleApiKey: '260499247538-ctoucp9t09ufdpgqmd4ac368lfpgmorm.apps.googleusercontent.com',
  cookieDomain: '54.150.124.230',
  cookieSecure: false,
  /** Apple登入redirectURI */
  AppleSignInURI: 'https://www-uat.mobii.ai',
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
