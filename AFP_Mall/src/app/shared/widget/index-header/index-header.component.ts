import { Component, Input, OnInit } from '@angular/core';
import { AppService } from '@app/app.service';
import { AFP_ADImg } from '@app/_models';

@Component({
  selector: 'app-index-header',
  templateUrl: './index-header.component.html',
  styleUrls: ['./index-header.component.scss']
})
export class IndexHeaderComponent implements OnInit {
  /** 只在電腦版顯示 */
  @Input() forPc = false;

  constructor(public appService: AppService) { }

  ngOnInit(): void {
  }

}
