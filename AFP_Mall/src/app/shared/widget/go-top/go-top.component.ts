
import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-go-top',
  templateUrl: './go-top.component.html',
  styleUrls: ['./go-top.component.scss']
})
export class GoTopComponent implements OnInit {
  /** goTop按鈕顯示與否 */
  public display: boolean;
  constructor() { }

  ngOnInit(): void {
  }

  /** 偵聽Y捲軸是否滑動 */
  @HostListener('window: scroll')
  scrollY(): void {
    this.display = (window.scrollY > 0);
  }

  /** 點擊置頂 */
  goTop(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
