import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberCoinComponent } from './member-coin.component';

describe('MemberCoinComponent', () => {
  let component: MemberCoinComponent;
  let fixture: ComponentFixture<MemberCoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberCoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberCoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
