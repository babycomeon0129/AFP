import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-app-redirect',
  templateUrl: './app-redirect.component.html'
})
export class AppRedirectComponent implements OnInit {

  constructor(private meta: Meta, private title: Title) {
    // tslint:disable: max-line-length
    this.title.setTitle('AppRedirect - Mobii!');
    this.meta.updateTag({name : 'description', content: ''});
    this.meta.updateTag({content: 'AppRedirect - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: '', property: 'og:description'});

    // function AppRouter(userName: string, userCode: string, CustomerInfo: string, url: string) {
    //   alert('userName :' + userName + ',userCode :' + userCode + ',CustomerInfo :' + CustomerInfo + ',url :' + url);
    //   sessionStorage.setItem('userName', userName);
    //   sessionStorage.setItem('userCode', userCode);
    //   sessionStorage.setItem('CustomerInfo', CustomerInfo);
    //   this.router.navigate([url]);
    // }
  }

  // AppRouter(userName: string, userCode: string, CustomerInfo: string, url: string): void {
  //   alert('userName :' + userName + ',userCode :' + userCode + ',CustomerInfo :' + CustomerInfo + ',url :' + url);
  //   sessionStorage.setItem('userName', userName);
  //   sessionStorage.setItem('userCode', userCode);
  //   sessionStorage.setItem('CustomerInfo', CustomerInfo);
  //   this.router.navigate([url]);
  // }

  ngOnInit() {

  }

}
