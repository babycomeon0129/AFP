import { Component, Input, OnInit } from '@angular/core';
import { AppService } from '@app/app.service';

@Component({
  selector: 'app-swiper-panes',
  templateUrl: './swiper-panes.component.html',
  styleUrls: ['./swiper-panes.component.scss']
})
export class SwiperPanesComponent implements OnInit {

  @Input() slidesPanes: any;
  @Input() swiperOptionPanes: String;
  @Input() swiperStyle: String;
  @Input() readSheetMode: any;


  constructor(public appService: AppService) {
  }

  ngOnInit() {
  }

}
