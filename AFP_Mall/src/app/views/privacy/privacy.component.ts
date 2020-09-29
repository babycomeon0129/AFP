import { Component, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  templateUrl: './privacy.component.html',
})
export class PrivacyComponent implements AfterViewInit {

  constructor(public appservice: AppService, private meta: Meta, private title: Title) {
    // tslint:disable: max-line-length
    this.title.setTitle('隱私權政策 - Mobii!');
    this.meta.updateTag({name : 'description', content: 'Mobii! - 隱私權政策。此隱私權政策描述了 Mobii! 平台如何搜集您的個人資料，以及這些資料將如何被處理及利用。建議您在使用Mobii! 網站、服務及與平台進行交易前，先仔細閱讀此隱私權政策及使用者條款。'});
    this.meta.updateTag({content: '隱私權政策 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: 'Mobii! - 隱私權政策。此隱私權政策描述了 Mobii! 平台如何搜集您的個人資料，以及這些資料將如何被處理及利用。建議您在使用Mobii! 網站、服務及與平台進行交易前，先仔細閱讀此隱私權政策及使用者條款。', property: 'og:description'});
  }

  ngAfterViewInit() {
  }

}
