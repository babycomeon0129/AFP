import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
declare var BindingSocialJSInterface: any;

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['../../../../dist/style/member.min.css']
})
export class SettingComponent implements OnInit {

  constructor(public appService: AppService, public route: ActivatedRoute, public location: Location, private router: Router,
              private meta: Meta, private title: Title) {
    // tslint:disable: max-line-length
    this.title.setTitle('帳號設定 - Mobii!');
    this.meta.updateTag({ name: 'description', content: '' });
    this.meta.updateTag({ content: '帳號設定 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: '', property: 'og:description' });
  }

  ngOnInit() {
  }

  /** 前往關於我 */
  goToAbout() {
    window.open('https://mobii.ai/Official/about.html?utm_source=MobiiWeb&utm_medium=Footer', '_self');
  }

  logout() {
    this.appService.onLogout();
    if (this.appService.isApp === null) {
      this.location.back();
    }
  }

  /** 判斷是否為App，如果是則跳到App原生  */
  goIf() {
    if (this.appService.isApp === null) {
      this.router.navigate(['/Member/ThirdBinding']);
    } else {
      if (navigator.userAgent.match(/android/i)) {
        //  Android
        BindingSocialJSInterface.goAppBindingSocialPage();
      } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
        //  IOS
        (window as any).webkit.messageHandlers.AppJSInterface.postMessage({ action: 'goAppBindingSocialPage' });
      }
    }
  }

}
