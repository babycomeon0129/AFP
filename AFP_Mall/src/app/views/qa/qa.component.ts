import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Meta, Title } from '@angular/platform-browser';
import { layerAnimation } from '../../animations';

@Component({
  selector: 'app-qa',
  templateUrl: './qa.component.html',
  styleUrls: ['../../../dist/style/member.min.css'],
  animations: [layerAnimation]
})
export class QAComponent implements OnInit {
  /** 顯示區塊 */
  public shownSection: number;

  constructor(public appService: AppService, private meta: Meta, private title: Title) {
    // tslint:disable: max-line-length
    this.title.setTitle('常見問題 - Mobii!');
    this.meta.updateTag({name : 'description', content: 'Mobii! - 常見問題。不論是訂單支付、退貨退款、寄件物流、點數 M Points 或優惠券、會員權益等資訊，你都可以在 Mobii! 的常見問題找到答案。'});
    this.meta.updateTag({content: '常見問題 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: 'Mobii! - 常見問題。不論是訂單支付、退貨退款、寄件物流、點數 M Points 或優惠券、會員權益等資訊，你都可以在 Mobii! 的常見問題找到答案。', property: 'og:description'});
  }

  ngOnInit() {
  }

}
