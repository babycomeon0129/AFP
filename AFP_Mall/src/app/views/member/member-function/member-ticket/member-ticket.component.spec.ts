import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberTicketComponent } from './member-ticket.component';

describe('MemberTicketComponent', () => {
  let component: MemberTicketComponent;
  let fixture: ComponentFixture<MemberTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
