import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppGoPaymentComponent } from './app-go-payment.component';

describe('AppGoPaymentComponent', () => {
  let component: AppGoPaymentComponent;
  let fixture: ComponentFixture<AppGoPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppGoPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppGoPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
