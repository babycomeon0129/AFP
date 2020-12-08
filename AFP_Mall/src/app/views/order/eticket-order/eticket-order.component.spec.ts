import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ETicketOrderComponent } from './eticket-order.component';

describe('ETicketOrderComponent', () => {
  let component: ETicketOrderComponent;
  let fixture: ComponentFixture<ETicketOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ETicketOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ETicketOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
