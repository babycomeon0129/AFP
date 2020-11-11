import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AFP_UserReport, Model_ShareData } from '../../_models';

@Component({
  selector: 'app-delivery-info',
  templateUrl: './delivery-info.component.html',
  styleUrls: ['../../../dist/style/member.min.css']
})

export class DeliveryInfoComponent implements OnInit {

  /** 商家詳細編碼 */
  public siteCode: number;
  /** 外送表單資訊 */
  public deliveryForm: AFP_DeliveryForm = new AFP_DeliveryForm();
  /** 地區列表 */
  public areaList: AFP_UserReport[] = [];
  /** 城市列表 */
  public cityList: AFP_UserReport[] = [];
  /** 行政區列表 */
  public districtList: AFP_UserReport[] = [];
  /** 外送表單的城市 */
  public deliveryCity: string;
  /** 外送表單的行政區 */
  public deliveryDistrict: string;
  /** 外送表單的詳細地址 */
  public deliveryAdd: string;
  /** 跳轉至外部商店連結 */
  public sendUrl: string;
  /** 抓取對應行政區用 */
  public districtSelect: number;
  /** 偵測行政區是否被點擊 */
  public deliveryClick: boolean;


  constructor(public appService: AppService, private route: ActivatedRoute, private meta: Meta, private title: Title) {
    this.title.setTitle('填寫外送資訊 - Mobii!');
    this.meta.updateTag({ name: 'description', content: '' });
    this.meta.updateTag({ content: '填寫外送資訊 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: '', property: 'og:description' });
  }

  ngOnInit() {
    // 取得商家/景點編碼
    this.siteCode = Number(this.route.snapshot.params.ECStore_Code);
    // 初始預設城市為臺北市
    this.deliveryCity = '臺北市';
    // 抓取對應行政區用，預設臺北市的行政區(1)
    this.districtSelect = 1;
    this.deliveryClick = false;
    this.getDeliveryCfm();
  }

  /** 偵測行政區是否被點擊 */
  districtCheck(click: boolean): void {
    this.deliveryClick = click;
  }

  /** 抓取用戶資料 */
  getDeliveryCfm(): void {
    const request: Request_DeliveryCfm = {
      SelectMode: 1,
      User_Code: sessionStorage.getItem('userCode'),
      Model_DeliveryForm: null,
      SearchModel: {
        ECStore_Code: this.siteCode
      }
    };

    this.appService.toApi('Area', '1404', request).subscribe((data: Response_DeliveryCfm) => {
      this.deliveryForm = data.Model_DeliveryForm;
      this.cityList = data.List_UserReport.filter(city => city.UserReport_CategoryCode === 21);
      this.districtList = data.List_UserReport.filter(district => district.UserReport_CategoryCode === 22);
      console.log(data);
    });
  }

  /** 地址組合(城市+行政區+詳細地址) */
  CombineAddress(): string {
    let addstr: string;
    addstr = `${this.deliveryCity}${this.deliveryDistrict}${this.deliveryAdd}`;
    return addstr;
  }

  /** 表單送出 */
  deliverySubmit(form: NgForm): void {
    this.deliveryForm.RecAddress = this.CombineAddress();
    const request: Request_DeliveryCfm = {
      SelectMode: 2,
      User_Code: sessionStorage.getItem('userCode'),
      Model_DeliveryForm: this.deliveryForm,
      SearchModel: {
        ECStore_Code: this.siteCode
      }
    };
    // 送外送表單資訊到server，索取跳轉至外送商家的Url
    this.appService.toApi('Area', '1404', request).subscribe((data: Response_DeliveryCfm) => {
      this.sendUrl = data.SendURL;
      window.location.href = this.sendUrl.length > 0 ? this.sendUrl : null;
    });
  }

}

/** 外送單MODEL */
class Request_DeliveryCfm extends Model_ShareData {
  SelectMode: number;
  Model_DeliveryForm: AFP_DeliveryForm;
  SearchModel: Search_DeliveryCfm;
}

class AFP_DeliveryForm {
  RecName: string;
  RecEmail: string;
  RecMobile: string;
  RecAddress: string;
}

interface Search_DeliveryCfm {
  ECStore_Code: number;
}

class Response_DeliveryCfm extends Model_ShareData {
  Model_DeliveryForm: AFP_DeliveryForm;
  List_UserReport: AFP_UserReport[];
  SendURL: string;
}

