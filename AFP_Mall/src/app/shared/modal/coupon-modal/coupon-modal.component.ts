import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Request_MemberUserVoucher} from '@app/_models';
import { NgForm } from '@angular/forms';
import { AppService } from '@app/app.service';

@Component({
  selector: 'app-coupon-modal',
  templateUrl: './coupon-modal.component.html'
})
export class CouponModalComponent implements OnInit {

  public requestAddCoupon: Request_MemberUserVoucher = new Request_MemberUserVoucher();
  @Output() couponResult = new EventEmitter<boolean>();

  constructor(public bsModalRef: BsModalRef, public appService: AppService) { }

  ngOnInit() {
  }

  btnOk(form: NgForm): void {
    const request: Request_MemberUserVoucher = {
      SelectMode: 1, // 新增
      Voucher_Code: null, // 優惠券Code
      Voucher_ActivityCode: this.requestAddCoupon.Voucher_ActivityCode, // 優惠代碼
      SearchModel: {
        SelectMode: null
      }
    };
    this.appService.toApi('Member', '1510', request).subscribe(() => {
      this.couponResult.emit(true);
    });
    this.bsModalRef.hide();
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

}
