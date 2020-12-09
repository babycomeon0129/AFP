import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ETicketOrderDetailComponent } from './eticket-order-detail.component';

describe('ETicketOrderDetailComponent', () => {
  let component: ETicketOrderDetailComponent;
  let fixture: ComponentFixture<ETicketOrderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ETicketOrderDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ETicketOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
