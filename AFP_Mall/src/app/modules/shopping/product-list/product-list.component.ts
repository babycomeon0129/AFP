import { Component, OnInit } from '@angular/core';
import { AppService } from '@app/app.service';
import { AFP_Product, AFP_UserDefine, Request_ECProductList, Response_ECProductList, AFP_Attribute,
  AFP_AttributeValue } from '@app/_models';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Meta, Title } from '@angular/platform-browser';
import { layerAnimation} from '@app/animations';
import { OauthService } from '@app/modules/oauth/oauth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.scss'],
  animations: [ layerAnimation ]
})
export class ProductListComponent implements OnInit {
  /** 購物車編碼 */
  public cartCode: number;
  /** 購物車商品數 */
  public cartCount: number;
  /** 上層（第一層）目錄名稱 */
  public upDirName: string;
  /** 當前目錄編碼 */
  public dirCode: number;
  /** 當前目錄名稱 */
  public dirName: string;
  /** 所有第二層目錄列表 */
  public dirList: AFP_UserDefine[] = [];
  /** 當前目錄下所有規格及規格值 */
  public dirAttrList: AFP_Attribute[] = [];
  /** 當前目錄產品列表 */
  public dirProductList: AFP_Product[] = [];
  /** 排序方式：1 最新上架優先，2 熱門程度優先，3 價格低->高，4 價格高->低 */
  public sorting = 1;
  /** 所選規格值字串陣列（call API使用，同一個規格下的規格值組為字串，以逗號區隔） */
  private attrValueStrList: string[] = [];
  /** 規格值顯示容器（點選規格後顯示其下規格值） */
  public attrValuesList: AFP_AttributeValue[] = [];
  /** 所選規格與規格值Map */
  public attrValueMap: Map<number, Map<number, string>> = new Map();
  /** 目錄篩選開啟狀態 */
  public showDirMenu = false;
  /** 同頁滑動切換 0:本頁 1:篩選清單 2: 商品分類 */
  public layerTrig = 0;

  constructor(public appService: AppService, private route: ActivatedRoute, private cookieService: CookieService,
              private oauthService: OauthService, private meta: Meta, private title: Title) {
    this.cartCode = Number(this.oauthService.cookiesGet('cart_code').c);
    this.cartCount = Number(this.oauthService.cookiesGet('cart_count_Mobii').c);
    this.dirCode = Number(this.route.snapshot.params.ProductDir_Code);
  }

  ngOnInit() {
    this.readProducts();
  }

  /** 讀取產品 */
  readProducts() {
    this.appService.openBlock();
    const request: Request_ECProductList = {
      Cart_Count: this.cartCount,
      SearchModel: {
        Cart_Code: this.cartCode,
        UserDefine_Code: this.dirCode,
        AttributeValue_Code: this.attrValueStrList,
        Sort_Mode: this.sorting
      }
    };

    this.appService.toApi('EC', '1202', request).subscribe((data: Response_ECProductList) => {
      this.upDirName = data.UpUserDefineName;
      this.dirList = data.List_UserDefine;
      this.dirProductList = data.List_Product;
      this.dirAttrList = data.List_Attribute;
      // 更新當前目錄名稱
      for (const dir of this.dirList) {
        if (dir.UserDefine_Code === this.dirCode) {
          this.dirName = dir.UserDefine_Name;
        }
      }

      this.title.setTitle(this.dirName + '｜線上商城 - Mobii!');
      this.meta.updateTag({name : 'description', content: ''});
      this.meta.updateTag({content: this.dirName + '｜線上商城 - Mobii!', property: 'og:title'});
      this.meta.updateTag({content: '', property: 'og:description'});
    });
  }

  /** 目錄篩選開關 */
  dirMenuToggle() {
    this.showDirMenu = !this.showDirMenu;
  }

  /** 目錄篩選
   * @param code 目錄編碼
   */
  dirFilter(code: number) {
    this.dirCode = code;
    this.attrValueMap.clear();
    this.sorting = 1;
    this.readProducts();
    this.showDirMenu = false;
  }

  /** 顯示所選規格的規格值
   * @param code 規格編碼
   */
  showAttrValues(code: number) {
    for (const item of this.dirAttrList) {
      if (item.Attribute_Code === code) {
        this.attrValuesList = item.List_AttributeValue;
      }
    }
    this.layerTrig = 2;
  }

  /** 選取規格值
   * @param value 所點選規格值object
   */
  toggleAttrValue(value: AFP_AttributeValue) {
    // 檢查規格是否已存在
    if (this.attrValueMap.has(value.AttributeValue_Code)) {
      // 規格已存在，檢查規格值是否存在規格中
      const attrMap = this.attrValueMap.get(value.AttributeValue_Code);
      if (attrMap.has(value.AttributeValue_AttributeCode)) {
        // 規格值已存在，則移除（若移除後規格下已無規格值則移除規格）
        attrMap.delete(value.AttributeValue_AttributeCode);
        if (attrMap.size === 0) {
          this.attrValueMap.delete(value.AttributeValue_Code);
        }
      } else {
        // 規格值不存在，則加入
        attrMap.set(value.AttributeValue_AttributeCode, value.AttributeValue_ShowName);
      }
    } else {
      // 規格不存在，則加入規格+規格值
      const attrV: Map<number, string> = new Map();
      attrV.set(value.AttributeValue_AttributeCode, value.AttributeValue_ShowName);
      this.attrValueMap.set(value.AttributeValue_Code, attrV);
    }
  }

  /** 所選規格值顯示
   * @param attr 規格
   * @returns 所選規格值字串
   */
  attrText(attr: AFP_Attribute): string {
    if (this.attrValueMap.has(attr.Attribute_Code)) {
      let text = '';
      for (const x of this.attrValueMap.get(attr.Attribute_Code).values()) {
        text = text + ',' + x;
      }
      return text.substring(1, text.length);
    } else {
      return '全部顯示';
    }
  }

  /** 選擇排序
   * @param sortCode 排序方式代碼
   */
  onSelectSort(sortCode: number) {
    this.sorting = sortCode;
  }

  /** 篩選：規格值與排序 */
  filter() {
    this.attrValueMap.forEach(attr => {
      let attrVStr = '';
      for (const vKey of attr.keys()) {
        attrVStr = attrVStr + ',' + vKey;
      }
      attrVStr = attrVStr.substring(1, attrVStr.length);
      this.attrValueStrList.push(attrVStr);
    });
    this.readProducts();
    this.layerTrig = 0;
    this.attrValueStrList = [];
  }

  /** 全部重設（規格及規格值Map、規格值字串、排序） */
  resetAll() {
    this.attrValueMap.clear();
    this.attrValueStrList = [];
    this.sorting = 1;
    this.readProducts();
    this.layerTrig = 0;
  }

}
