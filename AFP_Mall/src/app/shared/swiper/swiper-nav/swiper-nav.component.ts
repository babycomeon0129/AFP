import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-swiper-nav',
  templateUrl: './swiper-nav.component.html',
  styleUrls: ['./swiper-nav.component.scss']
})
export class SwiperNavComponent implements OnInit {
  /** Input 參數說明
   * swiperOptionNav: swiper Option設定
   * slidesNav: 資料源
   * template: 樣版
   * readSheetMode: 點擊模式
   * readSheetNav: 點擊參數
   */
  @Input() slidesNav: string;
  @Input() swiperOptionNav: string;
  @Input() template: string;
  @Input() readSheetMode: number;
  @Output() readSheetNav = new EventEmitter<any>();
  constructor() { }

  /** 判斷routerLinkActive 預設0 */
  public idxNav = 0;

  ngOnInit() {
    if (this.template === undefined) { this.template = ''; }
  }
  readSheetParam(Mode: number, Idx: number, Code: number, Id: number) {

    // output use
    this.readSheetNav.emit({Mode, Idx, Code, Id});

  }
}
