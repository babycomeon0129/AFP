import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperContentComponent } from './swiper-content.component';

describe('SwiperContentComponent', () => {
  let component: SwiperContentComponent;
  let fixture: ComponentFixture<SwiperContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwiperContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwiperContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
