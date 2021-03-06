import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { ModalService } from '@app/shared/modal/modal.service';
import { Model_ShareData } from '@app/_models';
import { environment } from './../../../environments/environment.sit';

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.scss']
})
export class MissionComponent implements OnInit {
  /** 分頁代號 1:進階任務 11: 每日任務 14:綁卡任務 ，任務分頁可由後端新增，此為目前既有。 */
  public tabNo = 11;
  /** M Points點數 */
  public userPoint: number;
  /** 所有任務列表 */
  public allMission: Mission_Info[] = [];
  /** 每日任務列表 */
  public dailyMission: AFP_Mission[] = [];
  /** 顯示任務列表 */
  public listMission: AFP_Mission[] = [];
  /** 每日任務未完成數 */
  public dailyLeft = 0;

  constructor(public appService: AppService, public oauthService: OauthService,
              public modal: ModalService, private router: Router, private route: ActivatedRoute,
              private meta: Meta, private title: Title) {
    this.title.setTitle('任務 - Mobii!');
    this.meta.updateTag({ name: 'description', content: 'Mobii! - 任務。這裡會顯示 Mobii! 用戶在 Mobii! 平台上的任務，包括每日登入、每日遊戲可以拿回饋點數 M Points，三不五時會更換使用者要完成的任務。請先登入註冊以開啟功能。' });
    this.meta.updateTag({ content: '任務 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: 'Mobii! - 任務。這裡會顯示 Mobii! 用戶在 Mobii! 平台上的任務，包括每日登入、每日遊戲可以拿回饋點數 M Points，三不五時會更換使用者要完成的任務。請先登入註冊以開啟功能。', property: 'og:description' });

    this.route.queryParams.subscribe(params => {
      // 根據url params的tabNo，賦予tabNo值。如果沒有url params沒有tabNo，則初始值11(每日任務)
      this.tabNo = typeof params.tabNo !== 'undefined' ? parseInt(params.tabNo, 10) : 11;
      this.tabChange();

      // Mobii版本號與裝置作業版本
      if (typeof params.isApp !== 'undefined' && params.isApp === '1') {
        // app
        if (typeof params.Mobii_version !== 'undefined') { sessionStorage.setItem('Mobii_version', params.Mobii_version); }
        if (typeof params.Sdk_version !== 'undefined') { sessionStorage.setItem('Sdk_version', encodeURIComponent(params.Sdk_version)); }
        if (typeof params.Mobile_device !== 'undefined') { sessionStorage.setItem('Mobile_device', params.Mobile_device); }
      } else {
        // web
        sessionStorage.setItem('Mobii_version', environment.version);
        sessionStorage.setItem('Sdk_version', navigator.userAgent);
      }
    });
  }
  ngOnInit() {
    this.readData();
  }

  /** 讀取任務資料 */
  readData(): void {
    this.appService.openBlock();
    const request: Request_MemberMission = {
      SelectMode: 4
    };

    this.appService.toApi('Member', '1518', request).subscribe((data: Response_MemberMission) => {
      this.allMission = data.List_AllMission;
      this.userPoint = data.TotalPoint;
      this.tabChange();
      // 計算所有任務的未完成任務數量
      if (this.appService.loginState) {
        this.allMission.forEach(missionlist => {
          missionlist.undoneMissionCount = missionlist.List_Mission.filter(mission => mission.Mission_ClickState === 2).length;
        });
      }
      // 額外丟出每日任務及每日任務未完成數，用以顯示畫面上的每日任務完成度
      this.dailyMission = this.allMission.filter(missionlist => missionlist.TabCode === 11)[0].List_Mission;
      this.dailyLeft = this.allMission.filter(missionlist => missionlist.TabCode === 11)[0].undoneMissionCount;
      this.appService.blockUI.stop();
    });
  }

  /** 配合分頁代號tabNo切換，顯示內容 */
  tabChange(): void {
    if (this.allMission.length !== 0) {
      this.listMission = this.allMission.filter(data => data.TabCode === this.tabNo)[0].List_Mission;
    }
  }

  /** 每日任務完成度 */
  dailyDonePercent(): number {
    if (this.dailyMission.length <= 0) {
      return 0;
    } else {
      return (1 - (this.dailyLeft / this.dailyMission.length)) * 100;
    }
  }

  /** 單一項任務完成百分比
   * @param mission 單一項任務
   */
  donePercent(mission: AFP_Mission): number {
    return (mission.Mission_CurrentCount / mission.Mission_CompleteCount) * 100;
  }

  /** 任務按鈕顯示文字（已做：未領-0, 已領-1； 未做/未完成-2：有url, 無url）
   * @param state 任務狀態。目前任務系統為自動領取，用戶不需要手動領取了，後端不會response 0 給前端。
   * @param url 當前任務網址
   */
  buttonText(state: number, url: string): string {
    if (!this.appService.loginState) {
      return state === 3 ? '已結束' : 'GO';
    } else {
      switch (state) {
        case 0:
          return '領取';
        case 1:
          return '已領取';
        case 2:
          return url.trim() === '' ? '未完成' : 'GO';
        case 3:
          return '已結束';
      }
    }
  }

  /** 任務按鈕點擊行為
   * @param mission 單一項任務
   */
  buttonAction(mission: AFP_Mission): void {
    if (!this.appService.loginState) {
      this.appService.logoutModal();
    } else {
      switch (mission.Mission_ClickState) {
        case 2: // 前往任務(進階任務)
          // 意見回饋
          if (mission.Mission_CurrentURL.indexOf('/Feedback') > 0) {
            const uriParam = {
              idToken: this.oauthService.cookiesGet('idToken').cookieVal,
              Mobii_version: sessionStorage.getItem('Mobii_version'),
              Sdk_version: sessionStorage.getItem('Sdk_version'),
              Mobile_device: sessionStorage.getItem('Mobile_device')
            };
            this.router.navigate(['/Mission/Feedback'], {
              state: { data: uriParam },
              queryParams: { isApp: this.appService.isApp }
            });
          } else {
            // 一般任務
            let url = mission.Mission_CurrentURL;
            if (this.appService.isApp === 1) {
              // APP 訪問加isApp
              url = (mission.Mission_CurrentURL.indexOf('?') > 0)
              ? mission.Mission_CurrentURL + '&isApp=1' : mission.Mission_CurrentURL + '?isApp=1';
            }
            // MOB-4035 「我的」相關頁內連，其他頁外開(我的優惠券及我的收藏為原生)
            if (url.indexOf('/Member') >= 0 && !(url.indexOf('MemberDiscount') > 0 || url.indexOf('MemberFavorite') > 0)) {
              if (url.indexOf('?') !== -1) {
                // 內連有帶參數
                const paramsItem = JSON.parse('{"' + decodeURI(url.split('?')[1]).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
                this.router.navigate([url.split('?')[0]],
                  { queryParams: paramsItem}
                );
              } else {
                // 內連無參數
                this.router.navigate([mission.Mission_CurrentURL]);
              }
            } else {
              // 外連另開
              window.open(mission.Mission_CurrentURL, mission.Mission_CurrentURLTarget);
            }
          }
          break;
        case 0: // 領取點數
          this.claimPoints(mission);
          break;
      }
    }
  }

  /** 領取任務點數
   * @param mission 單一項任務
   */
  claimPoints(mission: AFP_Mission): void {
    const request: Request_MemberMission = {
      SelectMode: 1,
      Mission_Code: mission.Mission_Code
    };

    this.appService.toApi('Member', '1518', request).subscribe((data: Response_MemberMission) => {
      // 更新該任務進度狀態、按鈕顯示文字（Mission_Type = 1:進階任務 11: 每日任務 14:綁卡任務 ，任務分頁可由後端新增，此為目前既有。）
      mission.Mission_ClickState = 1;
      // 若獎勵是點數則加上
      if (mission.Mission_Value !== null) {
        this.userPoint += mission.Mission_Value;
      }
      this.appService.blockUI.stop();
    });
  }

  /** 前往MemberCoin頁 */
  conditionGo(): void {
    if (!this.appService.loginState) {
      this.appService.logoutModal();
    } else {
      this.router.navigate(['/MemberFunction/MemberCoin'], { queryParams: { showBack: true } });
    }
  }

}

/** 任務 RequestModel */
interface Request_MemberMission extends Model_ShareData {
  /** 任務編碼 */
  Mission_Code?: number;
}

/** 任務 ResponseModel */
interface Response_MemberMission extends Model_ShareData {
  /** 會員總點數 */
  TotalPoint?: number;
  /** 所有任務資訊 */
  List_AllMission: Mission_Info[];
}

/** 任務資訊 */
interface Mission_Info {
  /** 任務類型編號 */
  TabCode: number;
  /** 任務類型名稱 */
  TabName: string;
  /** 未完成任務數量，前端自己塞的 */
  undoneMissionCount: number;
  /** 任務清單 */
  List_Mission: AFP_Mission[];
}

/** 任務 */
interface AFP_Mission {
  /** ID */
  Mission_ID: number;
  /** 前置任務編碼 */
  Mission_UpMissionCode: number;
  /** 是否要完成前置任務 */
  Mission_IsDoneUp: number;
  /** 編碼 */
  Mission_Code: number;
  /** 國碼 */
  Mission_CountryCode: number;
  /** 任務類型 */
  Mission_Type: number;
  /** 名稱 */
  Mission_Name: string;
  /** 外部名稱 */
  Mission_ExtName: string;
  /** 圖片 */
  Mission_Image: string;
  /** 當前完成次數 */
  Mission_CurrentCount: number;
  /** 需要完成次數 */
  Mission_CompleteCount: number;
  /** 按鈕狀態 0 未領取 1 已領取 2 未完成 3 已結束 9 刪除 */
  Mission_ClickState: number;
  /** 任務開始日期 */
  Mission_OnDate: Date;
  /** 任務結束日期 */
  Mission_OffDate: Date;
  /** 上架日期 */
  Mission_OnlineDate: Date;
  /** 下架日期 */
  Mission_OfflineDate: Date;
  /** 領取點數 */
  Mission_Value: number;
  /** 完成後訊息 */
  Mission_Info: string;
  /** 下個任務網址標題 */
  Mission_URLTitle: string;
  /** 下個任務網址 */
  Mission_URL: string;
  /** 網頁開啟模式 */
  Mission_CurrentURLTarget: string;
  /** 當前任務網址 */
  Mission_CurrentURL: string;
}
