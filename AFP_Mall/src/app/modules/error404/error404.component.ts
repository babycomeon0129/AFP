import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.css']
})
export class Error404Component implements OnInit {

  constructor(private meta: Meta, private title: Title) {
    this.title.setTitle('找不到頁面 - Mobii!');
    this.meta.updateTag({ name: 'description', content: '您造訪的頁面已迷失在Mobii!星球中...' });
    this.meta.updateTag({ content: '找不到頁面 - Mobii!', property: 'og:title' });
    this.meta.updateTag({ content: '您造訪的頁面已迷失在Mobii!星球中...', property: 'og:description' });
  }

  ngOnInit() {
  }

}
