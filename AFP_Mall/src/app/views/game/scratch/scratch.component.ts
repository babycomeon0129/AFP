import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Response_Games, Request_Games, AFP_GamePart } from '../../../_models';
import { ModalService } from 'src/app/service/modal.service';

@Component({
  selector: 'app-scratch',
  templateUrl: './scratch.component.html',
  styleUrls: ['../../../../dist/style/mission.min.css']
})
export class ScratchComponent implements OnInit, AfterViewInit, OnDestroy {
  /** 遊戲資料（遊戲名稱、類型、格數、上方圖片、規則、遊玩一次所需點數、刮刮樂圖片。每次玩完不更新） */
  @Input() gameData: Response_Games;
  /** 總點數（每玩完一次即更新） */
  public totalPoints: number;
  /** 會員所剩可玩次數（每玩完一次即更新；須注意為"-1"/不限次數的情況） */
  public playTimes: number;

  // 刮刮樂繪製所需變數
  /** mousedown event，為true時使用者才可進行繪製 */
  private mousedown: boolean;
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


  constructor(public appService: AppService, public modal: ModalService) {
  }

  ngOnInit() {
    this.totalPoints = this.gameData.TotalPoint;
    this.playTimes = this.gameData.AFP_Game.Game_PlayCount;
    // 若可玩次數 === 0或是所剩點數不夠遊完一次則阻擋使用者繪製動作
    if (this.playTimes === 0 || this.gameData.AFP_Game.Game_DedPoint > this.totalPoints) {
      this.mousedown = false;
      this.modal.show('message', { initialState: { success: false, message: '您的點數已不足或是遊玩次數已達上限!', showType: 1}});
    }
    this.w = $('#top').width();
    this.h = $('#top').height();
    this.bottomCanvas = document.querySelector('#bottom') as HTMLCanvasElement;
    this.topCanvas = document.querySelector('#top') as HTMLCanvasElement;
    this.topCanvas.width = this.bottomCanvas.width = this.w;
    this.topCanvas.height = this.bottomCanvas.height = this.h;
    this.ctxBot = this.bottomCanvas.getContext('2d'); // getContext(): to obtain the rendering/drawing context and its drawing functions
    this.ctxTop = this.topCanvas.getContext('2d');
    this.bottomCanvas.style.backgroundImage = 'url(' + this.gameData.AFP_Game.Game_ScratchImage + ')';
    this.ctxBot.font = $('#top').css('font-size') + ' Microsoft YaHei';　// 筆觸大小RWD及字體
    // 上下層畫面繪製
    this.imgTop.src = '../img/mission/scratch-no.png';
    this.imgTop.onload = () => {
        this.drawTop();
    };
    // this.imgBot.src = this.gameData.AFP_Game.Game_ScratchImage ; // 顯示不出來，用backgroundImage代替
    this.imgBot.onload = () => {
        this.drawBot();
    };
  }

  /** 刮刮樂底部畫面繪製 */
  drawBot() {
    // 清除區域，為了點擊再來一次進行頁面重繪
    this.ctxBot.canvas.style.opacity = '1';
    this.ctxBot.drawImage(this.imgBot, 0 , 0 , this.w , this.h);
    this.ctxBot.clearRect(0, 0, this.w, this.h);
  }

  /** 刮刮樂上層畫面繪製 */
  drawTop() {
    this.ctxTop.canvas.style.opacity = '1';
    this.ctxTop.drawImage(this.imgTop , 0 , 0 , this.w , this.h);

    // 判斷當前是否為第一次刮開，不是則清除上一次區域
    if (this.ctxTop.globalCompositeOperation !== 'destination-out') {
      this.ctxTop.globalCompositeOperation = 'destination-out';
    } else {
      // 設定指定矩形範圍內的所有像素為透明，清除所有先前繪製的內容
      this.ctxTop.clearRect(0, 0, this.w, this.h);
    }
  }

  /** 開獎結果 */
  alertInfo() {
    const ctxTopData = this.ctxTop.getImageData(0, 0, this.w, this.h).data;
    let n = 0 ; // 已刮開的面積比例
    for (const i of ctxTopData) {
      if (ctxTopData[i] === 0) {
          n ++;
      }
    }
    // 判斷刮開區域大於50%時
    if (n >= ctxTopData.length * 0.5) {
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
        this.totalPoints = data.TotalPoint;
        this.playTimes = data.AFP_Game.Game_PlayCount;
        this.prizeData = data.GameReward;
        this.ctxTop.globalCompositeOperation = 'destination-over';
        this.ctxTop.canvas.style.opacity = '0'; // 上層canvas變透明
        this.appService.callLayerUp('.winmsg');
      });
    }
  }

  /** 再玩一次 */
  playAgain() {
    this.appService.backLayerUp();
    // this.drawBot(); // imgBot沒有設src，iOS會報錯，而實際底層的圖是用bottomCanvas的background-image了，也不需要再繪圖一次
    this.drawTop();
    if (this.playTimes === 0 || this.gameData.AFP_Game.Game_DedPoint > this.totalPoints) {
      this.modal.show('message', { initialState: { success: false, message: '您的點數已不足或是遊玩次數已達上限!', showType: 1}});
    }
  }

  /** 使用者在畫布的行為偵測（0: start/down, 1: move, 2: end/up） */
  eventDetect(eventType: number, e) {
    // 若可玩次數 === 0或是所剩點數不夠遊完一次則阻擋使用者繪製動作
    if (this.playTimes === 0 || this.gameData.AFP_Game.Game_DedPoint > this.totalPoints) {
      this.mousedown = false;
    } else {
      switch (eventType) {
        case 0:
          this.eventDown(e);
          break;
        case 1:
          this.eventMove(e);
          break;
        case 2:
          this.eventUp(e);
          break;
      }
    }
  }

  eventDown(ev) {
    // ev = ev || event;
    ev.preventDefault();
    this.mousedown = true;
  }

  eventUp(ev) {
      // ev = ev || event;
      ev.preventDefault();
      this.mousedown = false;
  }

  eventMove(ev) {
    // ev = ev || event;
    ev.preventDefault();
    if (this.mousedown) {
      if (ev.changedTouches) {
          ev = ev.changedTouches[ev.changedTouches.length - 1];
      }
      const x = ev.pageX - this.topCanvas.offsetLeft;
      const y = ev.pageY - this.topCanvas.offsetTop;
      this.ctxTop.beginPath();
      this.ctxTop.arc(x, y, 18, 0, Math.PI * 2);
      this.ctxTop.fill();
      this.alertInfo();
    }
  }

  /** 獎項顯示訊息及前往路徑 */
  prizeResponse(): {msg: string, page: string} {
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

  ngAfterViewInit() {
    // 鼠標移動開始刮圖層
    this.topCanvas.addEventListener('touchstart', (e) => { this.eventDetect(0, e); });
    this.topCanvas.addEventListener('touchend', (e) => { this.eventDetect(2, e); });
    this.topCanvas.addEventListener('touchmove', (e) => { this.eventDetect(1, e); });
    this.topCanvas.addEventListener('mousedown', (e) => { this.eventDetect(0, e); });
    document.addEventListener('mouseup', (e) => { this.eventDetect(2, e); });
    this.topCanvas.addEventListener('mousemove', (e) => { this.eventDetect(1, e); });
  }

  ngOnDestroy() {
    if (this.appService.tLayerUp.includes('.winmsg')) {
      this.appService.backLayerUp();
    }
  }
}
