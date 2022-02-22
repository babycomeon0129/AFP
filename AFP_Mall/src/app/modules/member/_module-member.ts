
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
  /** 卡群列表 */
  CardGroup_List?: CardGroup_List[];
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
  /** 卡片是否啟用 0：不啟用 1：啟用 */
  UserReport_State?: number;
  /** 卡片是否顯示 0：顯示卡片 1：顯示卡片，但是不啟用反灰 2：卡片無效 */
  UserReport_IsShow?: number;
  /** 卡群圖片 */
  CardGroup_Img?: string;
  /** 卡群名稱 */
  CardGroup_Name?: string;
  /** 卡群縮圖 */
  CardGroup_Thumbnail?: string;
  /** 卡群連結 */
  CardGroup_Link?: string;
  /** 卡片預設縮圖 */
  UserReport_ParamI?: string;
  /** 卡片簡介預設圖示 */
  UserReport_ParamJ?: string;
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

/** 會員中心-我的卡片 - RequestModel */
export class Request_MemberMyCard extends Model_ShareData {
  /** 區別操作(通用) 1:新增 2:刪除 3:編輯 4:查詢-列表 5:查詢 - 詳細 */
  SelectMode: number;
  /** 我的卡片 */
  AFP_UserFavourite?: AFP_UserFavourite;
  /** SearchModel */
  SearchModel: Search_MemberMyCard;
  /** 自定義參數 */
  AFP_UserReport?: AFP_UserReport[];
}

/** 會員中心-我的卡片 - RequestModel SearchModel */
export interface Search_MemberMyCard {
  /** ID */
  UserFavourite_ID: number;
}

/** 會員中心-我的卡片 - ResponseModel */
export interface Response_MemberMyCard {
  /** 我的卡片 列表 */
  List_UserFavourite: AFP_UserFavourite[];
  /** 我的卡片 詳細 */
  AFP_UserFavourite: AFP_UserFavourite;
  /** 自定義參數 */
  AFP_UserReport: AFP_UserReport[];
  /** 廣告版位  */
  List_ADImg: AFP_ADImg[];
}


// 會員中心-我的卡片卡群列表
export interface CardGroup_List {
  /** 卡群編碼 */
  CardGroup_Code: number;
  /** 浮點備用欄位 */
  CardGroup_FloatParamA?: number;
  /** 浮點備用欄位 */
  CardGroup_FloatParamB?: number;
  /** 卡群ID */
  CardGroup_ID: number;
  /** 卡群圖片 */
  CardGroup_Img?: string;
  /** 卡群新增時間 */
  CardGroup_InsertDate?: string;
  /** 數字備用欄位 */
  CardGroup_IntParamA?: number;
  /** 數字備用欄位 */
  CardGroup_IntParamB?: number;
  /** 卡群連結 */
  CardGroup_Link?: string;
  /** 卡群名稱 */
  CardGroup_Name?: string;
  /** 卡群狀態 */
  CardGroup_State: number;
  /** 同步狀態 */
  CardGroup_SyncState?: number;
  /** 卡群縮圖 */
  CardGroup_Thumbnail?: string;
  /** 卡群卡號數量 */
  CardGroup_Total: number;
  /** 卡群類型 */
  CardGroup_Type: number;
  /** 卡群更新時間 */
  CardGroup_UpdateDate?: string;
  /** 字串備用欄位 */
  CardGroup_VarParamA?: string;
  /** 字串備用欄位 */
  CardGroup_VarParamB?: string;
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

/** 會員點數 RequestModel */
export class Request_MemberPoint extends Model_ShareData {
  /** 區別操作(通用) 4:查詢-列表  5:查詢-待入帳等 */
  SelectMode: number;
  /** 搜尋模組 */
  SearchModel?: Search_MemberPoint;
}

/** 會員點數 RequestModel 搜尋模組 */
export class Search_MemberPoint {
  /** 點數類型 0: 待入賬，1: 獲得，11: 已使用 */
  UserPoint_Type?: number;
  /** 優惠券頻道編碼 */
  VouChannel_Code?: number;
}

/** 會員點數 ResponseModel */
export class Response_MemberPoint {
  /** 會員總點數 */
  TotalPoint: number;
  /** 即將到期-點數 */
  DaylinePoint: number;
  /** 即將到期-日期 */
  Dayline: Date;
  /** 會員點數 */
  List_UserPoint: AFP_UserPoint[];
}
