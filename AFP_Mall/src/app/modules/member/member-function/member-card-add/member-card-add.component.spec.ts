import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberCardAddComponent } from './member-card-add.component';

describe('MemberCardAddComponent', () => {
  let component: MemberCardAddComponent;
  let fixture: ComponentFixture<MemberCardAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberCardAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberCardAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
