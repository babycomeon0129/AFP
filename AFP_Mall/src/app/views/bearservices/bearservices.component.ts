import { Component, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
@Component({
  template: `
  <div class="bearservice-lg">
  <iframe
  src="https://biz.eyesmedia.com.tw/webapp/?q=b5fb1598-57f7-4b4b-974d-c3799526343e&a=d3f53a60-db70-11e9-8a34-2a2ae2dbcce4"
  width="100%" height="100%"></iframe></div>`,
})
export class BearServicesComponent implements AfterViewInit {
  constructor(private appService: AppService) {

  }

  ngAfterViewInit() {

    const windowHight = $(window).height() - 70;
    $('.bearservice-lg').css('height', windowHight);
  }

}
