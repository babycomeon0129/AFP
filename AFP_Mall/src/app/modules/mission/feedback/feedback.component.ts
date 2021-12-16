import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  /** 星星陣列 */
  public star = [];
  /** 滑鼠移到的星星顆數值 */
  public starHover: number;
  /** 選擇的星星數值 */
  public starSelect: number;

  constructor() {
  }

  ngOnInit() {
    this.star = Array(5).fill(5, 1, 5).map((x, i) => i);
  }

  /** 星星滑鼠移過動畫及選取
   * @param starIndex 星星索引(-1未選取)
   * @param event 滑鼠事件
   */
  selectStar(starIndex: number, event: string) {
    // 滑鼠移過星星時
    this.starHover = starIndex;
    // 滑鼠完全移開星星時
    if (event === 'mouseout' && starIndex === 0) {
      this.starHover = -1;
    }
    // 選取星星數值
    if (event === 'click' && starIndex > -1) {
      if (this.starSelect !== starIndex) {
        this.starSelect = starIndex;
      } else {
        // 釋放選取星星數值
        this.starSelect = -1;
        this.starHover = -1;
      }
    }
  }
}
