import { Component, OnInit, Input, Output, AfterViewInit, Renderer2, EventEmitter } from '@angular/core';
import { AppService } from '@app/app.service';
import { Response_Games, Request_Games, AFP_GamePart } from '@app/_models';
import { ModalService } from '@app/shared/modal/modal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { layerAnimation, layerAnimationUp } from '@app/animations';

@Component({
  selector: 'app-luckyspin',
  templateUrl: './luckyspin.component.html',
  styleUrls: ['./luckyspin.scss'],
  animations: [layerAnimation, layerAnimationUp],
})
export class LuckyspinComponent implements OnInit, AfterViewInit {
  /** 遊戲資料（遊戲名稱、類型、格數、上方圖片、規則、遊玩一次所需點數。每次玩完不更新） */
  @Input() gameData: Response_Games;
  /** 呼叫父層的noticeAlert方法 (跳出視窗，提醒點數不足或已達遊玩次數上限) */
  @Output() noticeAlert =  new EventEmitter();
  /** 呼叫父層的noGameStateAlert方法，遊戲為不可遊玩狀態的提醒視窗 */
  @Output() noGameStateAlert = new EventEmitter();
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
  /** 同頁滑動切換 0: 本頁 1: 活動規則 */
  public layerTrig = 0;
  /** 提示視窗(向上) 0: 本頁 1: 開獎資訊 */
  public layerTrigUp = 0;

  constructor(
    public appService: AppService,
    public modal: ModalService,
    private router: Router,
    private route: ActivatedRoute,
    private renderer2: Renderer2
  ) {
    this.currentUrl = this.router.url;
  }

  ngOnInit() {
    this.totalPoints = this.gameData.TotalPoint;
    this.playTimes = this.gameData.AFP_Game.Game_PlayCount;
    this.prizeList = this.gameData.List_GamePart;
    // APP從M Points或進來則顯示返回鍵
    this.appService.showBack =  this.route.snapshot.queryParams.showBack === 'true';
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
          this.renderer2.addClass(elem, order8[index].toString());
          break;
        case 12:
          this.renderer2.addClass(elem, order12[index].toString());
          break;
      }
    });
  }

  /** 按下play鍵 */
  play() {
    // 按下play鍵之後，先判斷該遊戲是否為可遊玩狀態，0: 不可遊玩(未完成綁卡等條件，條件由後端判定) 1:可遊玩
    if (!this.gameData.GameState) {
      this.noGameStateAlert.emit();
    } else {
      // 若須扣除點數跳出確認提示
      if ((this.playTimes !== 0 || this.gameData.AFP_Game.Game_DedPoint > this.totalPoints) && this.gameData.AFP_Game.Game_DedPoint > 0) {
        // 先跳確認扣除點數視窗，按下確認才允許進行遊戲
        this.modal
          .confirm({
            initialState: {
              message: `請確定是否扣除 Mobii! Points ${this.gameData.AFP_Game.Game_DedPoint} 點玩「${this.gameData.AFP_Game.Game_ExtName}」？`,
            },
          })
          .subscribe((res) => {
            if (res) {
              this.startGame();
            }
          });
      } else {
        this.startGame();
      }
    }
  }

  /** 開始遊戲 */
  startGame() {
    if (this.playTimes === 0 || this.gameData.AFP_Game.Game_DedPoint > this.totalPoints) {
      this.noticeAlert.emit();
    } else {
      this.playingStatus = true;
      // 閃亮效果
      this.prizesArr.forEach(item => {
        for (let i = 1; i <= this.prizesArr.length; i++) {
          const sec = i - 0.95 * i;
          if (item.classList.contains(i.toString())) {
            this.renderer2.addClass(item, 'opacity5');
            this.renderer2.setStyle(item, 'animation-delay', `${sec}s`);
          }
        }
      });
      // call api 取得開獎結果
      const request: Request_Games = {
        User_Code: sessionStorage.getItem('userCode'),
        SelectMode: 1,
        Game_Code: this.gameData.AFP_Game.Game_Code,
        SearchModel: {
          Game_Code: null,
        },
      };
      setTimeout(() => {
        this.appService.toApi('Games', '1701', request).subscribe((data: Response_Games) => {
          // 更新可玩次數、中獎結果
          if (this.playTimes > 0) {
            this.playTimes--;
          }
          this.prizeData = data.GameReward;
          // 讓動畫僅停留在中獎項目
          this.prizesArr.forEach((i) => {
            if (i.id !== this.prizeData.GamePart_ID.toString()) {
              this.renderer2.removeClass(i, 'opacity5');
            }
          });
          // 顯示中獎結果(若還在本頁/無前往任務牆領取獎勵)
          if (this.router.url === this.currentUrl) {
            // 更新總點數
            this.totalPoints = data.TotalPoint;
            this.layerTrigUp = 1;
            this.playingStatus = false;
          }
        });
      }, 2500);
    }
  }

  /** 再玩一次 */
  playAgain() {
    this.layerTrigUp = 0;
    this.prizesArr.forEach((contbox) =>
      this.renderer2.removeClass(contbox, 'opacity5')
    ); // 移除中獎項目動畫
  }

  /** 中獎獎項的顯示訊息及前往路徑 */
  prizeResponse(): { msg: string; page: string } {
    if (this.prizeData !== undefined) {
      switch (this.prizeData.GamePart_Type) {
        case 1:
          // 點數
          return {
            msg: '已發送至您的會員帳戶。',
            page: '/MemberFunction/MemberCoin',
          };
        case 2:
          // 優惠券
          return {
            msg: '已發送至您的票券夾，請注意使用期限。',
            page: '/MemberFunction/MemberDiscount',
          };
        case 3:
          // 贈品
          return {
            msg: '中獎通知已發送至您的會員帳戶。',
            page: '/Notification/NotificationList',
          };
      }
    }
  }

}
