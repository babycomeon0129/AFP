import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ETicketDetailComponent } from './eticket-detail.component';

describe('ETicketDetailComponent', () => {
  let component: ETicketDetailComponent;
  let fixture: ComponentFixture<ETicketDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ETicketDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ETicketDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
