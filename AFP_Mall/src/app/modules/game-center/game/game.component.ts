import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { Request_Games, Response_Games} from '@app/_models';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  /** 遊戲編碼 */
  private gameCode: number;
  /** 遊戲資料 */
  public gameData: Response_Games;
  /** 遊戲類型（1 刮刮樂, 2 大轉盤） */
  public gameType: number;

  constructor(private route: ActivatedRoute, private router: Router, public appService: AppService
            , private meta: Meta, private title: Title) {
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
      this.gameType = data.AFP_Game.Game_Type;

      // tslint:disable: max-line-length
      this.title.setTitle(data.AFP_Game.Game_ExtName + ' - Mobii!');
      this.meta.updateTag({ name: 'description', content: '' });
      this.meta.updateTag({ content: data.AFP_Game.Game_ExtName + ' - Mobii!', property: 'og:title' });
      this.meta.updateTag({ content: '', property: 'og:description' });
    });
  }

}
