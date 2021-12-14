import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-app-redirect',
  templateUrl: './app-redirect.component.html'
})
export class AppRedirectComponent implements OnInit {

  constructor(private meta: Meta, private title: Title) {
    this.title.setTitle('AppRedirect - Mobii!');
    this.meta.updateTag({name : 'description', content: ''});
    this.meta.updateTag({content: 'AppRedirect - Mobii!', property: 'og:title'});
    this.meta.updateTag({content: '', property: 'og:description'});
  }


  ngOnInit() {

  }

}
