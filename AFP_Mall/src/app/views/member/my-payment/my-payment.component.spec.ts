import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPaymentComponent } from './my-payment.component';

describe('MyPaymentComponent', () => {
  let component: MyPaymentComponent;
  let fixture: ComponentFixture<MyPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
