import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperPanesComponent } from './swiper-panes.component';

describe('SwiperPanesComponent', () => {
  let component: SwiperPanesComponent;
  let fixture: ComponentFixture<SwiperPanesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwiperPanesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwiperPanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
