import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AFP_UserReport, Model_ShareData } from '../../../_models';

@Component({
  selector: 'app-delivery-info',
  templateUrl: './delivery-info.component.html',
  styleUrls: ['../../../../dist/style/member.min.css']
})

export class DeliveryInfoComponent implements OnInit {

  /** 商家詳細編碼 */
  public siteCode: number;
  /** 外送表單資訊 */
  public deliveryForm: AFP_DeliveryForm = new AFP_DeliveryForm();
  /** 城市列表 */
  public cityList: AFP_UserReport[] = [];
  /** 行政區列表 */
  public districtList: AFP_UserReport[] = [];
  /** 偵測行政區是否被點擊 */
  public deliveryClick = false;
  /** 我同意checkbox核取狀態 */
  public agreeCheck = false;


  constructor(public appService: AppService, private route: ActivatedRoute, private meta: Meta, private title: Title) {
    this.title.setTitle('填寫外送資訊 - Mobii!');
    this.meta.updateTag({ name: 'description', content: '' });
    this.meta.updateTag({ content: '填寫外送資訊 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: '', property: 'og:description' });
  }

  ngOnInit() {
    // 取得商家/景點編碼
    this.siteCode = Number(this.route.snapshot.params.ECStore_Code);
    this.getDeliveryCfm();
  }

  /** 偵測行政區是否被點擊 */
  districtCheck(click: boolean): void {
    this.deliveryClick = click;
  }

  /** 抓取用戶資料 */
  getDeliveryCfm(): void {
    this.appService.openBlock();
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
      // 如果從來沒使用過外送功能，預設初始城市為臺北市，RecCityKey為1
      this.deliveryForm.RecCityKey = this.deliveryForm.RecCityKey !== 0 ? this.deliveryForm.RecCityKey : 1;
      this.cityList = data.List_UserReport.filter(city => city.UserReport_CategoryCode === 21);
      this.districtList = data.List_UserReport.filter(district => district.UserReport_CategoryCode === 22);
      this.deliveryForm.RecCityValue = data.List_UserReport
                                       .filter(city => city.UserReport_CategoryCode === 21
                                                    && city.UserReport_ItemCode === this.deliveryForm.RecCityKey)[0].UserReport_ItemName;
      if ( this.deliveryForm.RecCityAreaValue !== null) {
        this.deliveryForm.RecCityAreaValue = data.List_UserReport
                                           .filter( area => area.UserReport_CategoryCode === 22
                                                 && area.UserReport_ItemCode === this.deliveryForm.RecCityAreaKey)[0].UserReport_ItemName;
      }
    });
  }

  /** 城市確認
   * @param city 城市名稱
   * @param citykey 城市key
   */
  cityCheck(city: string, citykey: number): void {
    this.deliveryForm.RecCityKey = citykey;
    this.deliveryForm.RecCityValue = city;
    // 防用戶點了城市又不點行政區，造成行政區還在帶上一次的行政區資料
    this.deliveryForm.RecCityAreaValue = null;
  }

  /** 行政區確認
   * @param city 行政區名稱
   * @param citykey 行政區key
   */
  cityAreaCheck(area: string, areakey: number): void {
    this.deliveryForm.RecCityAreaValue = area;
    this.deliveryForm.RecCityAreaKey = areakey;
  }


  /** 表單送出 */
  deliverySubmit(form: NgForm): void {
    this.appService.openBlock();
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
      window.location.href = data.SendURL.length > 0 ? data.SendURL : null;
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
  RecID: number;
  RecName: string;
  RecEmail: string;
  RecMobile: string;
  RecCityKey: number;
  RecCityAreaKey: number;
  RecCityValue: string;
  RecCityAreaValue: string;
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
