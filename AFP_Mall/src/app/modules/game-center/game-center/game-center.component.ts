import { Component, OnInit } from '@angular/core';
import { Model_ShareData, AFP_ADImg, AFP_Game } from '@app/_models';
import { AppService } from '@app/app.service';
import { Router } from '@angular/router';
import { ModalService } from '@app/shared/modal/modal.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-game-center',
  templateUrl: './game-center.component.html'
})
export class GameCenterComponent implements OnInit {
  /** 置頂圖片(主視覺用途，僅會有一張，無連結) */
  public imgTop: AFP_ADImg;
  /** 遊戲列表 */
  public gameList: AFP_Game[] = [];

  constructor(public appService: AppService, private router: Router, public modal: ModalService, private meta: Meta, private title: Title) {
    this.title.setTitle('遊戲 - Mobii!');
    this.meta.updateTag({name : 'description',
                         content: 'Mobii! - 遊戲。這裡會顯示 Mobii! 用戶在Mobii! 平台上可以玩的遊戲。遊戲通常會含優惠券、商城的特惠商品以及意想不到的大禮驚喜！趕快註冊登入成為會員吧！'});
    this.meta.updateTag({content: '遊戲 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: 'Mobii! - 遊戲。這裡會顯示 Mobii! 用戶在Mobii! 平台上可以玩的遊戲。遊戲通常會含優惠券、商城的特惠商品以及意想不到的大禮驚喜！趕快註冊登入成為會員吧！',
                         property: 'og:description'});
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
    });
  }

  /** 前往遊戲
   * @param gameCode 就是GameCode
   */
  goGame(gameCode: number): void {
    if (this.appService.loginState) {
        this.router.navigate(['/GameCenter/Game', gameCode]);
    } else {
      this.appService.loginPage();
    }

  }

}


/** 遊戲首頁 RequestModel */
class Request_GameIndex extends Model_ShareData {}

/** 遊戲首頁 ResponseModel */
interface Response_GameIndex extends Model_ShareData {
  /** 廣告列表 71001 */
  ADImg_Top: AFP_ADImg;
  /** 遊戲 */
  List_Game: AFP_Game[];
}
