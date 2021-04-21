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
   * */
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
}

export interface Model_CustomerInfo {
  Customer_Name?: string;
  Customer_Code?: string;
  CustomerInfo?: string;
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

export interface Request_AFPVerify {
  AFPVerify: string;
  UserInfo_Code: number;
}

export interface Response_AFPVerify {
  UserInfo_Code: number;
  NoticeLog_CheckCode: string;
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
  UUID?: number;
  /** App用分享連結 */
  AppShareUrl?: string;
}

// 暫用class (for會員: 地址、卡片)
export class AFP_UserFavourite {
  UserFavourite_ID?: number;
  UserFavourite_CountryCode?: number;
  UserFavourite_Type?: number;
  UserFavourite_UserInfoCode?: number;
  UserFavourite_TypeCode?: number;
  UserFavourite_IsDefault?: number;
  UserFavourite_Text1?: string;
  UserFavourite_Text2?: string;
  UserFavourite_Text3?: string;
  UserFavourite_Number1?: number;
  UserFavourite_Number2?: number;
  UserFavourite_Token?: string;
  UserFavourite_Date?: Date;
  UserFavourite_Encryption?: string;
  UserFavourite_Sort?: number;
  UserFavourite_State?: number;
  UserFavourite_SyncState?: number;
}

export class Model_MemberProfile extends Model_ShareData {
  UserAccount: string;
  UserProfile_Name?: string;
  UserProfile_Birthday?: Date;
  UserProfile_Email?: string;
  UserProfile_Mobile?: string;
  UserProfile_PassPort?: boolean;
  UserProfile_MTPs?: boolean;
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
    IndexVoucher_Code: number;
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

export interface VoucherJsonFile_Attrbute {
  Voucher_Code: number;
  Attribute_Type: number;
  Attribute_Code: number;
  Attribute_Name: string;
  AttributeValue_Code: number;
  AttributeValue_Name: string;
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

/** /** 商城-商品列表 RequestModel */
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
}

export interface Request_GetCheckout extends Model_ShareData {
  List_Cart?: AFP_Cart[];
}

export interface Response_GetCheckout extends Model_ShareData {
  List_ECStore?: AFP_ECStore[];
  Pick_ECStore?: AFP_ECStore[];
  List_Cart?: AFP_Cart[];
  List_ECLogistics?: AFP_ECLogistics[];
  List_UserFavourite?: AFP_UserFavourite[];
  List_UserReport?: AFP_UserReport[];
  UserInfo_Name?: string;
  UserProfile_Mobile?: string;
  UserProfile_Email?: string;
}

export interface Request_GetUserVoucher extends Model_ShareData {
  List_Cart?: AFP_Cart[];
}

export interface Response_GetUserVoucher extends Model_ShareData {
  List_UserVoucher?: AFP_UserVoucher[];
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

export class Request_MemberUserVoucher extends Model_ShareData {
  Voucher_Code?: number;
  Voucher_ActivityCode?: string;
  SearchModel: Search_MemberUserVoucher;
}

export interface Search_MemberUserVoucher {
  SelectMode?: number;
}

export interface Response_MemberUserVoucher extends Model_ShareData {
  List_UserVoucher: AFP_Voucher[];
  Model_Voucher: AFP_Voucher;
  AFP_UserVoucher: AFP_UserVoucher;
  List_UsedType: Model_DictionaryShort[];
  List_ShowType: Model_DictionaryShort[];
  List_VoucherType: Model_DictionaryShort[];
}

export class Model_DictionaryShort {
  Key: number;
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

export interface Request_MemberOrder extends Model_ShareData {
  SelectMode: number;
  SearchModel: Search_MemberOrder;
}

export interface Search_MemberOrder {
  OrderNo?: number;
  OrderState?: number;
  /** 訂單類型 1: 一般訂單 21: 電子票證 */
  OrderType?: number;
}

export interface Response_MemberOrder extends Model_ShareData {
  AFP_MemberOrder: AFP_MemberOrder;
  AFP_ECStore: AFP_ECStore;
  List_MemberOrder: AFP_MemberOrder[];
  List_ItemInfoPart: AFP_ItemInfoPart[];
  AFP_UserReport: AFP_UserReport[];
  List_UserVoucher: AFP_Voucher[];
}

export interface AFP_MemberOrder extends AFP_Order {
  Order_ProdCount: number;
  Order_ProdImg: string;
  PaymentShowName: string;
  Card4No: string;
  InvoiceNo: string;
  Order_GroupNo: number;
  OrderState: number;
  Order_ECStoreName: string;
  PayOrder_PayAmount: number;
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

export interface AFP_ItemInfoPart {
  ItemInfoPart_ID: number;
  ItemInfoPart_UpTableNo: number;
  ItemInfoPart_TableNo: number;
  ItemInfoPart_ECStoreCode: number;
  ItemInfoPart_ItemID: number;
  ItemInfoPart_ItemCode: number;
  ItemInfoPart_ItemName: string;
  ItemInfoPart_ItemMsg: string;
  ItemInfoPart_AttributeValueCode: string; // 規格值編號 [多個逗號區隔]
  ItemInfoPart_AttributeValueName: string;
  ItemInfoPart_Quantity: number;
  ItemInfoPart_ChangeQTY: number;
  ItemInfoPart_Tax: number;
  ItemInfoPart_NoTax: number;
  ItemInfoPart_Amount: number;
  ItemInfoPart_PayAmount: number;
  ItemInfoPart_Cost: number;
  ItemInfoPart_TrueAmount: number;
  ItemInfoPart_Type: number;
  ItemInfoPart_ChangeAmount: number;
  ItemInfoPart_VoucherCode: string; // 優惠券編號 [多個逗號區隔]
  ItemInfoPart_UserDefineCode: number;
  ItemInfoPart_UserDefineName: string;
  ItemInfoPart_DealState: number;
  ItemInfoPart_State: number;
  Product_ShowImg: string;
  /** 票券狀態 0 未開通 1 已開通 2 已使用 9 已退票 99 已逾時 */
  UserTicket_UsedState?: number;
  UserTicket_ShowUsedState?: string;
  /** 其他編碼（如：電子票證編碼） */
  ItemInfoPart_OtherCode: number;
  /** 收據說明(品名) */
  ItemInfoPart_ReceiptText: string;
  /** 收據金額(單價) */
  ItemInfoPart_ReceiptPrice: number;
  Product_State?: boolean;
}

export class Request_MemberAddress extends Model_ShareData {
  SelectMode: number;
  AFP_UserFavourite?: AFP_UserFavourite;
}

export interface Response_MemberAddress {
  List_UserFavourite: AFP_UserFavourite[];
  AFP_UserFavourite: AFP_UserFavourite;
  AFP_UserReport: AFP_UserReport[];
}

export class AFP_Services {
  Services_TableNo?: number;
  Services_OrderTableNo: number;
  Services_ECStoreCode: number;
  Services_UserInfoCode?: number;
  Services_CName: string;
  Services_CPhone: string;
  Services_Address: string;
  Services_Email: string;
  Services_OtherMsg: string;
  Services_Reason: number;
  Services_HandleState?: number;
  Services_State?: number;
  Services_InsertDate?: Date;
  Services_RefundState?: number;
}

export class AFP_DealInfo {
  DealInfo_DealerName: string;
  DealInfo_DealStateShowName: string;
  DealInfo_Date: Date;
  DealInfo_Content: string;
  DealInfo_DealerCode: number;
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

export class AFP_Game {
  /** 編碼 */
  Game_Code: number;
  /** 遊戲類型 */
  Game_Type: number;
  /** 遊戲類型格數 */
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
}

export interface Request_ECVouFlashSale extends Model_ShareData {
  SearchModel?: Search_VouFlashSale;
}

export interface Search_VouFlashSale {
  VouChannel_Code: number;
}

export interface Response_ECVouFlashSale extends Model_ShareData {
  List_Voucher: AFP_ChannelVoucher[];
  List_ADImg: AFP_ADImg[];
  List_VouFlashSale: AFP_Voucher[];
  AFP_VouFlashSale: AFP_VouFlashSale;
}

export interface AFP_VouFlashSale {
  VouFlashSale_ID: number;
  VouFlashSale_Code: number;
  VouFlashSale_ExtName: string;
  VouFlashSale_OnlineDate: Date;
  VouFlashSale_OfflineDate: Date;
  VouFlashSale_State: number;
}

export interface Request_Games extends Model_ShareData {
  SearchModel: Search_Game;
  Game_Code?: number;
}

export interface Search_Game {
  Game_Code?: number;
}

export interface Response_Games extends Model_ShareData {
  AFP_Game: AFP_Game;
  List_GamePart: AFP_GamePart[];
  TotalPoint: number;
  GameReward: AFP_GamePart;
  ADImg_Theme: AFP_ADImg[];
  GameState: boolean;
  Model_AlertInfo: Model_AlertInfo;
}

export interface AFP_GamePart {
  GamePart_ID: number;
  GamePart_GameCode: number;
  GamePart_Type: number;
  GamePart_ItemID: number;
  GamePart_ItemCode: number;
  GamePart_ItemName: string;
  GamePart_ItemImage: string;
  GamePart_AttributeValueCode: string;
  GamePart_AttributeValueName: string;
  GamePart_Values: number;
  GamePart_State: number;
}

export interface Model_AlertInfo {
  BodyMsg: string;
  RightBtnMsg: string;
  RightBtnUrl: string;
  LeftBtnMsg: string;
  LeftBtnUrl: string;
}

export interface Request_MemberCheckStatus extends Model_ShareData {
  QRCode: string;
}

export interface Response_MemberCheckStatus extends Model_ShareData {
  AFP_MemberOrder: AFP_MemberOrder;
  AFP_UserVoucher: AFP_UserVoucher;
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

export interface Request_MemberTicket extends Model_ShareData {
  SearchModel: Search_MemberTicket;
}

export interface Search_MemberTicket {
  UserTicket_Code?: number;
  UserTicket_UsedType?: number;
}

export interface Response_MemberTicket extends Model_ShareData {
  AFP_UserTicket: AFP_UserTicket;
  List_UserTicket: AFP_UserTicket[];
  AFP_Product: AFP_Product;
}

export interface AFP_UserTicket {
  UserTicket_ID: number;
  UserTicket_UserInfoCode: number;
  UserTicket_Code: number;
  UserTicket_ProdCode: number;
  UserTicket_ExtCode: string;
  UserTicket_QRCode: string;
  UserTicket_UniqueID: number;
  UserTicket_RefundFee: number;
  UserTicket_UsedState: number;
  UserTicket_OpenDate: Date;
  UserTicket_RefundDate: Date;
  UserTicket_Date: Date;
  UserTicket_LimitDate: Date;
  UserTicket_State: number;
  UserTicket_Title: string;
  UserTicket_ShowName: string;
  UserTicket_UsedStateShowName: string;
  UserTicket_ShowType: string;
  UserTicket_ShowImg: string;
}

export class Request_MemberServices extends Model_ShareData {
  constructor() {
    super();
    this.AFP_Services = new AFP_Services();
  }
  AFP_Services: AFP_Services;
  DealInfo_Content?: string;
}

export class Response_MemberServices extends Model_ShareData {
  AFP_Services: AFP_Services;
}

export interface Request_MemberMsg extends Model_ShareData {
  SearchModel: Search_MemberMsg;
}

export interface Search_MemberMsg {
  MsgCategory_Code?: number;
  Message_Code?: number;
}

export class Response_MemberMsg extends Model_ShareData {
  /** 主題訊息分類 */
  List_MsgTitle: AFP_MemberMsgTitle[];
  /** 訊息 (最新 and 列表) */
  List_Message: AFP_IMessage[];
  /** 訊息詳情 */
  AFP_IMessage: AFP_IMessage;
  AppShareUrl: string;
}

export interface AFP_MemberMsgTitle {
  MsgCategory_Code: number;
  MsgCategory_Name: string;
  Content_Desc: string;
}

export class AFP_IMessage {
  IMessage_ID: number;
  IMessage_MsgCategoryCode: number;
  IMessage_MsgCategoryName: string;
  IMessage_Title: string;
  IMessage_Desc: string;
  IMessage_Body: string;
  IMessage_SmallImg: string;
  IMessage_OrderNo: number;
  IMessage_OrderType: number;
  IMessage_ReleaseDate: Date;
  IMessage_Code: number;
  IMessage_BigImg: string;
  IMessage_IsShowCTA: number;
  activeStatus: boolean;
}

/** 註冊 ResponseModel */
export class Response_AFPLogin extends Model_ShareData {
  /** 使用者編碼 */
  Model_UserInfo?: Model_CustomerInfo;
  /** 使用者-我的最愛 */
  List_UserFavourite?: AFP_UserFavourite;
}
export class Response_AFPVerifyCode extends Model_ShareData {
  /** 驗證資訊 */
  VerifiedInfo?: AFP_VerifiedInfo;
}

export class Request_AFPVerifyCode extends Model_ShareData {
  VerifiedAction: number;
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

export interface Request_AFPReadMobile extends Model_ShareData {
  CustomerDetail?: Model_CustomerDetail;
  UserAccount?: string;
}

export interface Model_CustomerDetail {
  UserInfo_ID: number;
  UserInfo_Code: number;
  UserInfo_UUID: number;
  UserInfo_ExtCode: string;
  UserInfo_Account: string;
  UserInfo_Name: string;
  UserInfo_Type: number;
  UserInfo_GroupNo: number;
  UserLoginState_ID: number;
  UserDevice_Code: number;
  UserDevice_DeviceCode: string;
  UserProfile_Mobile: string;
}

export interface Response_AFPReadMobile {
  /** 新消費者包資訊(加密後),如有錯誤則回傳空值 */
  CustomerDetail: string;
  IsExist: boolean;
}

export interface Request_OtherInfo extends Model_ShareData {
  SearchModel: Search_OtherInfo;
}

export interface Search_OtherInfo {
  /** 目錄編碼 */
  UserDefineCode: number;
  /** 商品頻道編號 */
  IndexChannel_Code?: number;
}

export interface Request_MemberQuestion extends Model_ShareData {
  SearchModel: Search_MemberQuestion;
}

export interface Search_MemberQuestion extends Model_ShareData {
  QuestionContent_Mode?: number;
  /** 分類Code: 1 隱私權政策 2 使用者規範 3 關於我 */
  QuestionContent_CategoryCode?: number;
  QuestionContent_Code?: number;
}

export interface Response_MemberQuestion {
  AFP_QuestionCategory: AFP_QuestionCategory;
  List_QuestionCategory: AFP_QuestionCategory[];
  AFP_QuestionContent: AFP_QuestionContent;
}

export interface AFP_QuestionCategory {
  QuestionCategory_Name: string;
  QuestionCategory_Code: number;
  QuestionCategory_Sort: number;
  QuestionCategory_StartDate: Date;
  QuestionCategory_EndDate: Date;
  List_QuestionContent: AFP_QuestionContent[];
}

export interface AFP_QuestionContent {
  QuestionContent_Mode: number;
  QuestionContent_CategoryCode: number;
  QuestionContent_Code: number;
  QuestionContent_Title: string;
  QuestionContent_Body: string;
  QuestionContent_ReleaseDate: Date;
  QuestionContent_EndDate: Date;
  QuestionContent_Sort: number;
  QuestionContent_State: number;
}
