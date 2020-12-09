import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Response_Games, Request_Games, AFP_GamePart } from '../../../../_models';
import { ModalService } from '../../../../shared/modal/modal.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-luckyspin',
  templateUrl: './luckyspin.component.html',
  styleUrls: ['../../../../../dist/style/mission.min.css']
})
export class LuckyspinComponent implements OnInit, AfterViewInit, OnDestroy {
  /** 遊戲資料（遊戲名稱、類型、格數、上方圖片、規則、遊玩一次所需點數。每次玩完不更新） */
  @Input() gameData: Response_Games;
  /** 總點數（每玩完一次即更新） */
  public totalPoints: number;
  /** 會員所剩可玩次數（每玩完一次即更新；須注意為"-1"/不限次數的情況） */
  public playTimes: number;
  /** 獎品品項列表 */
  public prizeList: AFP_GamePart[] = [];
  /** 獎品品項DOM Element（閃亮效果操控） */
  private prizesArr: Element[];
  /** 開獎結果 */
  public prizeData: AFP_GamePart;
  /** 是否正在遊玩（遊玩期間play鈕為disabled） */
  public playingStatus: boolean;
  /** 本頁url */
  private currentUrl: string;
  public hideBackBtn = false; // APP特例處理

  constructor(public appService: AppService, public modal: ModalService, private router: Router, private route: ActivatedRoute) {
    this.currentUrl = this.router.url;
  }

  ngOnInit() {
    this.totalPoints = this.gameData.TotalPoint;
    this.playTimes = this.gameData.AFP_Game.Game_PlayCount;
    this.prizeList = this.gameData.List_GamePart;
    // 若可玩次數 === 0或是所剩點數不夠遊完一次則阻擋遊玩
    if (this.playTimes === 0 || this.gameData.AFP_Game.Game_DedPoint > this.totalPoints) {
      this.modal.show('message', { initialState: { success: false, message: '您的點數已不足或是遊玩次數已達上限!', showType: 1 } });
    }
    // APP從M Points或進來則顯示返回鍵
    if (this.route.snapshot.queryParams.hideBackBtn === 'false') {
      this.hideBackBtn = false;
    } else {
      this.hideBackBtn = true;
    }
  }

  ngAfterViewInit() {
    // 各格數的發亮順序
    const order8 = [1, 2, 3, 8, 4, 7, 6, 5];
    const order12 = [1, 2, 3, 4, 12, 5, 11, 6, 10, 9, 8, 7];
    // 動態將發亮順序加上
    this.prizesArr = Array.from(document.getElementsByClassName('contbox'));
    this.prizesArr.forEach((elem, index) => {
      switch (this.gameData.AFP_Game.Game_TypeSpace) {
        case 8:
          elem.classList.add((order8[index].toString()));
          break;
        case 12:
          elem.classList.add((order12[index].toString()));
          break;
      }
    });
    // 將按鈕移動至指定位置
    $('#play').insertAfter('.contbox.' + this.gameData.AFP_Game.Game_TypeSpace.toString());
  }

  ngOnDestroy() {
    if (this.appService.tLayerUp.includes('.winmsg')) {
      this.appService.backLayerUp();
    }
  }

  /** 開始遊玩 */
  play() {
    this.modal.confirm({
      initialState: {
        message: `請確定是否扣除 Mobii! Points ${this.gameData.AFP_Game.Game_DedPoint} 點玩「${this.gameData.AFP_Game.Game_ExtName}」？`
      }
    }).subscribe(res => {
      if (res) {
        this.playingStatus = true;
        // 閃亮效果
        this.prizesArr.forEach((item, index) => {
          for (let i = 1; i <= this.prizesArr.length; i++) {
            const sec = i - (0.95 * i);
            if (item.classList.contains(i.toString())) {
              item.classList.add('opacity5');
              item.setAttribute('style', 'animation-delay:' + sec + 's');
            }
          }
        });
        // call api 取得開獎結果
        const request: Request_Games = {
          User_Code: sessionStorage.getItem('userCode'),
          SelectMode: 1,
          Game_Code: this.gameData.AFP_Game.Game_Code,
          SearchModel: {
            Game_Code: null
          }
        };
        setTimeout(() => {
          this.appService.toApi('Games', '1701', request).subscribe((data: Response_Games) => {
            // 更新可玩次數、中獎結果
            this.playTimes = data.AFP_Game.Game_PlayCount;
            this.prizeData = data.GameReward;
            // 讓動畫僅停留在中獎項目
            this.prizesArr.forEach(i => {
              if (i.id !== this.prizeData.GamePart_ID.toString()) {
                i.classList.remove('opacity5');
              }
            });
            // 顯示中獎結果(若還在本頁/無前往任務牆領取獎勵)
            if (this.router.url === this.currentUrl) {
              // 更新總點數
              this.totalPoints = data.TotalPoint;
              this.appService.callLayerUp('.winmsg');
              // $('.contbox').removeClass('opacity5');
              this.playingStatus = false;
            }
          });
        }, 2500);
      }
    });
  }

  /** 再玩一次 */
  playAgain() {
    this.appService.backLayerUp();
    $('.contbox').removeClass('opacity5'); // 移除中獎項目動畫
  }

  /** 中獎獎項的顯示訊息及前往路徑 */
  prizeResponse(): { msg: string, page: string } {
    if (this.prizeData !== undefined) {
      switch (this.prizeData.GamePart_Type) {
        case 1:
          // 點數
          return {
            msg: '已發送至您的會員帳戶。',
            page: '/MemberCoin'
          };
        case 2:
          // 優惠券
          return {
            msg: '已發送至您的票券夾，請注意使用期限。',
            page: '/MemberDiscount'
          };
        case 3:
          // 贈品
          return {
            msg: '中獎通知已發送至您的會員帳戶。',
            page: '/Notification'
          };
      }
    }
  }

}
