import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperIconComponent } from './swiper-icon.component';

describe('SwiperIconComponent', () => {
  let component: SwiperIconComponent;
  let fixture: ComponentFixture<SwiperIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwiperIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwiperIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
