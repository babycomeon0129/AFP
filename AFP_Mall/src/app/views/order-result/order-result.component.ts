import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';


@Component({
  selector: 'app-order-result',
  templateUrl: './order-result.component.html',
  styleUrls: ['../../../dist/style/shopping-index.min.css']
})
export class OrderResultComponent implements OnInit {

  /** 結果 */
  public Result = '';

  constructor(private route: ActivatedRoute, public appService: AppService, private router: Router) {
    this.route.queryParams.subscribe(params => {

      if (typeof params.ModelData !== 'undefined') {
        this.Result = params.ModelData;
      }
    });

  }

  GoECIndex(): void {
    location.href = '/Shopping';
  }

  ngOnInit() {
  }

}

