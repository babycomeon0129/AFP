/** 大首頁 RequestModel 搜尋Model */
export interface Search_ConsHome {
  /** 首頁景點頻道編號 */
  IndexArea_Code?: number;
  /** 首頁行程頻道編號 */
  IndexTravel_Code?: number;
  /** 商品頻道編號 */
  IndexChannel_Code?: number;
  /** 首頁外送頻道編號 */
  IndexDelivery_Code?: number;
}

/** WebAPI ResponseModel */
export interface Response_APIModel {
  /** 共用傳遞模組 */
  Base?: Model_BaseWebAPIResponse;
  /** 任務相關資訊 */
  MissionInfo?: Model_MissionInfo;
  /** 回傳資料 */
  Data?: string;
  /** 認證資訊 */
  Verification?: Model_Verification;
}

/** 驗證Model */
export interface Model_Verification {
  /** 手機是否驗證
   *
   * 0: 強制登出
   * 1: 未驗證 並強制驗證
   * 2: 未驗證 無需強驗證
   * 3: 已驗證
   * 4: 已驗證 更換消費者包 and UserCode
   */
  MobileVerified: number;
  /** 消費者包（MobileVerified = 3 會回傳,其餘狀態為空） */
  CustomerInfo: string;
  /** 使用者編碼（MobileVerified = 3 會回傳,其餘狀態為空） */
  UserCode: string;
}

/** ResponseModel 中 Base 模組 */
export interface Model_BaseWebAPIResponse {
  /** 錯誤編碼 */
  Rtn_State: number;
  /** 錯誤訊息 */
  Rtn_Message: string;
  /** 備用欄位 */
  Rtn_Param: string;
  /** 錯誤時,導向網頁 */
  Rtn_URL: string;
}

/** 大包用 - 任務完成Model */
export interface Model_MissionInfo {
  /** SelectMode */
  Select_Mode?: number;
  /** 備用欄位 */
  Mission_VarParamA: string;
  /** 備用欄位 (統一放UserInfoCode) */
  Mission_IntParamA: number;
  /** 完成任務列表(先不移除) */
  List_MissionDetail: Model_MissionDetail[];
}

/** 任務完成訊息 */
export interface Model_MissionDetail {
  /** 完成後訊息 */
  Mission_Info: string;
  /** 下個任務網址標題 */
  Mission_URLTitle: string;
  /** 下個任務網址 */
  Mission_URL: string;
}

/** AFP 自定義參數 */
export interface AFP_UserReport {
  /** ID */
  UserReport_ID?: number;
  /** 上級參數A */
  UserReport_UpCategoryCode?: number;
  /** 上級參數B */
  UserReport_UpItemCode?: number;
  /** 大類別編碼 */
  UserReport_CategoryCode?: number;
  /** 大類別名稱 */
  UserReport_CategoryName?: string;
  /** 分類編碼 */
  UserReport_ItemCode?: number;
  /** 分類說明 */
  UserReport_ItemName?: string;
  /** 參數A */
  UserReport_ParamA?: string;
  /** 參數B */
  UserReport_ParamB?: string;
  /** 參數C */
  UserReport_ParamC?: string;
  /** 參數D */
  UserReport_ParamD?: string;
  /** 參數E */
  UserReport_ParamE?: string;
  /** 參數F */
  UserReport_ParamF?: string;
  /** 參數G */
  UserReport_ParamG?: string;
  /** 參數H */
  UserReport_ParamH?: string;
  /** 排序 */
  UserReport_Sort?: number;
  /** 卡群圖片 */
  CardGroup_Img?: string;
  /** 卡群名稱 */
  CardGroup_Name?: string;
  /** 卡片是否啟用 is activate */
  UserReport_State?: number;
  /** 卡片是否顯示 is show */
  UserReport_IsShow?: number;
}

/** AFP 廣告版位 */
export interface AFP_ADImg {
  /** ID */
  ADImg_ID?: number;
  /** 廣告類型 */
  ADImg_Type?: number;
  /** 編碼 */
  ADImg_ADCode?: number;
  /** 圖檔 */
  ADImg_Img?: string;
  /** 影片連結 */
  ADImg_VideoURL?: string;
  /** 標題 */
  ADImg_Title?: string;
  /** 副標題 */
  ADImg_SubTitle?: string;
  /** 圖片連結 */
  ADImg_URL?: string;
  /** 網頁開啟模式 */
  ADImg_URLTarget?: string;
}

/** AFP 使用者服務 */
export interface AFP_Function {
  /** 類別編碼 */
  Function_CategaryCode: number;
  /** ID */
  Function_ID?: number;
  /** 編碼 */
  Function_Code?: number;
  /** 名稱 */
  Function_Name?: string;
  /** URL */
  Function_URL?: string;
  /** 圖示 */
  Function_Icon?: string;
  /** 置頂 */
  Function_IsTop?: number;
  /** 合作夥伴服務 */
  Function_IsOther?: number;
  /** 排序 */
  Function_Sort?: string;
  /** 開啟方式 */
  Function_URLTarget?: string;
  /** 是否啟用 0: 否 1: 是 */
  Function_IsActive?: number;
  /** 我的服務-判斷ICON狀態，前端新增 */
  isAdd?: boolean;
}



/** 目錄資訊 */
export interface Model_AreaJsonFile {
  /** 外部目錄頻道ID */
  UserDefine_ChannelID?: number;
  /** 外部目錄編碼 */
  UserDefine_Code?: number;
  /** 外部目錄編碼 */
  UserDefine_Name?: string;
  /** 景點資訊 */
  ECStoreData?: AreaJsonFile_ECStore[];
}

/** 景點資訊 */
export interface AreaJsonFile_ECStore {
  /** 外部目錄編碼 */
  UserDefine_Code?: number;
  /** 商店編碼 */
  ECStore_Code?: number;
  /** 商店名稱(前台) */
  ECStore_ShowName?: string;
  /** 商店圖片 */
  ECStore_Image1?: string;
  /** 商店類型
   *
   * 1000: 線上商店
   * 1100: 實體商店
   * 2000: 景點
   * 2100: 住宿
   * 2200: 美食
   * 2300: 遊樂(體驗)
   * 2400: 購物
   * 2500: 醫療保健
   */
  ECStore_Type?: number;
  /** 類型名稱 */
  ECStore_TypeName?: string;
  /** 經度 */
  ECStore_Lng?: number;
  /** 緯度 */
  ECStore_Lat?: number;
  /** 距離 */
  ECStore_Distance?: number;
  /** 規格資料 */
  AttrbuteData?: AreaJsonFile_Attrbute[];
  /** 是否上架(是否顯示) 0: 下架(預設) 1: 上架 */
  ECStore_IsOnline: boolean;
  /** 資料狀態 0: 無效 1: 效(預設) 9: 刪除 */
  ECStore_State: boolean;
}

/** 規格 */
export interface AreaJsonFile_Attrbute {
  /** 商店編碼 */
  ECStore_Code?: number;
  /** 商店名稱(前台) 1：索引 2：規格(預設) */
  Attribute_Type?: number;
  /** 編碼 */
  Attribute_Code?: number;
  /** 規格名稱 */
  Attribute_Name?: string;
  /** 編碼 */
  AttributeValue_Code?: number;
  /** 規格值名稱 */
  AttributeValue_Name?: string;
}

/** 大首頁 RequestModel */
export interface Request_Home extends Model_ShareData {
  /** 搜尋Model */
  SearchModel?: Search_ConsHome;
}

/** 大首頁 ResponseModel */
export interface Response_Home {
  /** 會員點數 */
  TotalPoint: number;
  /** 優惠卷數量 */
  VoucherCount: number;
  /** 廣告列表 10001 */
  ADImg_Top: AFP_ADImg[];
  /** 廣告列表 (登入前)10002 / (登入後)10003 */
  ADImg_Top2: AFP_ADImg[];
  /** 廣告列表 (登入前)10007 / (登入後)10008 */
  ADImg_Top3: AFP_ADImg[];
  /** 廣告列表 (登入前)10004 / (登入後)10005 */
  ADImg_Activity: AFP_ADImg[];
  /** 廣告列表 10006 */
  ADImg_Theme: AFP_ADImg[];
  /** 廣告列表 10099 (進場廣告) */
  ADImg_Approach: AFP_ADImg[];
  /** 景點資料 (目錄 + 景點) */
  List_AreaData: Model_AreaJsonFile[];
  /** 行程資料 (目錄 + 景點) */
  List_TravelData: Model_TravelJsonFile[];
  /** 商品資料 (目錄 + 商品) */
  List_ProductData: AFP_ChannelProduct[];
  /** 外送資料 (目錄 + 景點) */
  List_DeliveryData: Model_AreaJsonFile[];
  /** 優惠券資料(目錄+優惠券) Code=1111115 */
  List_Voucher: AFP_ChannelVoucher[];
}

/** 行程文件產生Model */
export interface Model_TravelJsonFile {
  /** 外部目錄頻道ID */
  UserDefine_ChannelID?: number;
  /** 外部目錄編碼 */
  UserDefine_Code?: number;
  /** 外部目錄編碼名字 */
  UserDefine_Name?: string;
  /** 行程資訊 */
  TravelData?: TravelJsonFile_Travel[];
}

/** 行程資訊 */
export interface TravelJsonFile_Travel {
  /** 外部目錄編碼 */
  UserDefine_Code?: number;
  /** 行程編碼 */
  Travel_Code?: number;
  /** 行程圖片(前台) */
  Travel_Img?: string;
  /** 標題(前台) */
  Travel_Title?: string;
  /** 副標(前台) */
  Travel_SubTitle?: string;
  /** 圖片連結 */
  Travel_URL?: string;
  /** 網頁開啟模式 */
  Travel_URLTarget?: string;
  /** 地點副標 */
  Travel_LocalTitle?: string;
  /** 規格資料 */
  AttrbuteData?: TravelJsonFile_Attrbute[];
  /** 狀態 0:無效 1:有效 9:刪除 */
  Travel_State?: boolean;
}

/** 規格 */
export interface TravelJsonFile_Attrbute {
  /** 行程編碼 */
  Travel_Code?: number;
  /** 類型 0: 索引 1: 規格(預設) */
  Attribute_Type?: number;
  /** 編碼 */
  Attribute_Code?: number;
  /** 規格名稱 */
  Attribute_Name?: string;
  /** 編碼 */
  AttributeValue_Code?: number;
  /** 規格值名稱 */
  AttributeValue_Name?: string;
}

/** 註冊 RequestModel */
export interface Request_AFPAccount {
  /** 註冊類型 1:手機 2:信箱 */
  AFPType: number;
  /** 國碼 - 手機用 */
  AFPAccountCTY: number;
  /** 帳號 - 手機或信箱 */
  AFPAccount: string;
  /** 帳號 - 密碼 */
  AFPPassword: string;
  /** 帳號 - 二次密碼 (前端為驗證加上) */
  AFPPassword2?: string;
  /** 帳號 - 暱稱 */
  AFPNickName?: string;
  /** 驗證資訊 */
  VerifiedInfo?: AFP_VerifiedInfo;
  /** 是否同意條款 (前端為驗證加上) */
  Agree?: boolean;
}

/** 旅遊首頁 ResponseModel */
export interface Response_TravelHome {
  /** 廣告列表 20001 */
  ADImg_Top: AFP_ADImg[];
  /** 廣告列表 20002 */
  ADImg_Activity: AFP_ADImg[];
  /** 廣告列表 20003 */
  ADImg_Theme: AFP_ADImg[];
  /** 使用者服務列表 */
  List_Function: AFP_Function[];
  /** 行程資料 (目錄 + 景點) */
  List_TravelData: Model_TravelJsonFile[];
}

/** 周邊探索 - 列表 Response */
export interface Response_AreaIndex {
  /** 景點資料 (目錄 + 景點) */
  List_AreaData: Model_AreaJsonFile[];
  /** 景點頻道下目錄 */
  List_UserDefine: AFP_UserDefine[];
}

/** 周邊探索 - 詳細 Response */
export interface Response_AreaDetail extends Model_ShareData {
  /** 電商商店資訊表 */
  Model_ECStore: AFP_ECStore;
  /** 分店資訊(商家資訊用) */
  List_ECStore: AFP_ECStore[];
  /** 商家優惠卷 */
  List_Voucher: AFP_Voucher[];
  /** 商家商品 */
  List_Product: AFP_Product[];
  AFP_UserReport: AFP_UserReport[];
  /** 電商商店外部類型資訊 */
  Model_ECStoreExtType: AFP_ECStoreExtType;
  /** 商家推薦連結 */
  List_ECStoreLink: AFP_ECStoreLink[];
}

/** 電商商店外部類型資訊 */
export class AFP_ECStoreExtType {
  /** 商店編碼 */
  ECStoreExtType_ECStoreCode: number;
  /** 合作商編碼 */
  ECStoreExtType_PartnerCode: number;
  /** 外部類型 */
  ECStoreExtType_Type: number;
  /** 外部編碼 */
  ECStoreExtType_ExtCode: number;
}

/** 電商商店推薦連結 */
export interface AFP_ECStoreLink {
  /** 名稱 */
  ECStoreLink_Name: string;
  /** 網頁開啟模式 */
  ECStoreLink_URLTarget: string;
  /** 連結 */
  ECStoreLink_URL: string;
  /** 圖示 */
  ECStoreLink_Icon: string;
  /** 排序 */
  ECStoreLink_Sort: number;
}

/** AFP 電商商店資訊表 */
export interface AFP_ECStore {
  /** 商店編碼 */
  ECStore_Code?: number;
  /** 總店編碼 */
  ECStore_CompanyCode?: number;
  /** 商店類型 */
  ECStore_Type: number;
  /** 商店類型(String) */
  ECStore_TypeName: string;
  /** 商店名稱 */
  ECStore_ShowName: string;
  /** 經度 */
  ECStore_Lng?: number;
  /** 緯度 */
  ECStore_Lat?: number;
  /** 距離 */
  ECStore_Distance?: number;
  /** 國家 */
  ECStore_Country?: string;
  /** 縣/市 */
  ECStore_City?: number;
  /** 行政區 */
  ECStore_LocalCityArea?: number;
  /** 地址 */
  ECStore_Address?: string;
  /** 電話 */
  ECStore_Tel?: string;
  /** 自取縣/市區 */
  ECStore_PickCity?: number;
  /** 自取行政區 */
  ECStore_PickCityArea?: number;
  /** 自取地址 */
  ECStore_PickAddress?: string;
  /** 時間 */
  ECStore_OpenTime?: string;
  /** 特色 */
  ECStore_Features?: string;
  /** Logo */
  ECStore_Logo?: string;
  /** 圖片1 */
  ECStore_Image1?: string;
  /** 圖片2 */
  ECStore_Image2?: string;
  /** 圖片3 */
  ECStore_Image3?: string;
  /** 圖片4 */
  ECStore_Image4?: string;
  /** 圖片5 */
  ECStore_Image5?: string;
  /** WEB 連結 */
  ECStore_WebURL?: string;
  /** FB 連結 */
  ECStore_FBURL?: string;
  /** LINE 連結 */
  ECStore_LineURL?: string;
  /** IG 連結 */
  ECStore_IGURL?: string;
  /** Justka 連結 */
  ECStore_Justka: string;
  /** 備註 */
  ECStore_Demo?: string;
  /** 狀態 */
  ECStore_State?: boolean;
  /** 是否上架(是否顯示於列表) 0:下架 1:上架 */
  ECStore_IsOnline?: boolean;
  /** 我要外帶連結 */
  ECStore_DeliveryURL?: string;
  /** 我要外送連結 */
  ECStore_TakeoutURL?: string;
}

/** 消費者包 Model */
export interface Model_CustomerInfo {
  /** 使用者名稱 */
  Customer_Name?: string;
  /** 使用者編碼 */
  Customer_Code?: string;
  /** 使用者資訊 */
  CustomerInfo?: string;
  /** UUID */
  Customer_UUID?: string;
}

/** 自定義目錄 */
export interface AFP_UserDefine {
  /** 目錄編碼 */
  UserDefine_Code: number;
  /** 目錄名稱 */
  UserDefine_Name: string;
  /** 目錄下 商品/景點/行程 數量 */
  UserDefine_ProdCount: number;
}

/** 商品 */
export interface AFP_Product {
  /** 商品ID */
  Product_ID?: number;
  /** 商品編碼（貨號） */
  Product_Code?: number;
  /** 商店編碼 */
  Product_ECStoreCode?: number;
  /** 商品類型
   *
   * 1：一般商品
   * 2： 外部商品
   * 11：贈品
   * 21：電子票證
   * 22：有價票(非API)
   * 31 : 點數商品
   * 101 : 免稅商品
   */
  Product_Type?: number;
  /** 外部商品編碼 */
  Product_ExtCode?: string;
  /** 商品網址 */
  Product_URL?: string;
  /** 商品名稱 */
  Product_Name?: string;
  /** 外部商品名稱 */
  Product_ExtName?: string;
  /** SEO關鍵字 */
  Product_KeyWord?: string;
  /** 商品敘述 */
  Product_Depiction?: string;
  /** 運送須知 */
  Product_Shopping: string;
  /** 訂購須知 */
  Product_OrderNotice: string;
  /** 商品主圖 */
  Product_PrimeImage?: string;
  /** 商品Icon */
  Product_Icon?: string;
  /** 銷售價(含稅) */
  Product_SellPrice?: number;
  /** 特價(含稅) */
  Product_SpecialPrice?: number;
  /** 特價開始日期 */
  Product_SpecialOnDate?: Date;
  /** 特價結束日期 */
  Product_SpecialOffDate?: Date;
  /** 是否上架 */
  Product_IsOnline?: number;
  /** 上架日期 */
  Product_OnlineDate?: Date;
  /** 下架日期 */
  Product_OfflineDate?: Date;
  /** 抵扣幣額 */
  Product_DiscountCoin?: number;
  /** 銷售單位(編碼) */
  Product_SellUnit?: number;
  /** 銷售單位 */
  Product_SellUnitName: string;
  /** 商品目錄編碼 */
  Product_UserDefineCode?: number;
  /** 商品目錄名稱 */
  Product_UserDefineName?: string;
  /** 是否能購買 */
  Product_IsBuy?: boolean;
  /** 販售開始日期 */
  Product_UsedOnDate: Date;
  /** 販售結束日期 */
  Product_UsedOffDate: Date;
  /** 資料狀態 0:無效 1:有效 */
  Product_State: boolean;

}

/** 第三方登入RequestModel */
export class Request_AFPThird {
  /** 第三方登入類型  1 : Facebook  2 : Line 3 : Google  4 : WeChat */
  Mode?: number;
  /** 帳號 */
  Account?: string;
  /** 名稱 */
  NickName?: string;
  /** 第三方Token */
  Token?: string;
  /** 回傳JSON */
  JsonData?: string;
}

/** 商城首頁 ResponseModel */
export interface Response_ECHome extends Model_ShareData {
  /** 廣告列表 30001 */
  ADImg_Top: AFP_ADImg[];
  /** 廣告列表 30002 */
  ADImg_Activity: AFP_ADImg[];
  /** 優惠券資料 (目錄 + 優惠券) */
  List_VoucherData: AFP_ChannelVoucher[];
  /** 商品資料 (目錄 + 商品) */
  List_ProductData: AFP_ChannelProduct[];
  /** 近期熱門商品 */
  List_HotProduct: AFP_Product[];
  /** 使用者服務列表 */
  List_Function: AFP_Function[];
}

/** 註冊 ResponseModel */
export interface Response_AFPAccount {
  /** 使用者編碼 */
  UserInfo_Code: number;
}

/** Request/Response Model中Data 共用模組 */
export class Model_ShareData {
  /**  區別操作(通用) 1:新增 2:刪除 3:編輯  4:查詢 其他 依照Excel文件 */
  SelectMode?: number;
  /** 加密的UserInfo Code */
  User_Code?: string;
  /** 自定義文字 */
  Store_Note?: string;
  /** 購物車內商品數量 */
  Cart_Count?: number;
  /** JustKa連結 */
  JustKaUrl?: string;
  /** 分頁-response */
  Model_BaseResponse?: Model_BaseResponse;
  /** 分頁-request  */
  Model_BasePage?: Model_BasePage;
  /** UUID，通用唯一辨識碼 */
  UUID?: string;
  /** App用分享連結 */
  AppShareUrl?: string;
}

/** AFP 使用者收藏 */
export class AFP_UserFavourite {
  /** ID */
  UserFavourite_ID?: number;
  /** 國碼 */
  UserFavourite_CountryCode?: number;
  /** 收藏類型 */
  UserFavourite_Type?: number;
  /** 使用者編碼 */
  UserFavourite_UserInfoCode?: number;
  /** Type對應表編號 */
  UserFavourite_TypeCode?: number;
  /** 預設 0:否(預設) 1:是 */
  UserFavourite_IsDefault?: number;
  /** 字串欄位1 */
  UserFavourite_Text1?: string;
  /** 字串欄位2 */
  UserFavourite_Text2?: string;
  /** 字串欄位3 */
  UserFavourite_Text3?: string;
  /** 數字欄位1 */
  UserFavourite_Number1?: number;
  /** 數字欄位2 */
  UserFavourite_Number2?: number;
  /** Token */
  UserFavourite_Token?: string;
  /** 日期 */
  UserFavourite_Date?: Date;
  /** 加密字串欄位 */
  UserFavourite_Encryption?: string;
  /** 排序 */
  UserFavourite_Sort?: number;
  /** 狀態 0:無效 1:有效(預設) 9:刪除 */
  UserFavourite_State?: number;
  /** 同步狀態 */
  UserFavourite_SyncState?: number;
}

/** 會員中心-我的收藏 - RequestModel */
export interface Request_MemberFavourite extends Model_ShareData {
  /** 我的收藏 */
  AFP_UserFavourite: {
    /** ID */
    UserFavourite_ID: number;
    /** 國碼 */
    UserFavourite_CountryCode: number;
    /** 收藏類型 */
    UserFavourite_Type: number;
    /** 使用者編碼 */
    UserFavourite_UserInfoCode: number;
    /** Type對應表編號 */
    UserFavourite_TypeCode?: number;
    /** 預設 0: 否(預設) 1: 是 */
    UserFavourite_IsDefault: number;
    /** 字串欄位1 */
    UserFavourite_Text1?: string;
    /** 字串欄位2 */
    UserFavourite_Text2?: string;
    /** 字串欄位3 */
    UserFavourite_Text3?: string;
    /** 數字欄位1 */
    UserFavourite_Number1?: number;
    /** 數字欄位2 */
    UserFavourite_Number2?: number;
  };
  /** 收藏類型編碼 (多筆以逗號區隔) */
  UserFavourite_TypeCodes?: string; // 收藏類型編碼 (多筆以逗號區隔)
}

/** 會員中心-我的收藏 - ResponseModel */
export interface Response_MemberFavourite extends Model_ShareData {
  /** 我的收藏 列表 */
  List_UserFavourite?: AFP_UserFavourite[];
  /** 我的收藏 詳細 */
  AFP_UserFavourite?: AFP_UserFavourite;
  /** 商品列表 Type=51 */
  List_Product?: AFP_Product[];
  /** 商家列表 Type=52 */
  List_ECStore?: AFP_ECStore[];
  /** 周邊列表 Type=53 */
  List_Area?: AreaJsonFile_ECStore[];
  /** 行程列表 Type=54 */
  List_Travel?: TravelJsonFile_Travel[];
}

/** 商城首頁 RequestModel */
export interface Request_ECHome extends Model_ShareData {
  /** 搜尋Model */
  SearchModel: {
    /** 首頁優惠券頻道編號 */
    IndexVoucher_Code?: number;
    /** 首頁商品頻道編號 */
    IndexChannel_Code: number;
    /** 購物車Code */
    Cart_Code: number;
  };
}

export interface Model_BaseResponse {
  /** APP 驗證Code */
  APPVerifyCode?: number;
  /** 總筆數 */
  Model_TotalItem?: number;
  /** 總頁數 */
  Model_TotalPage?: number;
  /** 目前所在頁數 */
  Model_CurrentPage?: number;
}

export interface Model_BasePage {
  /** 請求頁數 */
  Model_Page?: number;
  /** 每頁資料筆數 */
  Model_Item?: number;
  /** 資料欄位名稱 */
  ColumnsName?: string;
  /** 資料表名稱 */
  TableName?: string;
  /** 查詢條件 */
  WhereString?: string;
  /** 排序字串 */
  OrderString?: string;
  /** 間隔資料筆數 */
  RowNumber?: number;
}

/** 頻道商品 */
export interface AFP_ChannelProduct {
  /** 外部目錄頻道ID */
  UserDefine_ChannelID: number;
  /** 外部目錄編碼 */
  UserDefine_Code: number;
  /** 外部目錄編碼名字 */
  UserDefine_Name: string;
  /** 商品數量 */
  UserDefine_ProdCount: number;
  /** 商品資訊 */
  ProductData: AFP_Product[];
}

/** 商城-商品列表 RequestModel */
export interface Request_ECProductList extends Model_ShareData {
  /** 搜尋Model */
  SearchModel: {
    /** 商品目錄 Code */
    UserDefine_Code?: number;
    /** 商品規格值(多筆逗號區隔) */
    AttributeValue_Code: string[];
    /** 排序方式
     *
     * 1: 最新上架優先
     * 2: 熱門程度優先
     * 3: 價格低->高
     * 4: 價格高->低
     * */
    Sort_Mode?: number;
    /** 購物車Code */
    Cart_Code: number;
  };
}

/** 商城-商品列表 ResponseModel */
export interface Response_ECProductList extends Model_ShareData {
  /** 自定義目錄 */
  List_UserDefine: AFP_UserDefine[];
  /** 商品 */
  List_Product: AFP_Product[];
  /** 規格 */
  List_Attribute: AFP_Attribute[];
  /** 上級目錄名稱 */
  UpUserDefineName: string;
}

/** 規格 */
export interface AFP_Attribute {
  /** 規格ID */
  Attribute_ID: number;
  /** 規格編碼 */
  Attribute_Code: number;
  /** 前台顯示名稱 */
  Attribute_ShowName: string;
  /** 規格值 */
  List_AttributeValue: AFP_AttributeValue[];
}

/** 規格索引表 */
export interface AFP_AttributeValue {
  /** 規格值編碼 */
  AttributeValue_AttributeCode: number;
  /** 規格編碼 */
  AttributeValue_Code: number;
  /** 規格值名稱 */
  AttributeValue_ShowName: string;
  /** 規格值數量 */
  AttributeValue_Count: number;
}

/** 商城首頁 RequestModel */
export interface Request_ECProductDetail extends Model_ShareData {
  /** 搜尋Model */
  SearchModel: {
    /** 商品 Code */
    Product_Code: number;
    /** 目錄 Code */
    UserDefine_Code: number;
    /** 購物車Code */
    Cart_Code: number;
  };
}

/** 商城首頁 ResponseModel */
export interface Response_ECProductDetail extends Model_ShareData {
  /** 商品 */
  AFP_Product: AFP_Product;
  /** 商家 */
  AFP_ECStore: AFP_ECStore;
  /** 商品圖片 */
  List_ProductImg: AFP_ProductImg[];
  /** 此商家的優惠卷(1筆) */
  AFP_VoucherData: AFP_Voucher;
  /** 規格 */
  List_Attribute: AFP_Attribute[];
  /** 物流/運費 */
  List_ECLogistics: AFP_ECLogistics[];
}

/** 商品圖片 */
export interface AFP_ProductImg {
  /** 商品編碼 */
  ProductImg_ProductCode: number;
  /** 圖片位址 */
  ProductImg_ImgUrl: string;
  /** 商品圖片說明 */
  ProductImg_Explain: string;
}

/** 商品與規格關聯 DataModel */
export interface AFP_ProdAttr {
  /** 商品編碼 */
  ProdAttr_ProductCode: number;
  /** 規格索引類型 */
  ProdAttr_AttributeType: number;
  /** 規格索引Code */
  ProdAttr_AttributeCode: number;
  /** 規格索引Name */
  ProdAttr_AttributeName: string;
  /** 規格索引值Code */
  ProdAttr_AttributeValueCode: number;
  /** 規格索引值名字 */
  ProdAttr_AttributeValueName: string;
}

/** 商家物流資訊表 */
export interface AFP_ECLogistics {
  /** 物流ID */
  ECLogistics_ID: number;
  /** 物流名稱 */
  ECLogistics_Name: string;
  /** 物流費 */
  ECLogistics_Amount: number;
  /** 部件表 */
  List_ECLogisticsPart: AFP_ECLogisticsPart[];
}

/** 購物車 RequestModel */
export interface Request_ECCart extends Model_ShareData {
  /** 搜尋Model */
  SearchModel: Search_ECCart;
  /** 購物車 */
  AFP_Cart?: AFP_Cart;
  /** 購物車 -多筆更新用 (SelectMode = 5) */
  List_Cart?: AFP_Cart[];
}

/** 購物車 搜尋Model */
export interface Search_ECCart {
  /** 購物車Code */
  Cart_Code: number;
  /** APP用 結帳商品查詢 */
  ListCartID?: string;
}

/** 購物車 */
export interface AFP_Cart {
  /** ID */
  Cart_ID?: number;
  /** 購物車Code */
  Cart_Code?: number;
  /** 使用者Code */
  Cart_UserInfoCode?: number;
  /** 商店Code */
  Cart_ECStoreCode?: number;
  /** 商店名稱 */
  Cart_ECStoreName?: string;
  /** 商品編碼 */
  Cart_ProductCode?: number;
  /** 規格值編號 [多筆以逗號區隔] */
  Cart_AttributeValueCode?: string;
  /** 規格值名稱 [多筆以逗號區隔] */
  Cart_AttributeValueName?: string;
  /** 目錄編碼 */
  Cart_UserDefineCode?: number;
  /** 目錄名稱 */
  Cart_UserDefineName?: string;
  /** 數量 */
  Cart_Quantity?: number;
  /** 交易單價 */
  Cart_Amount?: number;
  /** 付款狀態 0：未建立訂單(預設) 1：已建立訂單 */
  Cart_OrderState?: number;
  /** 狀態 0:無效 1:有效 9:刪除 */
  Cart_State?: number;
  /** 生成日期 */
  Cart_InsertDate?: Date;
  /** 商品名稱 (顯示用) */
  Show_ProductName?: string;
  /** 商品圖片 (顯示用) */
  Show_ProductImg?: string;
  /** 商品抵扣 (顯示用) */
  Show_ProductDiscountCoin?: number;
  /** 商品收據金額 */
  Cart_ProdReceiptPrice?: number;
  /** 商品狀態 0:無效 1:有效 */
  Cart_ProductState?: boolean;
}

/** 購物車 ResponseModel */
export interface Response_ECCart extends Model_ShareData {
  /** 購物車 */
  AFP_Cart: AFP_Cart;
  /** 購物車清單 */
  List_Cart: AFP_Cart[];
  /** 商品規格 */
  List_ProdAttr: AFP_ProdAttr[];
  /** 商品價格變動清單 */
  List_PriceChange?: string;
  /** 是否能購買 */
  Product_IsBuy: boolean;
}

/** 取得結帳所需資訊 Response */
export interface Response_GetCheckout extends Model_ShareData {
  /** 結帳商家 */
  List_ECStore?: AFP_ECStore[];
  /** 自取商家 */
  Pick_ECStore?: AFP_ECStore[];
  /** 結帳商品 */
  List_Cart?: AFP_Cart[];
  /** 運送費用 */
  List_ECLogistics?: AFP_ECLogistics[];
  /** 消費者常用地址 */
  List_UserFavourite?: AFP_UserFavourite[];
  /** 自定義參數 (地址) */
  List_UserReport?: AFP_UserReport[];
  /** 姓名 */
  UserInfo_Name?: string;
  /** 電話 */
  UserProfile_Mobile?: string;
  /** Email */
  UserProfile_Email?: string;
  /** 商品價格變動清單 */
  List_PriceChange?: string;
}

/** 取得優惠卷 */
export interface Request_GetUserVoucher extends Model_ShareData {
  /** 購物車資訊 */
  List_Cart?: AFP_Cart[];
}

/** 取得優惠卷 Response */
export interface Response_GetUserVoucher extends Model_ShareData {
  /** 使用者優惠卷 */
  List_UserVoucher?: AFP_UserVoucher[];
  /** 優惠卷 */
  List_Voucher?: AFP_Voucher[];
}

/** 檢查優惠卷使用判定 */
export interface Request_CheckUserVoucher extends Model_ShareData {
  /** 購物車資訊 */
  List_Cart?: AFP_Cart[];
  /** 使用者優惠卷 */
  List_UserVoucher?: AFP_UserVoucher[];
}

/** 檢查優惠卷使用判定 Response */
export interface Response_CheckUserVoucher extends Model_ShareData {
  /** 優惠卷驗證狀態 */
  Success: boolean;
  /** 驗證失敗時回傳訊息 */
  ErrorMsg?: string;
}

/** 會員中心-我的優惠卷 - RequestModel */
export class Request_MemberUserVoucher extends Model_ShareData {
  /** 優惠卷Code */
  Voucher_Code?: number;
  /** 優惠代碼 */
  Voucher_ActivityCode?: string;
  /** SearchModel */
  SearchModel: Search_MemberUserVoucher;
}

/** 會員中心-我的優惠卷 SearchModel */
export interface Search_MemberUserVoucher {
  /** 查詢模式  1:可用 2:歷史 */
  SelectMode?: number;
}

/** 會員中心-我的優惠卷 - ResponseModel */
export interface Response_MemberUserVoucher extends Model_ShareData {
  /** 使用者優惠券紀錄表 */
  List_UserVoucher: AFP_Voucher[];
  /** 新增後回傳最新資訊 */
  Model_Voucher: AFP_Voucher;
  /** 使用者優惠卷 */
  AFP_UserVoucher: AFP_UserVoucher;
  /** 使用範圍 */
  List_UsedType: Model_DictionaryShort[];
  /** 優惠卷類型 */
  List_ShowType: Model_DictionaryShort[];
  /** 折扣類型使用 */
  List_VoucherType: Model_DictionaryShort[];
}

/** Dictionary(short,string)轉換Model */
export class Model_DictionaryShort {
  /** 就是Key */
  Key: number;
  /** 就是Value */
  Value: string;
  /** 是否被選取（前端自定義） */
  isSelect?: boolean;
}

/** 使用者優惠卷紀錄表 */
export class AFP_UserVoucher {
  /** 優惠卷使用類型 */
  UserVoucher_UsedType: number;
  /** ID */
  UserVoucher_ID: number;
  /** 編碼 */
  UserVoucher_Code: number;
  /** 單號 */
  UserVoucher_TableNo?: number;
  /** 使用者編碼 */
  UserVoucher_UserInfoCode: number;
  /** 優惠卷編號 */
  UserVoucher_VoucherCode: number;
  /** 優惠卷使限制ID */
  UserVoucher_VoucherLimitID?: number;
  /** 使用開始日期 */
  UserVoucher_UsedOnDate: Date;
  /** 使用結束日期 */
  UserVoucher_UsedOffDate: Date;
  /** QRCode */
  UserVoucher_QRCode: string;
  /** 領取日期 */
  UserVoucher_ReceiveDate: Date;
  /** 優惠卷核銷店家 */
  UserVoucher_UsedECStore?: number;
  /** 使用日期 */
  UserVoucher_UsedDate: Date;
  /** 使用狀態 0：未使用 1：使用中 2：已使用 3：已過期  */
  UserVoucher_UsedState: number;
  /** 使用狀態名 */
  UserVoucher_UsedStateName: string;
  /** 狀態 0：無效 1：有效(預設) 9：刪除  */
  UserVoucher_State: number;
  /** 優惠卷核銷完成訊息 */
  VoucherUsedMessage: string;
  /** 優惠卷名稱 */
  Voucher_Name: string;
}

/** 周邊探索 - 列表 Request */
export interface Request_AreaIndex extends Model_ShareData {
  /** 搜尋Model */
  SearchModel: Search_AreaIndex;
}

/** 搜尋Model */
export interface Search_AreaIndex {
  /** 半徑 (預設5公里) */
  IndexArea_Distance: number;
  /** 首頁景點頻道編號 */
  IndexArea_Code: number;
  /** 首頁景點目錄編號 */
  AreaMenu_Code: number;
}

/** 優惠卷資訊表 */
export class AFP_Voucher {
  /** ID */
  Voucher_ID: number;
  /** 編碼 */
  Voucher_Code: number;
  /** 使用者優惠卷編碼  當消費者持有才放 */
  Voucher_UserVoucherCode?: number;
  /** 國碼 */
  Voucher_CountryCode: number;
  /** 折扣金額 (訂單詳細用) */
  Discount_Amount: number;
  /** 優惠卷使用類型(code) 1:到店 / 線上 2:線上 3:到店 */
  Voucher_UsedType: number;
  /** 優惠卷使用類型名字，後端會根據優惠券類型 */
  Voucher_UsedTypeName: string;
  /** 優惠卷顯示類型
   *
   * 1000 : 線上商店
   * 1100 : 實體商店
   * 2000 : 景點
   * 2100 : 住宿
   * 2200 : 美食
   * 2300 : 遊樂(體驗)
   * 2400 : 購物
   * 2500 : 醫療保健
   */
  Voucher_ShowType: number;
  /** 優惠卷顯示類型名稱 */
  Voucher_ShowTypeName: string;
  /** 標題(店名) */
  Voucher_Title: string;
  /** 網頁開啟模式 */
  Voucher_URLTarget: string;
  /** 去商店網址 */
  Voucher_URL: string;
  /** 優惠卷按鈕狀態 0: 已領取 1: 領取 2: 去商店 3: 已使用 4: 領取完畢 5: 使用 6: 已逾期 7: 未生效 8: 使用中 */
  Voucher_IsFreq: number;
  /** 優惠卷按鈕狀態名稱 */
  Voucher_FreqName: string;
  /** 優惠類型 1:折扣劵 2:免運劵 11:贈品劵 */
  Voucher_Type: number;
  /** 總店編號 */
  Voucher_CompanyCode: number;
  /** 商店編號 */
  Voucher_ECStoreCode: number;
  /** 外部名稱 */
  Voucher_ExtName: string;
  /** 領取點數 */
  Voucher_DedPoint: number;
  /** 優惠點數 */
  Voucher_SpecialPoint: number;
  /** 圖片 */
  Voucher_Image: string;
  /** 已領取總數量 */
  Voucher_ReleasedCount: number;
  /** 總發行數量 */
  Voucher_IssuanceLimit: number;
  /** 會員可領取數量 */
  Voucher_ReceiveLimit: number;
  /** 可使用類型 */
  Voucher_UsedLimitType: number;
  /** 可使用類型 */
  Voucher_UsedLimit: number;
  /** 檢查規則 */
  Voucher_CheckLimit: number;
  /** 抵扣類型 */
  Voucher_FeeType: number;
  /** 使用開始日期 */
  Voucher_UsedOnDate: Date;
  /** 使用結束日期 */
  Voucher_UsedOffDate: Date;
  /** 上架日期 */
  Voucher_OnlineDate: Date;
  /** 下架日期 */
  Voucher_OfflineDate: Date;
  /** 狀態 0:無效 1:有效 9:刪除 */
  Voucher_State: number;
  /** 內容 */
  Voucher_Content: string;
  /** 注意事項 */
  Voucher_Note: string;
  /** 可使用優惠卷的商品 */
  VoucherRange_Prod: number[];
  /** 優惠卷使用限制表 */
  List_VoucherLimit: AFP_VoucherLimit[];
  /** 優惠卷已使用次數 - 顯示用 */
  VoucherUseCount: number;
  /** 領取日期 */
  Voucher_ReceiveDate: Date;
  /** 是否開啟主掃 */
  Voucher_IsScan: number;
}



/** 優惠卷使用限制表 */
export interface AFP_VoucherLimit {
  /** ID */
  VoucherLimit_ID: number;
  /** 優惠卷Code */
  VoucherLimit_VoucherCode: number;
  /** 總成本價(含稅) */
  VoucherLimit_CostPrice: number;
  /** 艾斯成本價(含稅) */
  VoucherLimit_AFPCostPrice: number;
  /** 已使用數量 */
  VoucherLimit_UsedCount: number;
  /** 發行數量 */
  VoucherLimit_IssuanceLimit: number;
  /** 比率/金額 */
  VoucherLimit_Discount: number;
  /** 最低金額/數量 */
  VoucherLimit_MinUnit: number;
  /** 最高金額/數量 */
  VoucherLimit_MaxUnit: number;
  /** 商品Code */
  VoucherLimit_ProductCode1: number;
  /** 贈品數量 */
  VoucherLimit_Count1: number;
  /** 商品Code2 */
  VoucherLimit_ProductCode2: number;
  /** 贈品數量2 */
  VoucherLimit_Count2: number;
  /** 商品Code3 */
  VoucherLimit_ProductCode3: number;
  /** 贈品數量3 */
  VoucherLimit_Count3: number;
  /** 商品Code4 */
  VoucherLimit_ProductCode4: number;
  /** 贈品數量4 */
  VoucherLimit_Count4: number;
  /** 商品Code5 */
  VoucherLimit_ProductCode5: number;
  /** 贈品數量5 */
  VoucherLimit_Count5: number;
  /** 狀態 0:無效 1:有效 9:刪除 */
  VoucherLimit_State: number;
}

/** 物流部件表 */
export interface AFP_ECLogisticsPart {
  /** ID */
  ECLogisticsPart_ID: number;
  /** 營業國家 */
  ECLogisticsPart_Country: number;
  /** 營業縣/市區 */
  ECLogisticsPart_City: number;
}

/** 會員中心- 我的訂單 RequestModel */
export interface Request_MemberOrder extends Model_ShareData {
  /** 區別操作
   *
   * 1: 列表查詢
   * 2: 詳細查詢
   * 3: 確認收貨
   * 4: 發動客服單
   * */
  SelectMode: number;
  /** 搜尋Model */
  SearchModel: Search_MemberOrder;
}

/** 會員中心- 我的訂單 SearchModel */
export interface Search_MemberOrder {
  /** 訂單編號 */
  OrderNo?: number;
  /** 訂單狀態 (列表用) 1: 已付款 2: 已出貨 3: 已到貨 4: 退換貨 */
  OrderState?: number;
  /** 訂單類型 1: 一般訂單 21: 電子票證 */
  OrderType?: number;
}

export interface Response_MemberOrder extends Model_ShareData {
  /** 訂單詳細 */
  AFP_MemberOrder: AFP_MemberOrder;
  /** 訂單商家 */
  AFP_ECStore: AFP_ECStore;
  /** 訂單列表 */
  List_MemberOrder: AFP_MemberOrder[];
  /** 訂單商品 */
  List_ItemInfoPart: AFP_ItemInfoPart[];
  /** 自定義參數(20,21,22) */
  AFP_UserReport: AFP_UserReport[];
  /** 訂單使用優惠卷 */
  List_UserVoucher: AFP_Voucher[];
}

/** 訂單詳細 */
export interface AFP_MemberOrder extends AFP_Order {
  /** 訂單商品數量 */
  Order_ProdCount: number;
  /** 訂單第一個商品圖片(列表用) */
  Order_ProdImg: string;
  /** 付款方式(顯示用) */
  PaymentShowName: string;
  /** 信用卡後四碼(顯示用) */
  Card4No: string;
  /** 發票號碼(顯示用) */
  InvoiceNo: string;
  /** 訂單群組編號 */
  Order_GroupNo: number;
  /**  訂單狀態 0: 未付款 1: 已付款 2: 已出貨 3: 已到貨 (已完成) */
  OrderState: number;
  /** 商店名稱 */
  Order_ECStoreName: string;
  /** 訂單實付金額 */
  PayOrder_PayAmount: number;
  /** 客服單單號 */
  ServiceTableNo: number;
  /** 發票收據統一編號(顯示用) */
  InvoiceTaxID: string;
  /** 收據號碼(顯示用) */
  ReceiptNo: string;
  /** 收據金額(顯示用) */
  Order_ReceiptAmount: number;
  /** 收據買受人(顯示用) */
  ReceiptMemberName: string;
  /** 收據發票狀態 0 未開立 1 正常 2 作廢 3 折讓 */
  InvoiceState: number;
  /** 收據金額(中文) */
  ReceiptChineseAmount: string;
}

/** 訂單 */
export class AFP_Order {
  constructor() {
    this.Order_ChangeAmount = 0;
    this.Order_ChangeShippingAmount = 0;
    this.Order_PlatChangeAmount = 0;
  }

  /** ID */
  Order_ID: number;
  /** 單號 */
  Order_TableNo: number;
  /** 金流訂單編碼 */
  Order_PayOrderTableNo: number;
  /** 上級企業 */
  Order_MainStoreCode: number;
  /** 商店編碼 */
  Order_ECStoreCode: number;
  /** 消費者編碼 */
  Order_UserInfoCode: number;
  /** 商家物流ID */
  Order_ECLogisticsID: number;
  /** QRCode */
  Order_QRCode: string;
  /** 幣別 */
  Order_Currency: string;
  /** 稅率 */
  Order_TaxRate: number;
  /** 收件人國家 */
  Order_RecCountry: number;
  /** 收件人縣/市區 */
  Order_RecCity: number;
  /** 收件人行政區 */
  Order_RecCityArea: number;
  /** 收件人地址 */
  Order_RecAddress: string;
  /** 收件人姓名 */
  Order_RecName: string;
  /** 收件人信箱 */
  Order_RecEmail: string;
  /** 收件人電話 */
  Order_RecTel: string;
  /** 運費 */
  Order_ShippingAmount: number;
  /** 異動運費 */
  Order_ChangeShippingAmount: number;
  /** 寄送方式 1: 宅配 2: 店家自取 99:無 */
  Order_DeliveryWays: number;
  /** 總交易金額 */
  Order_Amount: number;
  /** 異動總金額 */
  Order_ChangeAmount: number;
  /** 平台優惠異動金額 */
  Order_PlatChangeAmount: number;
  /** 顧客留言資訊 */
  Order_ConsumerMsg: string;
  /** 出貨時間 */
  Order_DepartDate: Date;
  /** 到貨時間 */
  Order_ArrivalDate: Date;
  /** 生成日期 */
  Order_InsertDate: Date;
  /** 付款截止日期 */
  Order_DeadlineDate: Date;
  /** 實際付款日期 */
  Order_PaymentDate: Date;
  /** 狀態 0：無效 1：有效(預設) 9：刪除 */
  Order_State: number;
  /** 鑑賞日期 */
  Order_AppreciationDate: Date;
}

/** 項目部件 */
export interface AFP_ItemInfoPart {
  /** ID */
  ItemInfoPart_ID: number;
  /** 參考表單編號 */
  ItemInfoPart_UpTableNo: number;
  /** 表單編號 */
  ItemInfoPart_TableNo: number;
  /** 商店編碼 */
  ItemInfoPart_ECStoreCode: number;
  /** 項目ID */
  ItemInfoPart_ItemID: number;
  /** 項目編碼 */
  ItemInfoPart_ItemCode: number;
  /** 項目名稱 */
  ItemInfoPart_ItemName: string;
  /** 項目訊息 */
  ItemInfoPart_ItemMsg: string;
  /** 規格值編號 [多個逗號區隔]  */
  ItemInfoPart_AttributeValueCode: string;
  /** 規格值名稱 */
  ItemInfoPart_AttributeValueName: string;
  /** 數量 */
  ItemInfoPart_Quantity: number;
  /** 異動數量 */
  ItemInfoPart_ChangeQTY: number;
  /** 稅額 */
  ItemInfoPart_Tax: number;
  /** 未稅金額 */
  ItemInfoPart_NoTax: number;
  /** 總金額(含稅) */
  ItemInfoPart_Amount: number;
  /** 實付金額(單價)(含稅) */
  ItemInfoPart_PayAmount: number;
  /** 成本金額(單價)(含稅) */
  ItemInfoPart_Cost: number;
  /** 銷售金額(單價)(含稅) */
  ItemInfoPart_TrueAmount: number;
  /** 項目類型 */
  ItemInfoPart_Type: number;
  /** 異動金額 */
  ItemInfoPart_ChangeAmount: number;
  /** 優惠卷編號 [多個逗號區隔] */
  ItemInfoPart_VoucherCode: string;
  /** 目錄編碼 */
  ItemInfoPart_UserDefineCode: number;
  /** 目錄名稱 */
  ItemInfoPart_UserDefineName: string;
  /** 處理狀態 0: 不同意 1: 換貨 2: 退款*/
  ItemInfoPart_DealState: number;
  /** 狀態  0:無效 1:有效 9:刪除 */
  ItemInfoPart_State: number;
  /** 商品圖片(顯示用) */
  Product_ShowImg: string;
  /** 票券狀態 0 未開通 1 已開通 2 已使用 9 已退票 99 已逾時 */
  UserTicket_UsedState?: number;
  /** 票卷狀態(顯示用) */
  UserTicket_ShowUsedState?: string;
  /** 其他編碼（如：電子票證編碼） */
  ItemInfoPart_OtherCode: number;
  /** 收據說明(品名) */
  ItemInfoPart_ReceiptText: string;
  /** 收據金額(單價) */
  ItemInfoPart_ReceiptPrice: number;
  /** 商品狀態 0:無效 1:有效 */
  Product_State?: boolean;
}

/** 會員中心-我的地址 - RequestModel */
export class Request_MemberAddress extends Model_ShareData {
  /**區別操作(通用)
   *
   * 1:新增
   * 2:刪除
   * 3:編輯
   * 4:查詢列表
   * 5:查詢詳細
   */
  SelectMode: number;
  /** 我的地址 */
  AFP_UserFavourite?: AFP_UserFavourite;
}

/** 會員中心-我的地址 - ResponseModel */
export interface Response_MemberAddress {
  /** 我的地址 列表 */
  List_UserFavourite: AFP_UserFavourite[];
  /** 我的地址 詳細 */
  AFP_UserFavourite: AFP_UserFavourite;
  /** 自定義參數 */
  AFP_UserReport: AFP_UserReport[];
}

/** 客服單 */
export class AFP_Services {
  /** 單號 */
  Services_TableNo?: number;
  /** 商城訂單編碼 */
  Services_OrderTableNo: number;
  /** 商店編碼 */
  Services_ECStoreCode: number;
  /** 會員編碼 */
  Services_UserInfoCode?: number;
  /** 客戶名稱 */
  Services_CName: string;
  /** 連絡電話 */
  Services_CPhone: string;
  /** 貨物取回地址 */
  Services_Address: string;
  /** 電子郵件 */
  Services_Email: string;
  /** 其他訊息 */
  Services_OtherMsg: string;
  /** 原因 */
  Services_Reason: number;
  /** 處理狀態 */
  Services_HandleState?: number;
  /** 狀態 0:無效 1:有效(預設) 9:刪除 */
  Services_State?: number;
  /** 生成日期 */
  Services_InsertDate?: Date;
  /** 退款狀態 */
  Services_RefundState?: number;
}

/** 表單歷史處理記錄表 */
export class AFP_DealInfo {
  /** 表單的處理人 */
  DealInfo_DealerName: string;
  /** 表單的處理結果前台名稱 */
  DealInfo_DealStateShowName: string;
  /** 表單的處理時間 */
  DealInfo_Date: Date;
  /** 表單的處理意見 */
  DealInfo_Content: string;
  /** 表單的處理人 code */
  DealInfo_DealerCode: number;
  /** 前端顯示日期 */
  FrontDate?: string;
}

export class AFP_CSPayment {
  CSPayment_ID: number;
  /** 特店編碼 */
  CSPayment_ContractStoreCode: number;
  /** 總店編碼 */
  CSPayment_CompanyCode: number;
  /** 支付方式 */
  CSPayment_PayType: number;
  /** 支付名稱(前台) */
  CSPayment_ShowName: string;
  /** 圖示 */
  CSPayment_Image: string;
  /** 可退款次數 */
  CSPayment_RefundCount: number;
  /** 狀態 */
  CSPayment_State: number;
  /** 支付部件 */
  List_CSPaymentPart: AFP_CSPaymentPart[];
}

export class AFP_CSPaymentPart {
  CSPaymentPart_ID: number;
  /** 支付方式 */
  CSPaymentPart_CSPaymentID: number;
  /** 支付詳細名稱(前台) */
  CSPaymentPart_ShowName: string;
  /** 支付詳細值 */
  CSPaymentPart_Value: number;
  /** 手續費類型 */
  CSPaymentPart_FeeType: number;
  /** 手續費 */
  CSPaymentPart_Fee: number;
  /** 每筆最低手續費 */
  CSPaymentPart_MinFee: number;
  /** 每筆最高手續費 */
  CSPaymentPart_MaxFee: number;
  /** 狀態 */
  CSPaymentPart_State: number;
}

export class AFP_UserPoint {
  UserPoint_ID: number;
  /** 點數類型 */
  UserPoint_Type: number;
  /** 文字 */
  UserPoint_Text: string;
  /** 副標文字 */
  UserPoint_SubText: string;
  /** 增加數量 */
  UserPoint_AddQuantity: number;
  /** 點數生效日期 */
  UserPoint_ActiveDate?: Date;
  /** 點數有效日期 */
  UserPoint_LimitDate?: Date;
  /** 生成日期 */
  UserPoint_Date?: Date;
}

/** 遊戲資訊表 */
export class AFP_Game {
  /** 編碼 */
  Game_Code: number;
  /** 遊戲類型 1: 刮刮樂 2: 大轉盤 */
  Game_Type: number;
  /** 遊戲類型格數
   *
   * 以下為GetGameType=2使用，並且限制獎品設定數量
   * 4：4格
   * 8：8格
   * 12：12格
   */
  Game_TypeSpace: number;
  /** 外部名稱 */
  Game_ExtName: string;
  /** 規則 */
  Game_RuleText: string;
  /** 圖片 */
  Game_Image: string;
  /** 刮刮樂背景底圖 */
  Game_ScratchImage: string;
  /** 刮刮樂銀漆圖案 */
  Game_ScratchItemImage: string;
  /** 上方廣告 */
  Game_ADImage: string;
  /** 領取扣除點數 */
  Game_DedPoint: number;
  /** 可玩次數 */
  Game_PlayCount: number;
  /** 遊戲開始日期 */
  Game_OnDate: Date;
  /** 遊戲結束日期 */
  Game_OffDate: Date;
  /** 遊戲遊玩條件類型 0: 一般會員(無限制資格的遊戲) 1: 綁卡會員遊戲 */
  Game_ConditionType: number;
  /** 遊戲標籤 */
  Game_Tag: string;
}

/** 限時優惠券 RequestModel */
export interface Request_ECVouFlashSale extends Model_ShareData {
  /** 搜尋模組 */
  SearchModel?: Search_VouFlashSale;
}

/** 限時優惠券 RequestModel 搜尋模組 */
export interface Search_VouFlashSale {
  /** 優惠卷頻道編碼 */
  VouChannel_Code: number;
}

/** 限時優惠券 ResponseModel */
export interface Response_ECVouFlashSale extends Model_ShareData {
  /** 優惠券資料(目錄+優惠券) */
  List_Voucher: AFP_ChannelVoucher[];
  /** 廣告列表 */
  List_ADImg: AFP_ADImg[];
  /** 限時優惠卷 */
  List_VouFlashSale: AFP_Voucher[];
  /** 限時優惠主表 */
  AFP_VouFlashSale: AFP_VouFlashSale;
  /** 使用範圍 */
  List_UsedType: Model_DictionaryShort[];
  /** 優惠卷類型  */
  List_ShowType: Model_DictionaryShort[];
  /** 折扣類型使用 */
  List_VoucherType: Model_DictionaryShort[];
}

/** 優惠眷限時搶購 */
export interface AFP_VouFlashSale {
  /** ID */
  VouFlashSale_ID: number;
  /** 編碼 */
  VouFlashSale_Code: number;
  /** 外部名稱 */
  VouFlashSale_ExtName: string;
  /**上架日期  */
  VouFlashSale_OnlineDate: Date;
  /** 下架日期 */
  VouFlashSale_OfflineDate: Date;
  /** 狀態 0:無效 1:有效 9:刪除 */
  VouFlashSale_State: number;
}

/** 遊戲  RequestModel */
export interface Request_Games extends Model_ShareData {
  /** 搜尋模組 */
  SearchModel: Search_Game;
  /** 遊戲編碼 */
  Game_Code?: number;
}

/** 遊戲  RequestModel 搜尋模組 */
export interface Search_Game {
  /** 遊戲編碼 */
  Game_Code?: number;
}

/** 遊戲  ResponseModel */
export interface Response_Games extends Model_ShareData {
  /** 遊戲主表 */
  AFP_Game: AFP_Game;
  /** 遊戲部件 */
  List_GamePart: AFP_GamePart[];
  /** 會員總點數 */
  TotalPoint: number;
  /** 中獎獎品 */
  GameReward: AFP_GamePart;
  ADImg_Theme: AFP_ADImg[];
  /** 遊戲可遊玩狀態 0 : 不可遊玩(未完成綁卡等條件未完成) 1 : 可遊玩 */
  GameState: boolean;
  /** 遊戲 Alert 資訊 */
  Model_AlertInfo: Model_AlertInfo;
}

/** 遊戲資訊部件 */
export interface AFP_GamePart {
  /** ID */
  GamePart_ID: number;
  /** 遊戲編號 */
  GamePart_GameCode: number;
  /** 類型 1：點數 2：優惠卷 3：贈品*/
  GamePart_Type: number;
  /** 項目ID */
  GamePart_ItemID: number;
  /** 項目編碼 */
  GamePart_ItemCode: number;
  /** 項目名稱 */
  GamePart_ItemName: string;
  /** 項目圖片 */
  GamePart_ItemImage: string;
  /** 規格值編號 */
  GamePart_AttributeValueCode: string;
  /** 規格值名稱 */
  GamePart_AttributeValueName: string;
  /** 贈送點數 */
  GamePart_Values: number;
  /** 狀態 0:無效 1:有效 9:刪除 */
  GamePart_State: number;
}

/** 共用AlertModel */
export interface Model_AlertInfo {
  /** Alert訊息 */
  BodyMsg: string;
  /** Alert 右邊按鈕資訊 */
  RightBtnMsg: string;
  /** Alert 右邊按鈕連結 */
  RightBtnUrl: string;
  /** Alert 左邊按鈕資訊 */
  LeftBtnMsg: string;
  /** Alert 左邊按鈕連結 */
  LeftBtnUrl: string;
}

/** 會員中心 - 檢查狀態用(訂單,優惠卷) Request_Model */
export interface Request_MemberCheckStatus extends Model_ShareData {
  /** 訂單,優惠卷 QRCode */
  QRCode: string;
}

/** 會員中心 - 檢查狀態用(訂單,優惠卷) Response_Model */
export interface Response_MemberCheckStatus extends Model_ShareData {
  /** 訂單資訊 */
  AFP_MemberOrder: AFP_MemberOrder;
  /** 消費這優惠卷核銷紀錄表 */
  AFP_UserVoucher: AFP_UserVoucher;
  /** 廣告列表 90002 */
  List_ADImg: AFP_ADImg[];
}

/** 所有優惠券 RequestModel */
export interface Request_ECVoucher extends Model_ShareData {
}

/** 所有優惠券 ResponseModel */
export interface Response_ECVoucher extends Model_ShareData {
  /** 優惠券資料(目錄+優惠券) */
  List_Voucher: AFP_ChannelVoucher[];
  /** 廣告列表 30003 */
  List_ADImg: AFP_ADImg[];
  /** 使用範圍 */
  List_UsedType: Model_DictionaryShort[];
  /** 優惠卷類型 */
  List_ShowType: Model_DictionaryShort[];
  /** 折扣類型使用 */
  List_VoucherType: Model_DictionaryShort[];
}

/** 頻道優惠卷 */
export interface AFP_ChannelVoucher {
  /** 外部目錄頻道ID */
  UserDefine_ChannelID: number;
  /** 外部目錄編碼 */
  UserDefine_Code: number;
  /** 外部目錄編碼名字 */
  UserDefine_Name: string;
  /** 優惠卷資訊 */
  VoucherData: AFP_Voucher[];
}

export class CartStoreList {
  StoreCode: number;
  StoreName: string;
  CheckedStatus: boolean;
  ProductList: ProductInfo[];
  EditMode: boolean;
}

export interface ProductInfo {
  CartId: number;
  DirCode: number;
  DirName: string;
  ProductCode: number;
  ProductName: string;
  ProductAttrValues: string;
  ProductQty: number;
  ProductPrice: number;
  ProductImg: string;
  CheckedStatus: boolean;
  Cart_ProductState: boolean;
}

/**
 * 優惠券資訊(含限制使用ID及計算後的優惠金額)
 */
export class OrderVoucher extends AFP_Voucher {
  constructor() {
    super();
    this.discount = 0;
  }

  limitID: number;
  discount: number;
}

export class OrderInvoice {
  constructor() {
    this.invoiceMode = 0;
    this.invoiceTitle = '';
    this.invoiceTaxID = '';
    this.carrierType = 0;
    this.carrierCode = '';
    this.loveCode = '';
  }

  /** 發票類型 */
  invoiceMode: number;
  /** 發票抬頭 */
  invoiceTitle: string;
  /** 統一編號 */
  invoiceTaxID: string;
  /** 載具類型 */
  carrierType: number;
  /** 手機條碼 */
  carrierCode: string;
  /** 愛心碼 */
  loveCode: string;
  /** 發票顯示資訊 */
  message: string;
}

export class OrderStore implements AFP_ECStore {
  constructor() {
    this.order = new AFP_Order();
    this.preVoucher = new OrderVoucher();
  }

  ECStore_Code?: number;
  ECStore_CompanyCode?: number;
  ECStore_Type: number;
  ECStore_TypeName: string;
  ECStore_ShowName: string;
  ECStore_Lng?: number;
  ECStore_Lat?: number;
  ECStore_Distance?: number;
  ECStore_Country?: string;
  ECStore_City?: number;
  ECStore_LocalCityArea?: number;
  ECStore_Address?: string;
  ECStore_Tel?: string;
  ECStore_OpenTime?: string;
  ECStore_Features?: string;
  ECStore_Logo?: string;
  ECStore_Image1?: string;
  ECStore_Image2?: string;
  ECStore_Image3?: string;
  ECStore_Image4?: string;
  ECStore_Image5?: string;
  ECStore_WebURL?: string;
  ECStore_FBURL?: string;
  ECStore_LineURL?: string;
  ECStore_IGURL?: string;
  ECStore_Justka: string;
  ECStore_Demo?: string;

  /** 訂單資訊(含運費等) */
  order?: AFP_Order;
  /** 店家訂單原始總金額(不含運費) */
  total?: number;
  /** 單一商店結帳商品 */
  products?: AFP_Cart[];
  /** 該商店可使用的優惠券 */
  vouchers?: AFP_Voucher[];
  /** 預備選擇的優惠券 */
  preVoucher?: OrderVoucher;
  /** 確定選擇的優惠券 */
  voucher?: OrderVoucher;
  /** 顯示選擇的寄送方式用 */
  dwSelected?: number;
}

export class OrderPlatform {
  constructor() {
    this.vouchers = [];
    this.preVoucher = new OrderVoucher();
    this.voucher = new OrderVoucher();
  }
  /** 選擇中的平台優惠券 */
  preVoucher: OrderVoucher;
  /** 已確定的平台優惠券 */
  voucher: OrderVoucher;
  /** 可使用的平台優惠券 */
  vouchers: AFP_Voucher[];
  /** 最高運費店家 */
  topFreightStore?: OrderStore;
}

/** 會員中心 - 我的票卷 ReuqestModel */
export interface Request_MemberTicket extends Model_ShareData {
  /** 搜尋模組 */
  SearchModel: Search_MemberTicket;
}

/** 會員中心 - 我的票券 ReuqestModel 搜尋模組 */
export interface Search_MemberTicket {
  /** 票券編號 */
  UserTicket_Code?: number;
  /** 使用狀態 1: 可用 2: 歷史 */
  UserTicket_UsedType?: number;
}

/** 會員中心 - 我的票券 ResponseModel */
export interface Response_MemberTicket extends Model_ShareData {
  /** 使用者票券 */
  AFP_UserTicket: AFP_UserTicket;
  /** 使用者票券列表 */
  List_UserTicket: AFP_UserTicket[];
  /** 票券商品 */
  AFP_Product: AFP_Product;
}

/** 使用者票券列表 */
export interface AFP_UserTicket {
  /** ID */
  UserTicket_ID: number;
  /** 使用者編碼 */
  UserTicket_UserInfoCode: number;
  /** 編號 */
  UserTicket_Code: number;
  /** 商品編號 */
  UserTicket_ProdCode: number;
  /** 服務商訂單編碼 */
  UserTicket_ExtCode: string;
  /** 服務商QRCode */
  UserTicket_QRCode: string;
  /** 服務商票號 */
  UserTicket_UniqueID: number;
  /** 退費金額 */
  UserTicket_RefundFee: number;
  /** 票券狀態 0：未開通 1：已開通 2：已使用 9：已退票 99：已逾時*/
  UserTicket_UsedState: number;
  /** 開通日期 */
  UserTicket_OpenDate: Date;
  /** 退票日期 */
  UserTicket_RefundDate: Date;
  /** 購買日期 */
  UserTicket_Date: Date;
  /** 使用期限 */
  UserTicket_LimitDate: Date;
  /** 狀態 0:無效 1:有效(預設) 9:刪除 */
  UserTicket_State: number;
  /** 標題 */
  UserTicket_Title: string;
  /** 票券名稱 */
  UserTicket_ShowName: string;
  /** 票券狀態顯示名稱 */
  UserTicket_UsedStateShowName: string;
  /** 類型顯示名稱 暫時固定 '交通' */
  UserTicket_ShowType: string;
  /** 票券圖片 */
  UserTicket_ShowImg: string;
}

/** 會員中心 - 客服單 Request_Model */
export class Request_MemberServices extends Model_ShareData {
  constructor() {
    super();
    this.AFP_Services = new AFP_Services();
  }
  /** 客服單 */
  AFP_Services: AFP_Services;
  /** 問答訊息 */
  DealInfo_Content?: string;
}

/** 會員中心 - 客服單 Response_Model */
export class Response_MemberServices extends Model_ShareData {
  /** 客服單 資訊 */
  AFP_Services: AFP_Services;
}

/** 通知 RequestModel */
export interface Request_MemberMsg extends Model_ShareData {
  /** 搜尋模組 */
  SearchModel: Search_MemberMsg;
}

/** 通知 RequestModel 搜尋模組 */
export interface Search_MemberMsg {
  /** 分類編碼 */
  MsgCategory_Code?: number;
  /** 訊息編碼 */
  Message_Code?: number;
}

/** 通知 ResponseModel */
export class Response_MemberMsg extends Model_ShareData {
  /** 主題訊息分類 */
  List_MsgTitle: AFP_MemberMsgTitle[];
  /** 訊息 (最新 and 列表) */
  List_Message: AFP_IMessage[];
  /** 訊息詳情 */
  AFP_IMessage: AFP_IMessage;
}

/** 訊息主題 */
export interface AFP_MemberMsgTitle {
  /** 分類編碼 */
  MsgCategory_Code: number;
  /** 分類名稱 */
  MsgCategory_Name: string;
  /** 內文標題 */
  Content_Desc: string;
}

/** 訊息 */
export class AFP_IMessage {
  /** ID */
  IMessage_ID: number;
  /** 訊息分類Code */
  IMessage_MsgCategoryCode: number;
  /** 分類名稱 */
  IMessage_MsgCategoryName: string;
  /** 標題 */
  IMessage_Title: string;
  /** 內容簡述 */
  IMessage_Desc: string;
  /** 內容 */
  IMessage_Body: string;
  /** 小圖片 */
  IMessage_SmallImg: string;
  /** 訂單編號 */
  IMessage_OrderNo: number;
  /** 訂單類型 */
  IMessage_OrderType: number;
  /** 發佈日期 */
  IMessage_ReleaseDate: Date;
  /** 訊息編碼 */
  IMessage_Code: number;
  /** 大圖片 */
  IMessage_BigImg: string;
  /** 是否顯示CTA按鈕 */
  IMessage_IsShowCTA: number;
  /** 顯示了解更多 */
  activeStatus: boolean;
}

/** 註冊 ResponseModel */
export class Response_AFPLogin extends Model_ShareData {
  /** 使用者編碼 */
  Model_UserInfo?: Model_CustomerInfo;
  /** 使用者-我的最愛 */
  List_UserFavourite?: AFP_UserFavourite;
}


/** 驗證碼處理 ResponseModel */
export class Response_AFPVerifyCode extends Model_ShareData {
  /** 驗證資訊 */
  VerifiedInfo?: AFP_VerifiedInfo;
}

/** 驗證碼處理 RequestModel */
export class Request_AFPVerifyCode extends Model_ShareData {
  /** 通知功能模組
   *
   * 1：一般註冊
   * 2：忘記密碼 (SelectMode設定12)
   * 3：會員中心-手機認證
   * 11 : 第三方註冊
   * 90 : 強制驗證 */
  VerifiedAction: number;
  /** 驗證資訊 */
  VerifiedInfo?: AFP_VerifiedInfo;
}

/** 驗證資訊表
 *
 * 10: 讀取手機號碼
 * 11: 發送驗證碼
 * 12: 發送驗證碼(檢查VerifiedPhone是否存在)
 * 21: 驗證驗證碼
 */
export interface AFP_VerifiedInfo {
  /** 被驗證的手機號碼
   *
   * SelectMode = 10
   * Request時 : VerifiedPhone or [xEyes_CustomerInfo] 其中一個要有值
   * Response時 : VerifiedPhone
   *
   * SelectMode = 11、12
   * Request時 : VerifiedPhone
   * Response時 : 空
   *
   * SelectMode = 21
   * Request時 : VerifiedPhone
   * Response時 : 空
   */
  VerifiedPhone?: string;
  /** 使用者編碼
   *
   * SelectMode = 10
   * Request時 : 空
   * Response時 : 空
   *
   * SelectMode = 11、12
   * Request時 : 空
   * Response時 : CheckValue
   *
   * SelectMode = 21
   * Request時 : CheckValue
   * Response時 : CheckValue
   */
  CheckValue?: string;
  /** 驗證碼
   *
   * SelectMode = 10
   * Request時 : 空
   * Response時 : 空
   *
   * SelectMode = 11、12
   * Request時 : 空
   * Response時 : 空
   *
   * SelectMode = 21
   * Request時 : VerifiedCode
   * Response時 : 空
   */
  VerifiedCode?: string;
}

/** 查詢會員手機號碼 RequestModel */
export interface Request_AFPReadMobile extends Model_ShareData {
  /** 消費者包資訊 */
  CustomerDetail?: Model_CustomerDetail;
  /** 使用者帳號(驗證帳號是否重複 */
  UserAccount?: string;
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
}

export interface Response_AFPReadMobile {
  /** 新消費者包資訊(加密後),如有錯誤則回傳空值 */
  CustomerDetail: string;
  /** 帳號是否存在 ture 存在 false 不存在 */
  IsExist: boolean;
}

/** 常見問題 Request_Model */
export interface Request_MemberQuestion extends Model_ShareData {
  /** 搜尋模組 */
  SearchModel: Search_MemberQuestion;
}

/** 常見問題 Request_Model  SearchModel */
export interface Search_MemberQuestion extends Model_ShareData {
  /**  訊息類型 1: 常見問題 11: 幫助中心 */
  QuestionContent_Mode?: number;
  /** 分類Code: 1 隱私權政策 2 使用者規範 3 關於我 4 退貨流程 5 點數說明  */
  QuestionContent_CategoryCode?: number;
  /** 常見問題內容 編碼 */
  QuestionContent_Code?: number;
}

/** 常見問題 Response_Model */
export interface Response_MemberQuestion {
  /** 常見問題分類 */
  AFP_QuestionCategory: AFP_QuestionCategory;
  /** 常見問題分類 列表 */
  List_QuestionCategory: AFP_QuestionCategory[];
  /** 常見問題內容 */
  AFP_QuestionContent: AFP_QuestionContent;
}

/** 常見問題分類 */
export class AFP_QuestionCategory {
  /** 常見問題分類名稱 */
  QuestionCategory_Name: string;
  /** 常見問題分類編碼 */
  QuestionCategory_Code: number;
  /** 常見問題分類排序 */
  QuestionCategory_Sort: number;
  /** 常見問題分類發佈時間 */
  QuestionCategory_StartDate: Date;
  /** 常見問題分類結束時間 */
  QuestionCategory_EndDate: Date;
  /** 常見問題內容 */
  List_QuestionContent: AFP_QuestionContent[];
  /** 是否Collapse展開，前端新增 */
  Collapse: boolean;
}

/** 常見問題內容 */
export class AFP_QuestionContent {
  /** 訊息類型 */
  QuestionContent_Mode: number;
  /** 類別Code */
  QuestionContent_CategoryCode: number;
  /** 編碼 */
  QuestionContent_Code: number;
  /** 標題 */
  QuestionContent_Title: string;
  /** 內容 */
  QuestionContent_Body: string;
  /** 發佈日期 */
  QuestionContent_ReleaseDate: Date;
  /** 結束日期 */
  QuestionContent_EndDate: Date;
  /** 排序 */
  QuestionContent_Sort: number;
  /** 狀態 0:無效 1:有效 9:刪除 */
  QuestionContent_State: number;
  /** 是否Collapse展開，前端新增(問題) */
  Q_Collapse: boolean;
  /** 是否Collapse展開，前端新增(答案) */
  A_Collapse: boolean;
}
