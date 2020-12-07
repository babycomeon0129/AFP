import { Component, OnInit } from '@angular/core';
import { Model_ShareData, AFP_ADImg, AFP_Game } from '../../_models';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { ModalService } from '../../shared/modal/modal.service';
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
   * @param GameCode 就是GameCode
   * @param GameType 遊戲類型，1:刮刮樂 2:大轉盤
   * @param GamePoint 領取扣除點數
   * @param GameExtName 遊戲外部名稱
   */
  GoGame(GameCode: number, GameType: number, GamePoint: number, GameExtName: string): void {
    if (this.appService.loginState === true) {
      // 如果是刮刮樂，要先跳扣除提醒
      if ( GameType === 1) {
        this.modal.confirm({
          initialState: {
            title: `重要提醒`,
            message: `遊玩「${GameExtName}」需要扣除 Mobii! Points ${GamePoint} 點，請確定是否繼續？`
          }
        }).subscribe( res => {
          if (res) {
            this.router.navigate(['/Game', GameCode], {queryParams: { isApp: this.appService.isApp}});
          }
        });
      } else {
        this.router.navigate(['/Game', GameCode], {queryParams: { isApp: this.appService.isApp}});
      }
    } else {
      this.appService.loginPage();
    }
  }

  ngOnInit() {
  }

}


class Request_GameIndex extends Model_ShareData {}

interface Response_GameIndex extends Model_ShareData {
  ADImg_Top: AFP_ADImg;
  List_Game: AFP_Game[];
}
