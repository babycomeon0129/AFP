import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingPaymentComponent } from './shopping-payment.component';

describe('ShoppingPaymentComponent', () => {
  let component: ShoppingPaymentComponent;
  let fixture: ComponentFixture<ShoppingPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
