import { Component, OnInit } from '@angular/core';
import { Model_ShareData, AFP_ADImg, AFP_Game } from '@app/_models';
import { AppService } from '@app/app.service';
import { OauthService } from '@app/modules/oauth/oauth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '@app/shared/modal/modal.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-game-center',
  templateUrl: './game-center.component.html',
  styleUrls: ['./game-center.component.scss'],
})
export class GameCenterComponent implements OnInit {
  /** 置頂圖片(主視覺用途，僅會有一張，無連結) */
  public imgTop: AFP_ADImg;
  /** 遊戲列表 */
  public gameList: AFP_Game[] = [];
  /** 顯示遊戲列表。 根據selectedType(對照後端回傳的Game_ConditionType)，顯示不同的遊戲列表 */
  public showGameList: AFP_Game[] = [];
  /** 選擇TAG  0:一般會員, 1:綁卡會員 */
  public selectedType = 0;

  constructor(public appService: AppService, public oauthService: OauthService,
              private router: Router, public modal: ModalService,
              private meta: Meta, private title: Title, private activatedRoute: ActivatedRoute) {
    this.title.setTitle('遊戲 - Mobii!');
    this.meta.updateTag({
      name: 'description',
      content: 'Mobii! - 遊戲。這裡會顯示 Mobii! 用戶在Mobii! 平台上可以玩的遊戲。遊戲通常會含優惠券、商城的特惠商品以及意想不到的大禮驚喜！趕快註冊登入成為會員吧！'
    });
    this.meta.updateTag({ content: '遊戲 - Mobii!', property: 'og:title' });
    this.meta.updateTag({
      content: 'Mobii! - 遊戲。這裡會顯示 Mobii! 用戶在Mobii! 平台上可以玩的遊戲。遊戲通常會含優惠券、商城的特惠商品以及意想不到的大禮驚喜！趕快註冊登入成為會員吧！',
      property: 'og:description'
    });
  }

  ngOnInit() {
    this.appService.openBlock();
    const request: Request_GameIndex = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 4
    };
    this.appService.toApi('Games', '1702', request).subscribe((data: Response_GameIndex) => {
      this.imgTop = data.ADImg_Top;
      this.gameList = data.List_Game;
      this.showGameList = this.gameList.filter(game => game.Game_ConditionType === 0);
    });
  }

  /** 前往遊戲
   * @param gameCode 就是GameCode
   * @param gameType 遊戲類型
   */
  goGame(gameCode: number, gameType: number): void {
    if (this.appService.loginState) {
      this.activatedRoute.snapshot.queryParams.showBack === 'true' ?
        this.router.navigate(['/GameCenter/Game', gameCode], { queryParams: { GameType: gameType, showBack: true } }) : this.router.navigate(['/GameCenter/Game', gameCode], { queryParams: { GameType: gameType } });
    } else {
      this.oauthService.loginPage();
    }
  }


  /** 讀取TAG列表
   * @param tabType 1:一般會員, 2:綁卡會員
   */
  onTabList(tabType: number): void {
    this.selectedType = tabType;
    this.showGameList = this.gameList.filter(game => game.Game_ConditionType === tabType);
  }
}


/** 遊戲首頁 RequestModel */
class Request_GameIndex extends Model_ShareData { }

/** 遊戲首頁 ResponseModel */
interface Response_GameIndex extends Model_ShareData {
  /** 廣告列表 71001 */
  ADImg_Top: AFP_ADImg;
  /** 遊戲 */
  List_Game: AFP_Game[];
}
