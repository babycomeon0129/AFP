import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { Model_AlertInfo, Request_Games, Response_Games } from '@app/_models';
import { Meta, Title } from '@angular/platform-browser';
import { ModalService } from '@app/shared/modal/modal.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.scss']
})
export class GameComponent implements OnInit {
  /** 遊戲編碼 */
  private gameCode: number;
  /** 遊戲資料 */
  public gameData: Response_Games;
  /** 遊戲類型（1 刮刮樂, 2 大轉盤） */
  public gameType: number;
  /** 不可遊玩狀態的提醒視窗內容 */
  public alertInfo: Model_AlertInfo;

  constructor(private route: ActivatedRoute, public appService: AppService, public modal: ModalService, private meta: Meta, private title: Title) {
    this.gameCode = Number(this.route.snapshot.params.Game_Code);
  }

  ngOnInit() {
    const request: Request_Games = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 4,
      SearchModel: {
        Game_Code: this.gameCode
      }
    };

    this.appService.toApi('Games', '1701', request).subscribe((data: Response_Games) => {
      this.gameData = data;
      // 此行放在constructor會有因生命週期導致顯示不完全問題，故放於此處
      this.gameType = Number(this.route.snapshot.queryParams.GameType);
      this.alertInfo = data.Model_AlertInfo;
      // 先判斷該遊戲是否為可遊玩狀態，0: 不可遊玩(未完成綁卡等條件，條件由後端判定) 1:可遊玩
      if (!data.GameState) {
        this.noGameStateAlert();
      } else {
        // 若可玩次數 === 0或是所剩點數不夠遊玩一次則跳提醒視窗
        if (this.gameData.AFP_Game.Game_PlayCount === 0 || this.gameData.AFP_Game.Game_DedPoint > this.gameData.TotalPoint) {
          this.noticeAlert();
        }
      }
      this.title.setTitle(data.AFP_Game.Game_ExtName + ' - Mobii!');
      this.meta.updateTag({ name: 'description', content: '' });
      this.meta.updateTag({ content: data.AFP_Game.Game_ExtName + ' - Mobii!', property: 'og:title' });
      this.meta.updateTag({ content: '', property: 'og:description' });
    });
  }

  /** 您的點數已不足或是遊玩次數已達上限的提示視窗 */
  noticeAlert(): void {
    const initialState = {
      success: true,
      type: 1,
      message: `<div class="no-data no-transform">
                <img src="../../../../../img/shopping/payment-failure.png">
                <p>Oops！你的點數不足或已達遊玩次數上限囉！</p></div>`
    };
    this.modal.show('message', { initialState });
  }

  /** 遊戲為不可遊玩狀態的提醒視窗 */
  noGameStateAlert(): void {
    const initialState = {
      success: false,
      showType: 6,
      message: this.alertInfo.BodyMsg,
      leftBtnMsg: this.alertInfo.LeftBtnMsg,
      leftBtnUrl: this.alertInfo.LeftBtnUrl,
      queryParams1: null,
      rightBtnMsg: this.alertInfo.RightBtnMsg,
      rightBtnUrl: this.alertInfo.RightBtnUrl
    };
    // 先判斷是否裝置為app，如果是，queryParams帶isApp到message modal
    initialState.queryParams1 = this.appService.isApp !== null ? {isApp: this.appService.isApp} : null

    this.modal.show('message', { initialState });
  }

}
