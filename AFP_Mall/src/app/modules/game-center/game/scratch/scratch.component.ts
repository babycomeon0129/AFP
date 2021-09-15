import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { Response_Games, Request_Games, AFP_GamePart } from '@app/_models';
import { ModalService } from '@app/shared/modal/modal.service';
import { layerAnimation, layerAnimationUp } from '@app/animations';

@Component({
  selector: 'app-scratch',
  templateUrl: './scratch.component.html',
  styleUrls: ['./scratch.scss'],
  animations: [layerAnimation, layerAnimationUp]
})
export class ScratchComponent implements OnInit, AfterViewInit {
  /** 遊戲資料（遊戲名稱、類型、格數、上方圖片、規則、遊玩一次所需點數、刮刮樂圖片。每次玩完不更新） */
  @Input() gameData: Response_Games;
  /** 呼叫父層的noticeAlert方法 (跳出視窗，提醒點數不足或已達遊玩次數上限) */
  @Output() noticeAlert = new EventEmitter();
  /** 呼叫父層的noGameStateAlert方法，遊戲為不可遊玩狀態的提醒視窗 */
  @Output() noGameStateAlert = new EventEmitter();
  /** 總點數（每玩完一次即更新） */
  public totalPoints: number;
  /** 會員總可玩次數（每玩完一次即更新；須注意為"-1"/不限次數的情況） */
  public playTimes: number;
  // 刮刮樂繪製所需變數
  /** mousedown event，為true時使用者才可進行繪製 */
  private mousedown = false;
  /** 刮刮樂畫布寬度 */
  private w: number;
  /** 刮刮樂畫布高度 */
  private h: number;
  /** 刮刮樂底層畫布 */
  private bottomCanvas: HTMLCanvasElement;
  /** 刮刮樂上層畫布 */
  private topCanvas: HTMLCanvasElement;
  /** 刮刮樂底層2D渲染環境 */
  private ctxBot: CanvasRenderingContext2D;
  /** 刮刮樂上層2D渲染環境 */
  private ctxTop: CanvasRenderingContext2D;
  /** 刮刮樂底層畫布圖片 */
  public imgBot = new Image();
  /** 刮刮樂上層畫布圖片 */
  public imgTop = new Image();
  /** 開獎結果 */
  public prizeData: AFP_GamePart;
  /** 避免重疊開啟開獎結果視窗 0: 初始 1: 開啟 2以上：不開啟 */
  public prizeOpen = 0;
  /** 同頁滑動切換 0: 本頁 1: 活動規則 */
  public layerTrig = 0;
  /** 視窗滑動切換(往上) 0: 本頁 1: 開獎資訊 */
  public layerTrigUp = 0;
  /** 允許進行遊戲。需使用者點擊扣點確認視窗的「確認」才允許進行遊戲 */
  public goPlay = false;

  constructor(public appService: AppService, public oauthService: OauthService, public modal: ModalService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.totalPoints = this.gameData.TotalPoint;
    this.playTimes = this.gameData.AFP_Game.Game_PlayCount;
    this.w = document.getElementById('top').offsetWidth;
    this.h = document.getElementById('top').offsetHeight;
    this.bottomCanvas = document.querySelector('#bottom') as HTMLCanvasElement;
    this.topCanvas = document.querySelector('#top') as HTMLCanvasElement;
    this.topCanvas.width = this.bottomCanvas.width = this.w;
    this.topCanvas.height = this.bottomCanvas.height = this.h;
    this.ctxBot = this.bottomCanvas.getContext('2d');
    this.ctxTop = this.topCanvas.getContext('2d');
    this.bottomCanvas.style.backgroundImage = `url(${this.gameData.AFP_Game.Game_ScratchImage})`;

    /** 上層畫面繪製 */
    // this.imgTop.src = '../img/mission/scratch-no.png';
    // 為避免canvas CROSS問題，設置crossOrigin及在src加上時間戳記
    if (this.gameData.AFP_Game.Game_ScratchItemImage) {
      this.imgTop.crossOrigin = 'Anonymous';
      this.imgTop.src = `${this.gameData.AFP_Game.Game_ScratchItemImage}?temp=${(new Date()).valueOf()}`;
    } else {
      this.imgTop.src = '../img/mission/scratch-win.png';
    }
  }

  /** 刮刮樂底部畫面繪製 */
  drawBot(): void {
    // 清除區域，為了點擊再來一次進行頁面重繪
    this.ctxBot.canvas.style.opacity = '0';
    this.ctxBot.drawImage(this.imgBot, 0, 0, this.w, this.h);
    this.ctxBot.clearRect(0, 0, this.w, this.h);
  }

  /** 刮刮樂上層畫面繪製 */
  drawTop(): void {
    this.prizeOpen = 0;
    this.ctxTop.canvas.style.opacity = '1';
    this.ctxTop.drawImage(this.imgTop, 0, 0, this.w, this.h);
    // 判斷當前是否為第一次刮開，不是則清除上一次區域
    if (this.ctxTop.globalCompositeOperation !== 'destination-out') {
      this.ctxTop.globalCompositeOperation = 'destination-out';
    } else {
      // 設定指定矩形範圍內的所有像素為透明，清除所有先前繪製的內容
      this.ctxTop.clearRect(0, 0, this.w, this.h);
    }
  }

  /** 使用者在畫布的行為事件-用者按下滑鼠按鈕時開始繪製 */
  eventDown(ev: { preventDefault: () => void; }): void {
    ev.preventDefault();
    if (this.appService.loginState) {
      // 先判斷該遊戲是否為可遊玩狀態，0: 不可遊玩(未完成綁卡等條件，條件由後端判定) 1:可遊玩
      if (this.gameData.GameState) {
        // 若可玩次數 === 0或是所剩點數不夠遊完一次，則阻擋使用者進行遊戲
        if (this.playTimes === 0 || this.gameData.AFP_Game.Game_DedPoint > this.totalPoints) {
          this.mousedown = false;
          this.noticeAlert.emit();
        } else {
          // 先判斷是否允許進行遊戲
          if (!this.goPlay) {
            // 跳出扣點確認視窗，如果Game_DedPoint為0點，不需要跳Alert
            if (this.gameData.AFP_Game.Game_DedPoint > 0) {
              this.modal
                .confirm({
                  initialState: {
                    message: `請確定是否扣除 Mobii! Points ${this.gameData.AFP_Game.Game_DedPoint} 點玩「${this.gameData.AFP_Game.Game_ExtName}」？`,
                  },
                })
                .subscribe((res) => {
                  this.goPlay = res === true;
                });
            } else {
              this.goPlay = true;
            }
          } else {
            this.mousedown = true;
          }
        }
      } else {
        this.noGameStateAlert.emit();
      }
    } else {
      this.oauthService.loginPage();
    }
  }
  /** 使用者在畫布的行為事件-放開滑鼠按鈕的動作、在刮刮樂touchend的動作。當出現上述動作時，停止繪製 */
  eventUp(ev: { preventDefault: () => void; }): void {
    ev.preventDefault();
    this.mousedown = false;
  }
  /** 使用者在畫布的行為事件-移動滑鼠時進行刮除上層圖片的動作 */
  eventMove(ev: { preventDefault: () => void; changedTouches: string | any[]; pageX: number; pageY: number; }): void {
    ev.preventDefault();
    if (this.mousedown && this.goPlay) {
      if (ev.changedTouches) {
        ev = ev.changedTouches[ev.changedTouches.length - 1];
      }

      /** 筆刷大小設定
       * canvas自適應寬度尺寸分別有(800, 500, 390, 300)
       */
      let size = 0;
      (this.w === 800) ? size = 40 : (this.w === 500) ? size = 30 : (this.w === 390) ? size = 24 : size = 18;

      /** 滑鼠位址偏移設定
       * 增加變數(offsetSizeX, offsetSizeY)，處理刮開時位移之增減值
       * canvas自適應寬度尺寸分別有(800, 500, 390, 300)
       */
      let offsetSizeX = 0;
      let offsetSizeY = 0;
      (this.w === 800) ? offsetSizeX = this.topCanvas.offsetLeft :
        (this.w === 500) ? offsetSizeX = this.topCanvas.offsetLeft * 0.8 : offsetSizeX = 0;
      (this.w === 800) ? offsetSizeY = -120 : (this.w === 500) ? offsetSizeY = 5 :
        (this.w === 390) ? offsetSizeY = 50 : offsetSizeY = 75;

      const x = ev.pageX - this.topCanvas.offsetLeft - offsetSizeX;
      const y = ev.pageY - this.topCanvas.offsetHeight - offsetSizeY;

      this.ctxTop.beginPath();
      this.ctxTop.moveTo(x, y);
      this.ctxTop.arc(x, y, size, 0, Math.PI * 2);
      this.ctxTop.closePath();
      this.ctxTop.fill();
      this.alertInfo();
    }
  }

  /** 開獎結果 */
  alertInfo(): void {
    // this.gameData.AFP_Game.Game_PlayCount -1 為次數無限制
    if (this.playTimes === 0 || this.gameData.AFP_Game.Game_DedPoint > this.totalPoints) {
      this.noticeAlert.emit();
    } else {
      const ctxTopData = this.ctxTop.getImageData(0, 0, this.w, this.h).data;
      // 已刮開的面積比例
      let n = 0;
      // 原先為for...of寫法，因語法太新，無法計算沒有透明區域圖片的刮開面積，故改為for迴圈寫法
      for (let i = ctxTopData.length; i--;) {
        if (ctxTopData[i] === 0) {
          n++;
        }
      }
      // 刮開面積從50%調高到70%
      if (n >= ctxTopData.length * 0.7) {
        ++this.prizeOpen;  // prizeOpen＝1增加遮罩，以避免點擊到畫板重複讀取
        if (this.prizeOpen === 1) {
          // 先阻止使用者繪製行為，以避免n繼續加乘並觸發多次API
          this.mousedown = false;
          // call api 取得開獎結果、總點數、可玩次數
          const request: Request_Games = {
            User_Code: sessionStorage.getItem('userCode'),
            SelectMode: 1,
            Game_Code: this.gameData.AFP_Game.Game_Code,
            SearchModel: {
              Game_Code: null
            }
          };
          this.appService.toApi('Games', '1701', request).subscribe((data: Response_Games) => {
            this.ctxTop.globalCompositeOperation = 'destination-over';  // 上層刮開
            this.ctxTop.canvas.style.opacity = '0'; // 上層canvas變透明
            this.totalPoints = data.TotalPoint;
            this.prizeData = data.GameReward;
            if (this.playTimes > 0) {
              this.playTimes--;
            }
            // 刮完後的底圖，須等到1.5秒，才跳出中獎訊息
            setTimeout(() => {
              this.layerTrigUp = 1;
            }, 1500);
            this.goPlay = false;
          });
        }
      }
    }
  }

  /** 再玩一次 */
  playAgain(): void {
    this.layerTrigUp = 0;
    // this.drawBot(); // imgBot沒有設src，iOS會報錯，而實際底層的圖是用bottomCanvas的background-image了，也不需要再繪圖一次
    this.drawTop();
    if (this.playTimes === 0 || this.gameData.AFP_Game.Game_DedPoint > this.totalPoints) {
      this.noticeAlert.emit();
    }
  }

  /** 獎項顯示訊息及前往路徑 */
  prizeResponse(): { msg: string, page: string } {
    if (this.prizeData !== undefined) {
      switch (this.prizeData.GamePart_Type) {
        case 1:
          // 點數
          return {
            msg: '已發送至您的會員帳戶。',
            page: '/MemberFunction/MemberCoin'
          };
        case 2:
          // 優惠券
          return {
            msg: '已發送至您的票券夾，請注意使用期限。',
            page: '/MemberFunction/MemberDiscount'
          };
        case 3:
          // 贈品
          return {
            msg: '中獎通知已發送至您的會員帳戶。',
            page: '/Notification/NotificationList'
          };
      }
    }
  }

  ngAfterViewInit() {
    /** 刮刮樂畫面繪製 */
    this.imgBot.onload = () => {
      this.drawBot();
    };
    this.imgTop.onload = () => {
      this.drawTop();
    };
  }


}
