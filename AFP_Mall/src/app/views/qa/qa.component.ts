import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Meta, Title } from '@angular/platform-browser';
import { layerAnimation } from '../../animations';
declare var AppJSInterface: any;

@Component({
  selector: 'app-qa',
  templateUrl: './qa.component.html',
  styleUrls: ['../../../dist/style/member.min.css'],
  animations: [layerAnimation]
})
export class QAComponent implements OnInit {
  /** 是否從APP登入頁進入 */
  public fromAppLogin: boolean;

  constructor(public appService: AppService, private meta: Meta, private title: Title) {
    // tslint:disable: max-line-length
    this.title.setTitle('常見問題 - Mobii!');
    this.meta.updateTag({name : 'description', content: 'Mobii! - 常見問題。不論是訂單支付、退貨退款、寄件物流、點數 M Points 或優惠券、會員權益等資訊，你都可以在 Mobii! 的常見問題找到答案。'});
    this.meta.updateTag({content: '常見問題 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: 'Mobii! - 常見問題。不論是訂單支付、退貨退款、寄件物流、點數 M Points 或優惠券、會員權益等資訊，你都可以在 Mobii! 的常見問題找到答案。', property: 'og:description'});
  }

  ngOnInit() {
    if (this.appService.isApp !== null && (this.appService.prevUrl === '/' || this.appService.prevUrl === '')) {
      this.fromAppLogin = true;
    } else {
      this.fromAppLogin = false;
    }
  }

  /** 若從APP登入頁進入則按回上一頁時APP把此頁關掉 */
  backIf() {
    if (this.fromAppLogin) {
      if (navigator.userAgent.match(/android/i)) {
        //  Android
        AppJSInterface.back();
      } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
        //  IOS
        (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'back' });
      }
    } else {
      history.back();
    }
  }

}
