import { Component, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  templateUrl: './terms.component.html'
})
export class TermsComponent implements AfterViewInit {

  constructor(public appservice: AppService, private meta: Meta, private title: Title) {
    // tslint:disable: max-line-length
    this.title.setTitle('使用者規範 - Mobii!');
    this.meta.updateTag({name : 'description', content: 'Mobii! - 使用者規範。此處記載著 Mobii! 平台使用者條款，為使用者與 Mobii! 平台之間如註冊 Mobii! 帳號及使用 Mobii! 的各項服務等相關事宜所訂立的協定，在使用本平台與服務前應仔細閱讀並遵守本條款的全部內容。'});
    this.meta.updateTag({content: '使用者規範 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: 'Mobii! - 使用者規範。此處記載著 Mobii! 平台使用者條款，為使用者與 Mobii! 平台之間如註冊 Mobii! 帳號及使用 Mobii! 的各項服務等相關事宜所訂立的協定，在使用本平台與服務前應仔細閱讀並遵守本條款的全部內容。', property: 'og:description'});
  }

  ngAfterViewInit() {
  }

}
