import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyMobileModalComponent } from './verify-mobile-modal.component';

describe('VerifyMobileModalComponent', () => {
  let component: VerifyMobileModalComponent;
  let fixture: ComponentFixture<VerifyMobileModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyMobileModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyMobileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
