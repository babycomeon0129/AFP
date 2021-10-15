import { AppService } from '@app/app.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Request_Home, Response_Home } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class EntranceResolver implements Resolve<Response_Home> {

  constructor(public appService: AppService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any> {
    const request: Request_Home = {
      // User_Code: sessionStorage.getItem('userCode'),
      SearchModel: {
        IndexArea_Code: 100001,
        IndexTravel_Code: 21001,
        IndexChannel_Code: 10000001,
        IndexDelivery_Code: 300001
      }
    };
    this.appService.openBlock();
    return this.appService.toApi('Home', '1011', request);
  }
}
