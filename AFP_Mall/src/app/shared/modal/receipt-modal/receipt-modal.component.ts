import { Component, OnInit } from '@angular/core';
import { AFP_MemberOrder, AFP_ItemInfoPart } from '@app/_models';
import { BsModalRef } from 'ngx-bootstrap/modal';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AppService } from '@app/app.service';


@Component({
  selector: 'app-receipt-modal',
  templateUrl: './receipt-modal.component.html',
  styleUrls: ['./receipt-modal.scss']
})
export class ReceiptModalComponent implements OnInit {
  /** 訂單及收據資訊 */
  public orderData: AFP_MemberOrder;
  /** 訂單商品資訊 */
  public prodList: AFP_ItemInfoPart[] = [];
  /** 購買民國年 */
  public insertYear: number;

  constructor(public bsModalRef: BsModalRef, public appService: AppService) {
  }

  ngOnInit() {
    this.insertYear = new Date(this.orderData.Order_InsertDate).getFullYear() - 1911;
  }

  /** 下載收據圖檔 */
  download(): void {
    const pdfContent = window.document.getElementById('rbox');
    const cw = pdfContent.getBoundingClientRect().width * 2;
    const cy = pdfContent.getBoundingClientRect().height * 1.85;
    html2canvas(pdfContent, {
      allowTaint: true,
      useCORS: true,
      scale: 1,
      width: cw,
      height: cy,
      scrollY: 0,
    }).then(canvas => {
      const w = canvas.width;
      const h = canvas.height;
      const imgData = canvas.toDataURL('image/PNG');
      /** Jenkins建構失敗處理
       * 原寫法const doc = new jsPDF('', 'pt', [595, 841]);
       */
      const doc = new jsPDF('p', 'mm', 'a4');
      const contentWidth = doc.internal.pageSize.getWidth();
      const contentHeight = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, 'PNG', 0, 0, contentWidth, contentHeight);
      doc.save('receipt.pdf');
    });
  }

}
