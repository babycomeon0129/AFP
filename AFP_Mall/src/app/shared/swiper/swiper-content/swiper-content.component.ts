import { Component, Input, OnInit } from '@angular/core';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-swiper-content',
  templateUrl: './swiper-content.component.html',
  styleUrls: ['./swiper-content.component.scss']
})
export class SwiperContentComponent implements OnInit {
  /** swiper資料來源 */
  @Input() slides: any;
  /** swiper <a> class設定 */
  @Input() aClass: string;
  /** swiper <swiper-slide> class設定 */
  @Input() slideClass: string;
  /** swiper是否顯示左右分頁(true顯示,false隱藏) */
  @Input() pagination: boolean;
  /** swiper是否顯示點點分頁(true顯示,false隱藏) */
  @Input() arrows: boolean;
  /** swiper顯示圖片還是顯示背景圖片(true顯示圖片,false隱藏而顯示背景圖片) */
  @Input() contImg: boolean;
  @Input() contBackground: string;
  /** swiper初始選項 */
  @Input() swiperOption: string ;

  ngOnInit() {
  }

  AfterViewInit() {
  }

}
