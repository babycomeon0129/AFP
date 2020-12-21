import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Request_MemberOrder, Response_MemberOrder, AFP_MemberOrder } from '@app/_models';
import { AppService } from 'src/app/app.service';
import { SwiperOptions } from 'swiper';
import { Router, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-member-order',
  templateUrl: './member-order.component.html',
  styleUrls: ['../../../../../dist/style/member.min.css', '../../../../../dist/style/member-function.min.css']
})
export class MemberOrderComponent implements OnInit, AfterViewInit {
  /** 訂單列表 */
  public orderList: AFP_MemberOrder[] = [];
  /** 訂單狀態（列表＆前往訂單詳細判斷用）：1 處理中, 2 待收貨, 3 已完成, 4 退貨 */
  public selectedState = 1;
  /** 一般訂單 狀態tab swiper */
  public generalTabs: SwiperOptions = {
    // paginationClickable: true,
    slidesPerView: 4.5,
    spaceBetween: 0,
    observer: true,
    observeParents: true,
    freeMode: false
  };
  /** 電子票證訂單 狀態tab swiper */
  public ETicketTabs: SwiperOptions = {
    // paginationClickable: true,
    slidesPerView: 4.5,
    spaceBetween: 0,
    observer: true,
    observeParents: true,
    freeMode: false
  };
  public showBackBtn = false; // APP特例處理

  constructor(public appService: AppService, private router: Router, private route: ActivatedRoute,
              private meta: Meta, private title: Title) {
    // tslint:disable: max-line-length
    this.title.setTitle('我的訂單 - Mobii!');
    this.meta.updateTag({name : 'description', content: 'Mobii! - 我的訂單。這裡會顯示 Mobii! 用戶在 Mobii! 平台上購物的訂單，包括訂單出貨及收貨進度。請先登入註冊以開啟功能。'});
    this.meta.updateTag({content: '我的訂單 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: 'Mobii! - 我的訂單。這裡會顯示 Mobii! 用戶在 Mobii! 平台上購物的訂單，包括訂單出貨及收貨進度。請先登入註冊以開啟功能。', property: 'og:description'});

    // 從會員中心進來則隱藏返回鍵
    if (this.route.snapshot.queryParams.showBack === 'true') {
      this.showBackBtn = true;
    }
  }

  ngOnInit() {
    this.showList(21, 1);
  }

  /** 顯示各狀態訂單列表
   * @param type 訂單類型（1: 一般訂單 21: 電子票證）
   * @param state 訂單狀態（一般訂單 1:處理中, 2: 待收貨, 3: 已完成；電子票證 1: 已付款 2: 已出貨 3: 已到貨 4: 退換貨）
   */
  showList(type: number, state: number) {
    this.selectedState = state;
    const request: Request_MemberOrder = {
      User_Code: sessionStorage.getItem('userCode'),
      SelectMode: 1, // 列表查詢
      SearchModel: {
        OrderType: type,
        OrderState: state
      }
    };

    this.appService.toApi('Member', '1512', request).subscribe((data: Response_MemberOrder) => {
      this.orderList = data.List_MemberOrder;
    });
  }

  /** 顯示寄送方式
   * @param code 寄送方式代碼（0: 喜鴻, 1: 寄送, 2: 自取）
   * @returns 寄送方式文字
   */
  deliveryWay(code: number): string {
    switch (code) {
      case 0:
        return '喜鴻';
      case 1:
        return '寄送';
      case 2:
        return '自取';
    }
  }

  /** 前往訂單詳細
   * @param type 訂單類型（1: 一般訂單 21: 電子票證）
   * @param order 該訂單
   */
  goToDetail(type: number, order: AFP_MemberOrder) {
    if (this.selectedState === 4) {
      this.router.navigate(['/Return/ReturnDetail', order.ServiceTableNo]);
    } else {
      switch (type) {
        case 1:
          this.router.navigate(['/MemberFunction/MyOrderDetail', order.Order_TableNo], {queryParams: {orderState: this.selectedState}});
          break;
        case 21:
          this.router.navigate(['/MemberFunction/ETicketOrderDetail', order.Order_TableNo], {queryParams: {orderState: this.selectedState}});
          break;
      }
    }
  }

  ngAfterViewInit() {
    // slidesPerView:x.5時,可視定位
    $( '.ordershop-swiper .nav-tabSub li:first-child' ).on('click', function() { $(this).parent('.nav-tabSub').css('transform', 'translate3d(0px, 0px, 0px)'); });
    // $( '.ordershop-swiper .nav-tabSub li:last-child' ).on('click', function() { $(this).parent('.nav-tabSub').css('transform', 'translate(-15%, 0)' ); });
  }

}
