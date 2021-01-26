import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperNavComponent } from './swiper-nav.component';

describe('SwiperNavComponent', () => {
  let component: SwiperNavComponent;
  let fixture: ComponentFixture<SwiperNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwiperNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwiperNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
