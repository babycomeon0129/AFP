import { slideInAnimation } from './animations';
export interface Search_ConsHome {
  IndexArea_Code?: number;
  IndexTravel_Code?: number;
  UserInfo_Code?: number;
  IndexChannel_Code?: number;
  IndexDelivery_Code?: number;
}

export interface Search_AreaDetail {
  ECStore_Code: number;
  TabIndex: number;
}

export interface Response_APIModel {
  Base?: Model_BaseWebAPIResponse;
  /** 任務相關資訊 */
  MissionInfo?: Model_MissionInfo;
  Data?: string;
  /** 認證資訊 */
  Verification?: Model_Verification;
}

export interface Model_Verification {
  /** 手機是否驗證 0: 強制登出 1: 未驗證 並強制驗證 2: 未驗證 無需強驗證 3: 已驗證 */
  MobileVerified: number;
  /** 消費者包（MobileVerified = 3 會回傳,其餘狀態為空） */
  CustomerInfo: string;
  /** 使用者編碼（MobileVerified = 3 會回傳,其餘狀態為空） */
  UserCode: string;
}

export interface Model_BaseWebAPIResponse {
  Rtn_State: number;
  Rtn_Message: string;
  Rtn_Param: string;
  Rtn_URL: string;
}

export interface Model_MissionInfo {
  Select_Mode?: number;
  Mission_VarParamA: string;
  Mission_IntParamA: number;
  List_MissionDetail: Model_MissionDetail[];
}

export interface Model_MissionDetail {
  Mission_Info: string;
  Mission_URLTitle: string;
  Mission_URL: string;
}

export interface AFP_UserReport {
  UserReport_ID?: number;
  UserReport_UpCategoryCode?: number;
  UserReport_UpItemCode?: number;
  UserReport_CategoryCode?: number;
  UserReport_CategoryName?: string;
  UserReport_ItemCode?: number;
  UserReport_ItemName?: string;
  UserReport_ParamA?: string;
  UserReport_ParamB?: string;
  UserReport_ParamC?: string;
  UserReport_ParamD?: string;
  UserReport_ParamE?: string;
  UserReport_ParamF?: string;
  UserReport_ParamG?: string;
  UserReport_ParamH?: string;
  UserReport_Sort?: number;
}

export interface AFP_ADImg {
  ADImg_ID?: number;
  ADImg_Type?: number;
  ADImg_ADCode?: number;
  ADImg_Img?: string;
  ADImg_VideoURL?: string;
  ADImg_Title?: string;
  ADImg_SubTitle?: string;
  ADImg_URL?: string;
  ADImg_URLTarget?: string;
}

export interface AFP_Function {
  Function_CategaryCode: number;
  Function_ID?: number;
  Function_Code?: number;
  Function_Name?: string;
  Function_URL?: string;
  Function_Icon?: string;
  Function_IsTop?: number;
  Function_IsOther?: number;
  Function_Sort?: string;
  Function_URLTarget?: string;
  Function_IsActive?: number;
  // 我的服務-判斷ICON狀態
  isAdd?: boolean;
}

export interface Model_AreaJsonFile {
  UserDefine_ChannelID?: number;
  UserDefine_Code?: number;
  UserDefine_Name?: string;
  ECStoreData?: AreaJsonFile_ECStore[];
}

export interface AreaJsonFile_ECStore {
  UserDefine_Code?: number;
  ECStore_Code?: number;
  ECStore_ShowName?: string;
  ECStore_Image1?: string;
  ECStore_Type?: number;
  ECStore_TypeName?: string;
  ECStore_Lng?: number;
  ECStore_Lat?: number;
  ECStore_Distance?: number;
  AttrbuteData?: AreaJsonFile_Attrbute[];
}

export interface AreaJsonFile_Attrbute {
  ECStore_Code?: number;
  Attribute_Type?: number;
  Attribute_Code?: number;
  Attribute_Name?: string;
  AttributeValue_Code?: number;
  AttributeValue_Name?: string;
}

// 大首頁
export interface Request_Home extends Model_ShareData {
  SearchModel: Search_ConsHome;
}

export interface Response_Home {
  TotalPoint: number;
  VoucherCount: number;
  ADImg_Top: AFP_ADImg[];
  ADImg_Top2: AFP_ADImg[];
  ADImg_Top3: AFP_ADImg[];
  ADImg_Activity: AFP_ADImg[];
  ADImg_Theme: AFP_ADImg[];
  List_AreaData: Model_AreaJsonFile[];
  List_TravelData: Model_TravelJsonFile[];
  List_ProductData: AFP_ChannelProduct[];
  List_DeliveryData: Model_AreaJsonFile[];
  List_Voucher: AFP_ChannelVoucher[];
}

export interface Model_TravelJsonFile {
  UserDefine_ChannelID?: number;
  UserDefine_Code?: number;
  UserDefine_Name?: string;
  TravelData?: TravelJsonFile_Travel[];
}

export interface TravelJsonFile_Travel {
  UserDefine_Code?: number;
  Travel_Code?: number;
  Travel_Img?: string;
  Travel_Title?: string;
  Travel_SubTitle?: string;
  Travel_URL?: string;
  Travel_URLTarget?: string;
  Travel_LocalTitle?: string;
  AttrbuteData?: TravelJsonFile_Attrbute[];
}

export interface TravelJsonFile_Attrbute {
  Travel_Code?: number;
  Attribute_Type?: number;
  Attribute_Code?: number;
  Attribute_Name?: string;
  AttributeValue_Code?: number;
  AttributeValue_Name?: string;
}

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

export interface Response_TravelHome {
  ADImg_Top: AFP_ADImg[];
  ADImg_Activity: AFP_ADImg[];
  ADImg_Theme: AFP_ADImg[];
  List_Function: AFP_Function[];
  List_TravelData: Model_TravelJsonFile[];
}

// 周邊首頁
export interface Response_AreaIndex {
  List_AreaData: Model_AreaJsonFile[];
  List_UserDefine: AFP_UserDefine[];
}

// 周邊詳細
export interface Response_AreaDetail extends Model_ShareData {
  Model_ECStore: AFP_ECStore;
  List_ECStore: AFP_ECStore[];
  List_Voucher: AFP_Voucher[];
  List_Product: AFP_Product[];
  AFP_UserReport: AFP_UserReport[];
  Model_ECStoreExtType: AFP_ECStoreExtType;
}

export class AFP_ECStoreExtType {
  ECStoreExtType_ECStoreCode: number;
  ECStoreExtType_PartnerCode: number;
  ECStoreExtType_Type: number;
  ECStoreExtType_ExtCode: number;
}

export interface AFP_ECStore {
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
  ECStore_PickCity?: number;
  ECStore_PickCityArea?: number;
  ECStore_PickAddress?: string;
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
}

export interface Response_AreaMap {
  List_Area: AFP_ECStore[];
}

export class Request_AFPThird {
  Mode?: number;
  Account?: string;
  NickName?: string;
  Token?: string;
  JsonData?: string;
}

export interface Model_CustomerInfo {
  Customer_Name?: string;
  Customer_Code?: string;
  CustomerInfo?: string;
  Customer_UUID?: string;
}

export interface AFP_UserDefine {
  UserDefine_Code: number;
  UserDefine_Name: string;
  UserDefine_ProdCount: number;
}

export interface AFP_Product {
  Product_ID?: number;
  Product_Code?: number;
  Product_ECStoreCode?: number;
  Product_Type?: number;
  Product_ExtCode?: string;
  Product_URL?: string;
  Product_Name?: string;
  Product_ExtName?: string;
  Product_KeyWord?: string;
  Product_Depiction?: string;
  Product_Shopping: string;
  Product_OrderNotice: string;
  Product_PrimeImage?: string;
  Product_Icon?: string;
  Product_SellPrice?: number;
  Product_SpecialPrice?: number;
  Product_SpecialOnDate?: Date;
  Product_SpecialOffDate?: Date;
  Product_IsOnline?: number;
  Product_OnlineDate?: Date;
  Product_OfflineDate?: Date;
  Product_DiscountCoin?: number;
  Product_SellUnit?: number;
  Product_SellUnitName: string;
  Product_UserDefineCode?: number;
  Product_UserDefineName?: string;
}

export interface Response_ECHome extends Model_ShareData {
  ADImg_Top: AFP_ADImg[];
  ADImg_Activity: AFP_ADImg[];
  List_VoucherData: AFP_ChannelVoucher[];
  List_ProductData: AFP_ChannelProduct[];
  List_HotProduct: AFP_Product[];
  List_Function: AFP_Function[];
}

export interface Response_AFPAccount {
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

export interface Request_AFPPassword {
  AFPPassword: string;
  VerifiedInfo?: AFP_VerifiedInfo;
}

export class Model_ShareData {
  SelectMode?: number;
  User_Code?: string;
  Store_Note?: string;
  Cart_Count?: number;
  JustKaUrl?: string;
  Model_BaseResponse?: Model_BaseResponse;
  Model_BasePage?: Model_BasePage;
  UUID?: number;
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

export interface Request_MemberFavourite extends Model_ShareData {
  AFP_UserFavourite: {
    UserFavourite_ID: number;
    UserFavourite_CountryCode: number;
    UserFavourite_Type: number;
    UserFavourite_UserInfoCode: number;
    UserFavourite_TypeCode?: number;
    UserFavourite_IsDefault: number;
    UserFavourite_Text1?: string;
    UserFavourite_Text2?: string;
    UserFavourite_Text3?: string;
    UserFavourite_Number1?: number;
    UserFavourite_Number2?: number;
  };
  UserFavourite_TypeCodes?: string; // 收藏類型編碼 (多筆以逗號區隔)
}

export interface Response_MemberFavourite extends Model_ShareData {
  List_UserFavourite?: AFP_UserFavourite[];
  AFP_UserFavourite?: AFP_UserFavourite;
  List_Product?: AFP_Product[];
  List_ECStore?: AFP_ECStore[];
  List_Area?: AreaJsonFile_ECStore[];
  List_Travel?: TravelJsonFile_Travel[];
}

export interface Request_ECHome extends Model_ShareData {
  SearchModel: {
    IndexVoucher_Code: number;
    IndexChannel_Code: number;
    Cart_Code: number;
  };
}

export interface Model_BaseResponse {
  APPVerifyCode?: number;
  Model_TotalItem?: number;
  Model_TotalPage?: number;
  Model_CurrentPage?: number;
}

export interface Model_BasePage {
  Model_Page?: number;
  Model_Item?: number;
  ColumnsName?: string;
  TableName?: string;
  WhereString?: string;
  OrderString?: string;
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

export interface AFP_ChannelProduct {
  UserDefine_ChannelID: number;
  UserDefine_Code: number;
  UserDefine_Name: string;
  UserDefine_ProdCount: number;
  ProductData: AFP_Product[];
}

export interface Request_ECProductList extends Model_ShareData {
  SearchModel: {
    UserDefine_Code?: number;
    /** 商品規格值(多筆逗號區隔) */
    AttributeValue_Code: string[];
    Sort_Mode?: number;
    Cart_Code: number;
  };
}

export interface Response_ECProductList extends Model_ShareData {
  List_UserDefine: AFP_UserDefine[];
  List_Product: AFP_Product[];
  List_Attribute: AFP_Attribute[];
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

export interface Request_ECProductDetail extends Model_ShareData {
  SearchModel: {
    Product_Code: number;
    UserDefine_Code: number;
    Cart_Code: number;
  };
}

export interface Response_ECProductDetail extends Model_ShareData {
  AFP_Product: AFP_Product;
  AFP_ECStore: AFP_ECStore;
  List_ProductImg: AFP_ProductImg[];
  AFP_VoucherData: AFP_Voucher;
  List_Attribute: AFP_Attribute[];
  List_ECLogistics: AFP_ECLogistics[];
}

export interface AFP_ProductImg {
  ProductImg_ProductCode: number;
  ProductImg_ImgUrl: string;
  ProductImg_Explain: string;
}

export interface AFP_ProdAttr {
  ProdAttr_ProductCode: number;
  ProdAttr_AttributeType: number;
  ProdAttr_AttributeCode: number;
  ProdAttr_AttributeName: string;
  ProdAttr_AttributeValueCode: number;
  ProdAttr_AttributeValueName: string;
}

export interface AFP_ECLogistics {
  ECLogistics_ID: number;
  ECLogistics_Name: string;
  ECLogistics_Amount: number;
  List_ECLogisticsPart: AFP_ECLogisticsPart[];
}

export interface Request_ECCart extends Model_ShareData {
  SearchModel: Search_ECCart;
  AFP_Cart?: AFP_Cart;
  List_Cart?: AFP_Cart[];
}

export interface Search_ECCart {
  Cart_Code: number;
  ListCartID?: string;
}

export interface AFP_Cart {
  Cart_ID?: number;
  Cart_Code?: number;
  Cart_UserInfoCode?: number;
  Cart_ECStoreCode?: number;
  Cart_ECStoreName?: string;
  Cart_ProductCode?: number;
  Cart_AttributeValueCode?: string;
  Cart_AttributeValueName?: string;
  Cart_UserDefineCode?: number;
  Cart_UserDefineName?: string;
  Cart_Quantity?: number;
  Cart_Amount?: number;
  Cart_OrderState?: number;
  Cart_State?: number;
  Cart_InsertDate?: Date;
  Show_ProductName?: string;
  Show_ProductImg?: string;
  Show_ProductDiscountCoin?: number;
  Cart_ProdReceiptPrice?: number;
}

export interface Response_ECCart extends Model_ShareData {
  AFP_Cart: AFP_Cart;
  List_Cart: AFP_Cart[];
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
export interface Request_CheckUserVoucher extends Model_ShareData {
  List_Cart?: AFP_Cart[];
  List_UserVoucher?: AFP_UserVoucher[];
}

export interface Response_CheckUserVoucher extends Model_ShareData {
  Success: boolean;
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

export class AFP_UserVoucher {
  VoucherShowType: string;
  VoucherUsedType: string;
  Voucher_ShowType: number;
  Voucher_ShowName: string;
  Voucher_ShowImage: string;
  ECStore_Code: number;
  Company_ShowName: string;
  Discount_Amount: number;
  UserVoucher_UsedType: number;
  UserVoucher_ID: number;
  UserVoucher_Code: number;
  UserVoucher_TableNo?: number;
  UserVoucher_UserInfoCode: number;
  UserVoucher_VoucherCode: number;
  UserVoucher_VoucherLimitID?: number;
  UserVoucher_UsedOnDate: Date;
  UserVoucher_UsedOffDate: Date;
  UserVoucher_QRCode: string;
  UserVoucher_ReceiveDate: Date;
  UserVoucher_UsedECStore?: number;
  UserVoucher_UsedDate: Date;
  UserVoucher_UsedState: number;
  UserVoucher_UsedStateName: string;
  UserVoucher_State: number;
  VoucherUsedMessage: string;
  Voucher_URL: string;
  Voucher_URLTarget: string;
  Voucher_Name: string;
}



export interface Request_AreaIndex extends Model_ShareData {
  SearchModel: Search_AreaIndex;
}

export interface Search_AreaIndex {
  IndexArea_Distance: number;
  IndexArea_Code: number;
  AreaMenu_Code: number;
}

export interface Request_TravelHome extends Model_ShareData {
  SearchModel: Search_ConsTravelHome;
}

export interface Search_ConsTravelHome {
  IndexTravel_Code: number;
}

export interface Request_AreaDetail extends Model_ShareData {
  SearchModel: Search_AreaDetail;
}

export interface Request_AreaMap extends Model_ShareData {
  SearchModel: Search_AreaMap;
}

export interface Search_AreaMap {
  AreaMap_Distance: number;
}

export class AFP_Voucher {
  Voucher_ID: number;
  Voucher_Code: number;
  Voucher_UserVoucherCode?: number;
  Voucher_CountryCode: number;
  Discount_Amount: number;
  Voucher_UsedType: number;
  Voucher_UsedTypeName: string;
  Voucher_ShowType: number;
  Voucher_ShowTypeName: string;
  Voucher_ShowComName: string;
  Voucher_Title: string;
  Voucher_URLTarget: string;
  Voucher_URL: string;
  Voucher_IsFreq: number;
  Voucher_FreqName: string;
  ECStore_Code: number;
  Voucher_Type: number;
  Voucher_CompanyCode: number;
  Voucher_ECStoreCode: number;
  Voucher_Name: string;
  Voucher_ExtName: string;
  Voucher_DedPoint: number;
  Voucher_SpecialPoint: number;
  Voucher_Image: string;
  Voucher_ActivityType: number;
  Voucher_ActivityCode: string;
  Voucher_ReleasedCount: number;
  Voucher_IssuanceLimit: number;
  Voucher_ReceiveLimit: number;
  Voucher_UsedLimitType: number;
  Voucher_UsedLimit: number;
  Voucher_CheckLimit: number;
  Voucher_FeeType: number;
  Voucher_UsedOnDate: Date;
  Voucher_UsedOffDate: Date;
  Voucher_OnlineDate: Date;
  Voucher_OfflineDate: Date;
  Voucher_State: number;
  Voucher_Content: string;
  Voucher_Note: string;
  VoucherRange_Prod: number[];
  List_VoucherLimit: AFP_VoucherLimit[];
  VoucherUseCount: number;
  Voucher_ReceiveDate: Date;
  Voucher_IsScan: number;
}



export interface AFP_VoucherLimit {
  VoucherLimit_ID: number;
  VoucherLimit_VoucherCode: number;
  VoucherLimit_CostPrice: number;
  VoucherLimit_AFPCostPrice: number;
  VoucherLimit_UsedCount: number;
  VoucherLimit_IssuanceLimit: number;
  VoucherLimit_Discount: number;
  VoucherLimit_MinUnit: number;
  VoucherLimit_MaxUnit: number;
  VoucherLimit_ProductCode1: number;
  VoucherLimit_Count1: number;
  VoucherLimit_ProductCode2: number;
  VoucherLimit_Count2: number;
  VoucherLimit_ProductCode3: number;
  VoucherLimit_Count3: number;
  VoucherLimit_ProductCode4: number;
  VoucherLimit_Count4: number;
  VoucherLimit_ProductCode5: number;
  VoucherLimit_Count5: number;
  VoucherLimit_State: number;
}

export class TERP_Order {
  Order_ID: number;
  Order_TableNo: number;
  Order_PayOrderTableNo: number;
  Order_CartCode: number;
  Order_MainStoreCode: number;
  Order_ECStoreCode: number;
  Order_UserInfoCode: number;
  Order_ECLogisticsID: number;
  Order_QRCode: string;
  Order_Currency: string;
  Order_TaxRate: number;
  Order_RecCountry: number;
  Order_RecCity: number;
  Order_RecCityArea: number;
  Order_RecAddress: string;
  Order_RecName: string;
  Order_RecEmail: string;
  Order_RecTel: string;
  Order_ShippingAmount: number;
  Order_ChangeShippingAmount: number;
  Order_DeliveryWays: number;
  Order_Amount: number;
  Order_ChangeAmount: number;
  Order_ConsumerMsg: string;
  Order_DepartDate: Date;
  Order_ArrivalDate: Date;
  Order_InsertDate: Date;
  Order_DeadlineDate: Date;
  Order_PaymentDate: Date;
  Order_State: number;
}

export interface AFP_ECLogisticsPart {
  ECLogisticsPart_ID: number;
  ECLogisticsPart_Country: number;
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

export class AFP_Order {
  constructor() {
    this.Order_ChangeAmount = 0;
    this.Order_ChangeShippingAmount = 0;
    this.Order_PlatChangeAmount = 0;
  }

  Order_ID: number;
  Order_TableNo: number;
  Order_PayOrderTableNo: number;
  Order_CartCode: number;
  Order_MainStoreCode: number;
  Order_ECStoreCode: number;
  Order_UserInfoCode: number;
  Order_ECLogisticsID: number;
  Order_QRCode: string;
  Order_Currency: string;
  Order_TaxRate: number;
  Order_RecCountry: number;
  Order_RecCity: number;
  Order_RecCityArea: number;
  Order_RecAddress: string;
  Order_RecName: string;
  Order_RecEmail: string;
  Order_RecTel: string;
  Order_ShippingAmount: number;
  Order_ChangeShippingAmount: number;
  Order_DeliveryWays: number;
  Order_Amount: number;
  Order_ChangeAmount: number;
  Order_PlatChangeAmount: number;
  Order_ConsumerMsg: string;
  Order_DepartDate: Date;
  Order_ArrivalDate: Date;
  Order_InsertDate: Date;
  Order_DeadlineDate: Date;
  Order_PaymentDate: Date;
  Order_State: number;
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
  /** 刮刮樂圖案 */
  Game_ScratchImage: string;
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

export interface Request_MemberCheckStatus extends Model_ShareData {
  QRCode: string;
}

export interface Response_MemberCheckStatus extends Model_ShareData {
  AFP_MemberOrder: AFP_MemberOrder;
  AFP_UserVoucher: AFP_UserVoucher;
  List_ADImg: AFP_ADImg[];
}

// tslint:disable: class-name
// tslint:disable-next-line: no-empty-interface
export interface Request_ECVoucher extends Model_ShareData {
}

export interface Response_ECVoucher extends Model_ShareData {
  List_Voucher: AFP_ChannelVoucher[];
  List_ADImg: AFP_ADImg[];
}

export interface AFP_ChannelVoucher {
  UserDefine_ChannelID: number;
  UserDefine_Code: number;
  UserDefine_Name: string;
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

export class Response_AFPLogin extends Model_ShareData {
  Model_UserInfo?: Model_CustomerInfo;
  List_UserFavourite?: AFP_UserFavourite;
}

export class Third_AppleUser {
  authorization: {
    state: string;
    code: string;
    id_token: string;
  };
  user?: {
    email: string;
    name: {
      firstName: string;
      lastName: string;
    };
  };
}

export class Response_AFPVerifyCode extends Model_ShareData {
  VerifiedInfo?: AFP_VerifiedInfo;
}

export class Request_AFPVerifyCode extends Model_ShareData {
  VerifiedAction: number;
  VerifiedInfo?: AFP_VerifiedInfo;
}

export interface AFP_VerifiedInfo {
  VerifiedPhone?: string;
  CheckValue?: string;
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
