import { Component, OnInit, DoCheck, KeyValueDiffer, KeyValueDiffers, ɵConsole } from '@angular/core';
import { Model_ShareData } from '../../_models';
import { AppService } from 'src/app/app.service';
import { ModalService } from '../../shared/modal/modal.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['../../../dist/style/mission.min.css']
})
export class MissionComponent implements OnInit, DoCheck {
  /** 會員名稱 */
  public userName: string;
  /** M Pointss點數 */
  public userPoint: number;
  /** 每日任務列表 */
  public dailyMission: AFP_Mission[] = [];
  /** 進階任務列表 */
  public advancedMission: AFP_Mission[] = [];
  /** 每日任務未完成數 */
  public dailyLeft = 0;
  /** 進階任務未完成數 */
  public advancedLeft = 0;
  /** 變化追蹤 */
  private serviceDiffer: KeyValueDiffer<string, any>;

  public showBackBtn = false; // APP特例處理

  constructor(public appService: AppService, public modal: ModalService, private differs: KeyValueDiffers
            , private router: Router, private route: ActivatedRoute, private meta: Meta, private title: Title) {
    // tslint:disable: max-line-length
    this.title.setTitle('任務 - Mobii!');
    this.meta.updateTag({name : 'description', content: 'Mobii! - 任務。這裡會顯示 Mobii! 用戶在 Mobii! 平台上的任務，包括每日登入、每日遊戲可以拿回饋點數 M Points，三不五時會更換使用者要完成的任務。請先登入註冊以開啟功能。'});
    this.meta.updateTag({content: '任務 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: 'Mobii! - 任務。這裡會顯示 Mobii! 用戶在 Mobii! 平台上的任務，包括每日登入、每日遊戲可以拿回饋點數 M Points，三不五時會更換使用者要完成的任務。請先登入註冊以開啟功能。', property: 'og:description'});

    this.serviceDiffer = this.differs.find({}).create();
    // 從會員中心進來則隱藏返回鍵
    if (this.route.snapshot.queryParams.showBack === 'true') {
      this.showBackBtn = true;
    }
    this.readData();
    // 若有登入顯示會員名稱
    if (this.appService.loginState === true) {
      this.userName = sessionStorage.getItem('userName');
    }
  }

  /** 讀取任務資料 */
  readData() {
    const request: Request_MemberMission = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 4
    };

    this.appService.toApi('Member', '1518', request).subscribe((data: Response_MemberMission) => {
      this.userPoint = data.TotalPoint;
      this.dailyMission = data.List_DailyMission;
      this.advancedMission = data.List_AdvancedMission;

      if (this.appService.loginState === true) {
        // 計算每日任務未完成數
        this.dailyMission.forEach(i => {
          if (i.Mission_ClickState === 2) {
            this.dailyLeft += 1;
          }
        });
        // 計算進階任務未完成數
        this.advancedMission.forEach(i => {
          if (i.Mission_ClickState === 2) {
            this.advancedLeft += 1;
          }
        });
      }
    });
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
   * @param state 任務狀態
   * @param url 當前任務網址
   */
  buttonText(state: number, url: string): string {
    if (this.appService.loginState === false) {
      return 'GO';
    } else {
      switch (state) {
        case 0:
          return '領取';
        case 1:
          return '已領取';
        case 2:
          if (url.trim() === '') {
            return '未完成';
          } else {
            return 'GO';
          }
      }
    }
  }

  /** 任務按鈕點擊行為
   * @param mission 單一項任務
   */
  buttonAction(mission: AFP_Mission) {
    if (this.appService.loginState === false) {
      this.appService.loginPage();
    } else {
      switch (mission.Mission_ClickState) {
        case 2:
          if (mission.Mission_CurrentURL.indexOf('eyesmedia.com.tw/feedback') > 0) {
            const strUser = '?customerInfo=' + sessionStorage.getItem('CustomerInfo') + '&userCode=' + sessionStorage.getItem('userCode') + '&userName=' + sessionStorage.getItem('userName') + '&loginType=1';
            const device = {system : '', isApp: this.appService.isApp !== null ? strUser + '&isApp=1' : ''};
            //  Justka特別處理
            if (navigator.userAgent.match(/android/i)) {
              //  Android
              device.system = 'android';
            } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
              //  IOS
              device.system = 'iOs';
            } else {
              device.system = 'web';
            }

            const query = encodeURIComponent(JSON.stringify(device)).replace(/"/g, '%22');
            mission.Mission_CurrentURL = mission.Mission_CurrentURL.replace('[a]', query);
          } else {
            if (this.appService.isApp != null) {
              mission.Mission_CurrentURL = mission.Mission_CurrentURL + '?isApp=1';
            }
          }
          window.open(mission.Mission_CurrentURL, mission.Mission_CurrentURLTarget);
          break;
        case 0:
          this.claimPoints(mission);
          break;
      }
    }
  }

  /** 領取任務點數
   * @param mission 單一項任務
   */
  claimPoints(mission: AFP_Mission) {
    const request: Request_MemberMission = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 1,
      Mission_Code: mission.Mission_Code
    };

    this.appService.toApi('Member', '1518', request).subscribe((data: Response_MemberMission) => {
      // 更新該任務進度狀態、按鈕顯示文字（Mission_Type = 1: 系統(進階), 11: 每日, 12: 永久(進階), 13: 新手）
      mission.Mission_ClickState = 1;
      // 若獎勵是點數則加上
      if (mission.Mission_Value !== null) {
        this.userPoint += mission.Mission_Value;
      }
    });
  }

  conditionGo() {
    if (this.appService.loginState) {
      if (this.appService.isApp !== null) {
        const navigationExtras: NavigationExtras = {
          queryParams: { showBack: true }
        };
        this.router.navigate(['/MemberFunction/MemberCoin'], navigationExtras);
      } else {
        this.router.navigate(['/MemberFunction/MemberCoin']);
      }
    } else {
      this.appService.loginPage();
    }
  }

  ngOnInit() {
  }

  ngDoCheck() {
    const change = this.serviceDiffer.diff(this.appService);
    if (change) {
      change.forEachChangedItem(item => {
        if (item.key === 'loginState' && item.currentValue === true) {
          this.userName = sessionStorage.getItem('userName');
          this.readData();
        }
      });
    }
  }

}

export interface Request_MemberMission extends Model_ShareData {
  Mission_Code?: number;
}

export interface Response_MemberMission extends Model_ShareData {
  TotalPoint?: number;
  List_DailyMission: AFP_Mission[];
  List_AdvancedMission: AFP_Mission[];
}

export interface AFP_Mission {
  Mission_ID: number;
  Mission_UpMissionCode: number;
  Mission_IsDoneUp: number;
  Mission_Code: number;
  Mission_CountryCode: number;
  Mission_Type: number;
  Mission_Name: string;
  Mission_ExtName: string;
  Mission_Image: string;
  Mission_CurrentCount: number;
  Mission_CompleteCount: number;
  Mission_ClickState: number;
  Mission_OnDate: Date;
  Mission_OffDate: Date;
  Mission_OnlineDate: Date;
  Mission_OfflineDate: Date;
  Mission_Value: number;
  Mission_Info: string;
  Mission_URLTitle: string;
  Mission_URL: string;
  Mission_CurrentURLTarget: string;
  Mission_CurrentURL: string;
}
