import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-swiper-nav',
  templateUrl: './swiper-nav.component.html',
  styleUrls: ['./swiper-nav.component.scss']
})
export class SwiperNavComponent implements OnInit {
  @Input() slidesNav: string;
  @Input() swiperOptionNav: string;
  @Input() readSheetMode: number;
  @Output() readSheetNav = new EventEmitter<any>();
  constructor() { }

  /** 判斷routerLinkActive 預設0 */
  public idxNav = 0;

  ngOnInit() {
  }
  readSheetParam(Mode:number, Idx:number, Code:number, Id:number){

    // output use
    this.readSheetNav.emit({Mode, Idx, Code, Id});

  }
}
