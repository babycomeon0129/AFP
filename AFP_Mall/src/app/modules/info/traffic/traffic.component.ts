import { Component, OnInit } from '@angular/core';
import { AppService } from '@app/app.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-traffic',
  templateUrl: './traffic.component.html',
  styleUrls: ['./traffic.scss']
})
export class TrafficComponent implements OnInit {

  constructor(public appService: AppService, private meta: Meta, private title: Title) {
    this.title.setTitle('交通資訊 - Mobii!');
    this.meta.updateTag({name : 'description', content: 'Mobii! - 交通資訊。不論是想搭火車、高鐵、捷運、輕軌，你都可以透過Mobii! 的交通資訊都為你找到。未來你也可以直接透過Mobii! 訂購各種乘車票券。'});
    this.meta.updateTag({content: '交通資訊 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: 'Mobii! - 交通資訊。不論是想搭火車、高鐵、捷運、輕軌，你都可以透過Mobii! 的交通資訊都為你找到。未來你也可以直接透過Mobii! 訂購各種乘車票券。', property: 'og:description'});
  }

  ngOnInit() {
  }

}
