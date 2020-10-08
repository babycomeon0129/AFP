import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-app-login-success',
  templateUrl: './app-login-success.component.html',
})
export class AppLoginSuccessComponent implements OnInit {

  constructor(private meta: Meta, private title: Title) {
    // tslint:disable: max-line-length
    this.title.setTitle('AppLoginSuccess - Mobii!');
    this.meta.updateTag({name : 'description', content: ''});
    this.meta.updateTag({content: 'AppLoginSuccess - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: '', property: 'og:description'});

    if (sessionStorage.getItem('CustomerInfo')) {
      localStorage.setItem('userName', sessionStorage.getItem('userName'));
      localStorage.setItem('userCode', sessionStorage.getItem('userCode'));
      localStorage.setItem('CustomerInfo', sessionStorage.getItem('CustomerInfo'));
      localStorage.setItem('UUID', sessionStorage.getItem('UUID'));
    }
  }

  ngOnInit() {

  }

}
