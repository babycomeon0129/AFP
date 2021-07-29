import { Component, Input, OnInit } from '@angular/core';
import { AppService } from '@app/app.service';

@Component({
  selector: 'app-swiper-panes',
  templateUrl: './swiper-panes.component.html',
  styleUrls: ['./swiper-panes.component.scss']
})
export class SwiperPanesComponent implements OnInit {
  /** Input 參數說明
   * swiperOptionPanes: swiper Option設定
   * slidesPanes: 資料源
   * template: 樣版
   * readSheetMode: 點擊模式
   */
  @Input() slidesPanes: any;
  @Input() swiperOptionPanes: string;
  @Input() template: string;
  @Input() pagination: boolean;
  @Input() arrows: boolean;
  @Input() readSheetMode: any;


  constructor(public appService: AppService) {
  }

  ngOnInit() {
  }

}
