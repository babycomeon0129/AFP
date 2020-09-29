import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberDiscountComponent } from './member-discount.component';

describe('MemberDiscountComponent', () => {
  let component: MemberDiscountComponent;
  let fixture: ComponentFixture<MemberDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
