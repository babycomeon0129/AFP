
/** 登入 API Request interface
 * https://bookstack.eyesmedia.com.tw/books/mobii-x/chapter/api
 */
export interface ApiResultEntity {
  /** 依循 uuid version 4  規範於每一個回應請求時產生 */
  messageId: string;
  /** 錯誤代碼 */
  errorCode: string;
  /** 錯誤描述 */
  errorDesc: string;
  /** 請求時間 */
  messageDatetime: string;
  /** 回傳資料 */
  data?: string;
}

export interface Model_Authorize extends ApiResultEntity {
  /** 艾斯驗證網址 */
  AuthorizationUri: string;
  /** 企業帳號 */
  accountId: string;
  /** 用戶端識別碼 */
  clientId: string;
  /** 用於防止跨站請求偽造 (opens new window)的唯一性屬性 */
  state: string;
  /** 向用戶請求授予權限 */
  scope: string;
  /** 回調（callback）的 URL，請求結果將回覆至此URL */
  redirectUri: string;
  /** 忘記密碼的 URL */
  homeUri: string;
  /** code */
  responseType: string;
  /** 艾斯依不同內部系統客製產生不同風格頁 */
  viewConfig: string;
}

export interface Response_AFPLogin extends ApiResultEntity {
  /** 使用者idToken */
  idToken: string;
  /** 使用者姓名 */
  Customer_Name: string;
  /** 使用者編碼 */
  Customer_Code: string;
  /** 使用者UUID */
  Customer_UUID: string;
  /** 使用者-我的最愛 */
  List_UserFavourite: [];
  /** 艾斯ID */
  UserId: string;
}

export interface Model_OAuthFlow {
  /** 裝置類型 */
  deviceType: number;
  /** 裝置編碼 */
  deviceCode: string;
  /** USER要回去的地方 */
  fromOriginUri: string;
}

export interface RequestIdTokenApi {
  /** 後端驗證用，僅使用一次 */
  grantCode: string;
  /** 使用者ID */
  UserInfoId: number;
}

/** 消費者包 Model */
export interface Model_CustomerDetail {
  /** 使用者ID */
  UserInfo_ID: number;
  /** 使用者編碼 */
  UserInfo_Code: number;
  /** UUID */
  UserInfo_UUID: string;
  /** 外部編碼 */
  UserInfo_ExtCode: string;
  /** 使用者帳號 */
  UserInfo_Account: string;
  /** 使用者名稱 */
  UserInfo_Name: string;
  /** 帳號類型 */
  UserInfo_Type: number;
  /** 使用者GroupNo  */
  UserInfo_GroupNo: number;
  /** ID */
  UserLoginState_ID: number;
  /** APP裝置編碼 */
  UserDevice_Code: number;
  /** 裝置編碼 */
  UserDevice_DeviceCode: string;
  /** 手機號碼 */
  UserProfile_Mobile: string;
  /** 艾斯ID */
  UserId: string;
}

/** 「cookie,session管理_現有參數」 */
export class cookieDeclare {
  /** 身份識別idToken */
  idToken?: string;
  /** 使用者暱稱userName */
  userName?: string;
  /** 使用者編碼userCode */
  userCode?: string;
  /** 艾斯ID */
  userId?: string;
  /** 使用者收藏userFavorites */
  userFavorites?: string;
  /** fromOriginUri(登入成功返回頁) */
  fromOriginUri?: string;
  /** 裝置編碼(0:Web 1:iOS 2:Android) */
  deviceType?: string;
  /** 公告頁(1不顯示) */
  upgrade?: string;
  /** 首頁隱私權(1不顯示) */
  show?: string;
  /** 購物車編碼(APP用) */
  cart_code?: string;
  /** 購物車 */
  cart_count_Mobii?: string;
  /** 進場廣告 */
  adTime?: string;
  /** App訪問 */
  appVisit?: string;
  /** 登出測試 */
  logout?: string;
  /** 來源頁(除錯用) */
  page?: string;
}

