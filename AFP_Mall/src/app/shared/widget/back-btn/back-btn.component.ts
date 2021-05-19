import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '@app/app.service';

@Component({
  selector: 'app-back-btn',
  templateUrl: './back-btn.component.html',
  styleUrls: ['./back-btn.component.scss']
})
export class BackBtnComponent implements OnInit {
  //此元件為：如返回鍵需根據App需求切換顯示/不顯示而客製化的按鈕功能元件。

  /** 返回鍵樣式，1: < 字型  2: 有透明灰圓圈底的 < 返回鍵 */
  @Input() iconStyle = 1;
  /** 基本的回上一頁功能  true:需要  false: 客製化回上一頁功能 */
  @Input() needGoBack = true;
  /** 返回鍵客製化時使用。 預設為首頁 */
  @Input() url = '/';


  constructor(private location: Location, public appService: AppService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.appService.showBack = params.showBack === 'true';
    })
  }

  /** 點擊返回鍵 */
  gotoBack(): void {
    // 先判斷返回鍵是否只需要基本功能
    if (this.needGoBack) {
      this.location.back();
    } else {
      // 先判斷是否為結帳完成的狀態 (由網址是否帶referrer判定)
      if (this.route.snapshot.queryParams.referrer === 'OrderComplete') {
        this.router.navigate([this.url]);
      } else {
        this.location.back();
      }
    }
  }

}
