import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberOrderComponent } from './member-order.component';

describe('MemberOrderComponent', () => {
  let component: MemberOrderComponent;
  let fixture: ComponentFixture<MemberOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
