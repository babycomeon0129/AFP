import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { AFP_MemberOrder, Model_ShareData } from '../../_models';
import { CookieService } from 'ngx-cookie-service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-order-complete',
  templateUrl: './order-complete.component.html',
  styleUrls: ['../../../dist/style/shopping-index.min.css']
})
export class OrderCompleteComponent implements OnInit {

  /** 金流訂單號 */
  public PayOrderNo = 0;
  /** 綁卡資訊 */
  public BindData = '';
  public countdown;
  public MainHidden = true;

  /** 回傳結果 */
  public ResponseModel: Response_OrderComplete = new Response_OrderComplete();
  constructor(private route: ActivatedRoute, public appService: AppService, private router: Router, private cookieService: CookieService,
              private meta: Meta, private title: Title) {
                // tslint:disable: max-line-length
    this.title.setTitle('付款成功｜線上商城 - Mobii!');
    this.meta.updateTag({name : 'description', content: ''});
    this.meta.updateTag({content: '付款成功｜線上商城 - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: '', property: 'og:description'});

    this.appService.isApp = 1;
    this.route.queryParams.subscribe(params => {
      if (typeof params.PayOrderNo !== 'undefined') {
        this.PayOrderNo = Number(params.PayOrderNo);
      }

      if (typeof params.ModelData !== 'undefined') {
        this.BindData = params.ModelData;
      }
    });

    const request: Request_OrderComplete = {
      User_Code: sessionStorage.getItem('userCode'),
      PayOrderNo: this.PayOrderNo,
      ModelData: this.BindData
    };

    this.appService.openBlock();
    this.appService.toApi('Member', '1604', request).subscribe((data: Response_OrderComplete) => {
      this.ResponseModel = data;
      if (data.IsApp === 0) {
        this.appService.isApp = null;
      }
      this.MainHidden = false;
    });

    //  例外狀況處理
    this.countdown = setTimeout(() => {
      this.MainHidden = false;
    }, 3000);
  }

  GoECIndex(): void {
    if (this.appService.isApp != null) {
      location.href = '/Shopping';
    } else {
      this.router.navigate(['/Shopping']);
    }
  }

  ngOnInit() {
  }

}

export class Request_OrderComplete extends Model_ShareData {
  public PayOrderNo?: number;
  public ModelData?: string;
}

export class Response_OrderComplete extends Model_ShareData {
  constructor() {
    super();
    this.Success = false;
    this.ErrorMsg = '訂單結果取得失敗，請洽客服人員';
  }
  public Success: boolean;
  public ErrorMsg: string;
  public IsApp: number;
}
