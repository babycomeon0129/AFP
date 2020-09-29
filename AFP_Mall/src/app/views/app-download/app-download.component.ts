import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-app-download',
  templateUrl: './app-download.component.html'
})
export class AppDownloadComponent implements OnInit {

  /** 連結 */
  public UrlLink = 'https://play.google.com/store/apps/details?id=com.eyesmedia.afp';

  /** 裝置類型 1 安卓 2 ios */
  public DeviceType = 1;
  constructor(public appService: AppService) {
    this.appService.isApp = 1;
    this.Show();
  }

  Show(): void {
    if (navigator.userAgent.match(/android/i)) {
      //  Android
      this.DeviceType = 1;
      this.UrlLink = 'https://play.google.com/store/apps/details?id=com.eyesmedia.afp';
      this.GoDownload();
    } else if (navigator.userAgent.match(/(iphone|ipad|ipod);?/i)) {
      //  IOS
      this.DeviceType = 2;
      this.UrlLink = 'https://itunes.apple.com/app/id1512321552';
      this.GoDownload();
    }
  }

  GoDownload(): void {
    location.href = this.UrlLink;
  }

  ngOnInit() {
  }

}
