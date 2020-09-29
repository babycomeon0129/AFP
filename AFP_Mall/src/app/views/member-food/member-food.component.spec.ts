import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberFoodComponent } from './member-food.component';

describe('MemberFoodComponent', () => {
  let component: MemberFoodComponent;
  let fixture: ComponentFixture<MemberFoodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberFoodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
