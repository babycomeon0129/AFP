import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-verify-mobile-modal',
  templateUrl: './verify-mobile-modal.component.html',
  styleUrls: ['./verify-mobile-modal.component.css']
})
export class VerifyMobileModalComponent implements OnInit {
  /** 是否強制手機驗證 */
  public forceVerify = false;

  constructor(public bsModalRef: BsModalRef, private router: Router, private cookieService: CookieService) { }

  ngOnInit() {
  }

  closeModal(): void {
    sessionStorage.clear();
    this.cookieService.deleteAll('/', environment.cookieDomain, environment.cookieSecure, 'Lax');
    this.bsModalRef.hide();
    this.router.navigate(['/']);
  }

}
